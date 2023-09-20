/**
 * Minimal storage interface using a middleware stack.
 */
export class ThinStorage {
  /**
   * creates a new instance
   * @param {object=} options
   * @param {string} [options.set=new Set()]
   * @param {string} [options.name='storage']
   * @param {string} [options.primary='id']
   * @param {object[]|object} [options.handler=[]]
   */
  constructor (options = {}) {
    this.documents = options.documents || []
    this.keys = new Map()

    this.name = options.name || 'storage'
    this.primary = options.primary || 'id'
    this.setHandler(options.handler)
    this.listeners = new Map(Object.entries({
      change: new Set()
    }))
  }

  /**
   * Sets the middleware stack of handlers.
   * @param {object[]|object} [handler=[]]
   */
  setHandler (handler = []) {
    this.handler = toArray(handler)
    this.hasInsert = this.handler.find(h => !!h.insert)
    this.hasUpdate = this.handler.find(h => !!h.update)
    this.hasRemove = this.handler.find(h => !!h.remove)
    this.hasFetch = this.handler.find(h => !!h.fetch)
  }

  on (name, listener) {
    const list = this.listeners.get(name)
    if (!list) { return }
    list.add(listener)
  }

  off (name, listener) {
    const list = this.listeners.get(name)
    if (!list) { return }
    if (listener) {
      list.remove(listener)
    }
    else {
      list.clear()
    }
  }

  emit (name, options) {
    const listeners = this.listeners.get(name)
    if (!listeners?.size) { return }
    const data = { ...options, size: this.documents.size }
    listeners.forEach(fn => setTimeout(() => {
      try { fn(data) } catch (e) { console.error(e) }
    }, 0))
  }

  /**
   * Clears the local documents and primary keys.
   */
  clear () {
    this.documents.length = 0
    this.keys.clear()
    this.emit('change', { type: 'clear' })
  }

  /**
   * Retrieves documents from a remote source through
   * handlers. If no handlers implement the fetch method then
   * nothing is retrieved and -1 is returned.
   *
   * @param query {object}
   * @param options {object=}
   * @return {Promise<number>}
   */
  async fetch (query, options) {
    if (!this.hasFetch) { return -1 }

    let documents = []
    const fetchOptions = { ...options, ...getOptions(this) }

    for (const handler of this.handler) {
      if (handler.fetch) {
        documents = await handler.fetch(query, fetchOptions, documents)
      }
    }

    documents.forEach(doc => {
      const key = doc[this.primary]

      if (!key) {
        throw new Error(`Expected document to have primary key "${this.primary}"`)
      }

      if (this.keys.has(key)) {
        const index = this.keys.get(key)
        this.documents[index] = doc
      }
      else {
        this.keys.set(key, this.documents.length)
        this.documents.push(doc)
      }
    })

    this.emit('change', { type: 'fetch' })
    return documents.length
  }

  /**
   *  Inserts new documents into the storage.
   *
   *  If middleware does not exist, it simply inserts
   *  the documents with a default primary key (incremented number).
   *
   *  Otherwise, it runs the middleware stack on the shallow copies of the docs.
   *  Handlers might even alter the size and the signature of the docs
   *  as long as the last return value is the array with the primary keys
   *  which is also passed as third argument in order to allow
   *  throughput until the end, in case it has been created
   *  before the last handler in the stack.
   *
   *  There is no insert operation, if any middleware throws an error.
   *
   * @param {object|object[]} documents
   * @return {Promise<*[]>}
   */
  async insert (documents) {
    if (!documents || documents.length === 0) {
      throw new Error('Can\'t insert nothing')
    }
    documents = toArray(documents)
    const local = shallowCopies(documents)
    let primaries = []

    if (this.hasInsert) {
      const options = getOptions(this)

      for (const handler of this.handler) {
        if (handler.insert) {
          primaries = await handler.insert(local, options, primaries)
        }
      }

      if (!primaries || primaries.length !== local.length) {
        throw new Error(`Insert return values expected to be of length (${primaries.length}), got (${local.length}) in storage ${this.name}`)
      }
    }
    else {
      primaries = local.map(() => incrementKey())
    }

    local.forEach((doc, index) => {
      const key = primaries[index]
      doc[this.primary] = key
      this.keys.set(key, this.documents.length)
      this.documents.push(doc)
    })

    this.emit('change', { type: 'insert' })
    local.length = 0
    return primaries
  }

