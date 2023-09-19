export class Storage {
  constructor (options = {}) {
    this.documents = new Set()
    this.keys = new Map()

    this.name = options.name
    this.primary = options.primary || 'id'
    this.handler = options.handler
        ? Array.isArray(options.handler)
          ? options.handler
          : [options.handler]
        : []
    this.hasInsert = this.handler.find(h => !!h.insert)
    this.hasUpdate = this.handler.find(h => !!h.update)
    this.hasRemove = this.handler.find(h => !!h.remove)
  }



  async insert (documents = []) {
    const local = shallowCopies(documents)
    let primaries = []

    if (this.hasInsert) {
      const options = getOptions(this)

      // this runs a middleware stack on the shallow copies of the docs
      // which might even alter the size and the signature of the docs
      // as long as the last return value is the array with the primary keys
      // which is also passed as third argument in order to allow
      // throughput until the end, in case it has been created
      // before the last handler in the stack
      for (const handler of this.handler) {
        primaries = await handler.insert(local, options, primaries)
      }

      if (!primaries || primaries.length !== local.length) {
        throw new Error(`Insert return values expected to be same length (${primaries.length}) as docs (${local.length}) in storage ${this.name}`)
      }

      local.forEach((doc, index) => {
        const key = primaries[index]
        doc[this.primary] = key
        this.keys.set(key, doc)
      })
    }

    local.forEach(doc => this.documents.add(doc))
    local.length = 0
    return primaries
  }

  async update (query, modifier) {
    const local = shallowCopies(this.find(query))
    let deltas = []

    if (typeof modifier === 'object') {
      const entries = Object.entries(modifier)

      local.forEach(doc => {
        entries.forEach(([key, value]) => {

        })
      })
    }

    if (this.hasUpdate) {

    }
  }

  async remove (query) {
    const local = shallowCopies(this.find(query))
    let removed = []

    if (this.hasRemove) {
      const options = getOptions(this)

      for (const handler of this.handler) {
        removed = await handler.remove(local, options, removed)
      }
    }
  }

  find (query, options) {
    const queryType = typeof query

    if (queryType === 'string') {
      // string query is expected to be a primary key
      return this.keys.get(query)
    }

    // TODO use iterator to implement limit
    const { limit } = options

    if (queryType === 'function') {
      const docs = this.documents.values()
      return filterDocs({ docs, limit, query })
    }

    if (queryType === 'object') {
      const { looseMatching } = options
      const entries = Object.keys(query)
      const byMatcher = doc => entries.every(([key, value]) => {
        return looseMatching
          ? doc[key] == value
          : doc[key] === value
      })
      const docs = this.documents.values()
      return filterDocs({ docs, limit, query: byMatcher })
    }

    throw new Error(`Unsupported query type "${queryType}"`)
  }
}

const shallowCopies = docs => docs.map(doc => ({ ...doc }))
const getOptions = ({ primary, name }) => ({ primary, name })
const filterDocs = ({ docs, query, limit }) => {
  const filtered = []
  for (const doc of docs) {
    if (query(doc)) {
      filtered.push(doc)
    }
    if (limit && filtered >= limit) {
      return filtered
    }
  }
  return filtered
}