import { randomHex } from './utils.js'

export class WebStorageHandler {
  constructor (webStorage) {
    this.storage = webStorage
  }

  async fetch (query, options) {
    // we ignore query in these tests
    const { name, primary } = options
    const docs = fromStorage({ name, storage: this.storage })
    return docs.filter(doc => primary in doc)
  }

  async insert (documents, options) {
    const {  name, primary } = options
    const { storage } = this
    const docs = fromStorage({ name, storage })
    const primaries = []

    documents.forEach(doc => {
      const key = randomHex(8)
      doc[primary] = key
      docs.push(doc)
      primaries.push(key)
    })

    toStorage({ docs, name, storage })
    return primaries
  }

  async update (documents, modifier, options, updated) {
    const {  name, primary } = options
    const { storage } = this
    const docs = fromStorage({ name, storage })

    updated.forEach(doc => {
      const target = docs.findIndex(d => d[primary] === doc[primary])
      if (target > -1) {
        docs[target] = doc
      }
    })

    toStorage({ docs, name, storage })
    return updated
  }
}

const toStorage = ({ docs = [], storage, name }) => {
  let str
  try {
    str = JSON.stringify(docs, null, 0)
  } catch (e) {
    str = '[]'
  }
  storage.setItem(name, str)
}

const fromStorage = ({ name, storage }) => {
  const docsStr = storage.getItem(name) || '[]'
  let docs

  try {
    docs = JSON.parse(docsStr) || []
  } catch (e) {
    console.error(e)
    return []
  }

  if (!Array.isArray(docs)) { return [] }
  return docs
}

