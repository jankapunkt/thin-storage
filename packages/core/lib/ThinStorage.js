import { createDocument } from './Document.js'

/**
 * Minimal storage interface using a middleware stack.
 */
export class ThinStorage {
  /**
   * creates a new instance
   * @param {object=} options
   * @param {string} [options.set=new Set()] provide your own set, for example to make it observable with Vue refs
   * @param {string} [options.name='storage'] name of this storage, passed to middleware
   * @param {string} [options.primary='id'] primary key property name, passed to middleware
   * @param {function} [options.idGen=function():string] override id generation, applies only if no middleware is used
   * @param {object[]|object} [options.handler=[]] the middleware stack of handlers
   */
  constructor (options = {}) {
    this.documents = options.set || new Set()
    this.keys = new Map()
    this.hooks = new Map()

    this.name = options.name || 'storage'
    this.primary = options.primary || 'id'
    this.idGen = options.idGen || incrementKey
    this.handler = options.handler ? toArray(options.handler) : []

    this.handler.forEach(h => {
      this.hasInsert = this.hasInsert || !!h.insert
      this.hasUpdate = this.hasUpdate || !!h.update
      this.hasRemove = this.hasRemove || !!h.remove
      this.hasFetch = this.hasFetch || !!h.fetch
    })
  }

  on (name, fn) {
    this.hooks.get(name)?.add(fn) || this.hooks.set(name, new Set([fn]))
    return () => this.hooks.get(name).remove(fn)
  }

  emit (name, options) {
    const hooks = this.hooks.get(name)
    return hooks && setTimeout(() => hooks.forEach(hook => hook(options)), 0)
  }

  clear () {
    this.documents.clear()
    this.keys.clear()
    this.emit('change')
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

    let fetched = []
    const fetchOptions = { ...options, ...getOptions(this) }

    for (const handler of this.handler) {
      if (handler.fetch) {
        fetched = await handler.fetch(query, fetchOptions, fetched)
      }
    }

    fetched.forEach(doc => {
      const key = doc[this.primary]

      if (!key) {
        throw new Error(`Expected document to have primary key "${this.primary}"`)
      }

      if (this.keys.has(key)) {
        const original = this.keys.get(key)
        original.set(doc)
      } else {
        const wrapped = createDocument(doc)
        this.keys.set(key, wrapped)
        this.documents.add(wrapped)
      }
    })

    this.emit('fetch', { documents: fetched })
    this.emit('change')
    return fetched.length
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
    const local = copy(documents)
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
    } else {
      primaries.length = local.length

      for (let i = 0; i < local.length; i++) {
        primaries[i] = await this.idGen()
      }
    }

    local.forEach((doc, index) => {
      const key = primaries[index]
      doc[this.primary] = key

      const wrapped = createDocument(doc)
      this.keys.set(key, wrapped)
      this.documents.add(wrapped)
    })

    this.emit('insert', { documents: local })
    this.emit('change')
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

    const local = copy(this.find(query, options))
    const entries = Object.entries(modifier)
    let updated = local.map(doc => {
      const copy = ({ ...doc })

      entries.forEach(([key, value]) => {
        const val = typeof value === 'function'
          ? value(copy[key])
          : value
        if (val === null) {
          delete copy[key]
        } else if (val !== undefined) {
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
      const original = this.keys.get(key)

      if (!original) {
        throw new Error(`Doc not found by primary key ${key}`)
      }

      original.set(doc)
    })

    this.emit('update', { documents: updated })
    this.emit('change')
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
    const local = copy(this.find(query, options))
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
      const original = this.keys.get(key)

      if (!original) {
        throw new Error(`Doc not found by primary key ${key}`)
      }

      this.documents.delete(original)
      this.keys.delete(key)
    })

    this.emit('remove', { documents: removed })
    this.emit('change')
    return removed.length
  }

  /**
   *
   * @param query
   * @param options
   * @return {unknown[]|*[]}
   */
  find (query, options = {}) {
    const { limit, looseMatching } = options
    const docs = this.documents

    if (!query) {
      return filterDocs({ docs, limit, query: () => true })
    }

    const isArray = Array.isArray(query)
    const queryType = typeof query

    if (queryType === 'string') {
      // string query is expected to be a primary key
      const doc = this.keys.get(query)
      return doc ? [doc.get()] : []
    }

    if (queryType === 'function') {
      return filterDocs({ docs, limit, query })
    }

    if (queryType === 'object' && !isArray) {
      const entries = Object.entries(query)
      if (entries.length === 0) {
        return filterDocs({ docs, limit, query: () => true })
      }

      const byMatcher = doc => entries.every(([key, value]) =>
        toArray(value)
          .some(val => looseMatching
            ? doc[key] == val // eslint-disable-line
            : doc[key] === val))
      return filterDocs({ docs, limit, query: byMatcher })
    }

    if (isArray) {
      const subs = new Set()
      const add = doc => limit > 0 && subs.length >= limit ? undefined : subs.add(doc)
      for (const q of query) {
        // beware this is a recursion, we hope you know what you are doing
        this.find(q, { looseMatching }).forEach(add)
      }
      return [...subs]
    }

    throw new Error(`Unsupported query type "${queryType}"`)
  }
}

/***********
 * private *
 ***********/

/**
 * Creates shallow copies of a list of given docs
 * @private
 * @param docs
 * @return {*}
 */
const copy = docs => docs.map(doc => ({ ...doc }))

/**
 * Extracts relevant properties to create options object
 * @param primary
 * @param name
 * @return {{name, primary}}
 */
const getOptions = ({ primary, name }) => ({ primary, name })
const filterDocs = ({ docs, query, limit }) => {
  const filtered = []

  for (const wrapped of docs) {
    const doc = wrapped.get()

    if (query(doc)) {
      filtered.push(doc)
    }

    if (limit > 0 && filtered.length >= limit) {
      return filtered
    }
  }

  return filtered
}
const toArray = x => Array.isArray(x) ? x : [x]
const incrementKey = ((count) =>
  (length = 16) => (++count).toString(10).padStart(length, '0'))(0)