  /**
   * Updates documents by a given query and modifier.
   * If no middleware exists then the update is applied immediately.
   * Otherwise, it runs through all functions in the middleware stack
   * and awaits the updated array as result.
   *
   * The updated array must be the same length as the documents selected.
   * Note: middleware can alter or filter the documents.
   *
   * If a middleware throws an error then there will be no update at all.
   *
   * @param query
   * @param modifier
   * @param options
   * @return {Promise<*>}
   */
  async update (query, modifier, options = {}) {
    if (this.primary in modifier) {
      throw new Error(`Unexpected primary in modifier in store ${this.name}`)
    }

    const local = shallowCopies(this.find(query, options))
    const entries = Object.entries(modifier)
    let updated = local.map(doc => {
      const copy = ({ ...doc })

      entries.forEach(([key, value]) => {
        const val = typeof value === 'function'
          ? value(copy[key])
          : value
        if (val === null) {
          delete copy[key]
        }
        else if (val !== undefined) {
          copy[key] = val
        }
      })
      return copy
    })

    if (this.hasUpdate) {
      const updateOptions = { ...options, ...getOptions(this) }
      for (const handler of this.handler) {
        if (handler.update) {
          updated = await handler.update(local, modifier, updateOptions, updated)
        }
      }

      if (updated.length !== local.length) {
        throw new Error(`Update return values expected to be of length (${updated.length}), got (${local.length}) in storage ${this.name}`)
      }
    }

    updated.forEach(doc => {
      const key = doc[this.primary]
      const index = this.keys.get(key)

      if (!index) {
        throw new Error(`Doc not found by primary key ${key}`)
      }
      this.documents[index] = doc
    })

    this.emit('change', { type: 'update' })
    return updated.length
  }

  /**
   * Removes documents from the storage by given query.
   * If a middleware with remove implementation does not exist then the change is applied immediately.
   * @param query {object|string|string[]|function}
   * @param options {object=}
   * @return {Promise<number>} the number of removed documents
   */
  async remove (query, options = {}) {
    const local = shallowCopies(this.find(query, options))
    let removed = local.map(doc => doc[this.primary])

    if (this.hasRemove) {
      const removeOptions = { ...options, ...getOptions(this) }

      for (const handler of this.handler) {
        if (handler.remove) {
          removed = await handler.remove(local, removeOptions, removed)
        }
      }
      if (removed.length !== local.length) {
        throw new Error(`Remove return values expected to be of length (${removed.length}), got (${local.length}) in storage ${this.name}`)
      }
    }

    removed.forEach(key => {
      const index = this.keys.get(key)

      if (!index) {
        throw new Error(`Doc not found by primary key ${key}`)
      }
      this.documents.splice(index, 1)
      this.keys.delete(key)
    })

    this.emit('change', { type: 'remove' })
    return removed.length
  }

  /**
   *
   * @param query
   * @param options
   * @return {unknown[]|*[]}
   */
  find (query, options = {}) {
    const { limit } = options
    const docs = this.documents

    if (!query) {
      return filterDocs({ docs, limit, query: () => true })
    }

    const queryType = typeof query

    if (queryType === 'string') {
      // string query is expected to be a primary key
      const index = this.keys.get(query)
      return typeof index === 'number' ? [this.documents[index]] : []
    }

    if (queryType === 'function') {
      return filterDocs({ docs, limit, query })
    }

    if (queryType === 'object') {
      const { looseMatching } = options
      const entries = Object.entries(query)
      if (entries.length === 0) {
        return filterDocs({ docs, limit, query: () => true })
      }

      const byMatcher = doc => entries.every(([key, value]) => {
        return looseMatching
          ? doc[key] == value // eslint-disable-line
          : doc[key] === value
      })
      return filterDocs({ docs, limit, query: byMatcher })
    }

    throw new Error(`Unsupported query type "${queryType}"`)
  }
}

const toArray = a => Array.isArray(a) ? a : [a]
const shallowCopies = docs => docs.map(doc => ({ ...doc }))
const getOptions = ({ primary, name }) => ({ primary, name })
const filterDocs = ({ docs, query, limit }) => {
  const filtered = []

  for (const doc of docs) {
    if (query(doc)) {
      filtered.push(doc)
    }
    if (limit > 0 && filtered.length >= limit) {
      return filtered
    }
  }

  return filtered
}
const incrementKey = (() => {
  let count = 0
  return (length = 16) => (++count).toString(10).padStart(length, '0')
})()
