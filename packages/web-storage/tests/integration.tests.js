/* eslint-env mocha */
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { ThinStorage } from '../../core/lib/ThinStorage.js'
import { WebStorageHandler } from '../lib/WebStorageHandler.js'
import { randomHex } from '../lib/utils.js'

/**
 * This is an example implementation of the Web Storage API interface.
 */
class LocalStorage {
  constructor () {
    this.items = new Map()
    this.length = 0
  }

  key (n) {
    if (n < 0 || n >= this.items.size) {
      return null
    }
    let count = 0
    const keys = this.items.keys()
    for (const key of keys) {
      if (n === count++) {
        return key
      }
    }
  }

  getItem (name) {
    return this.items.get(name)
  }

  setItem (name, value) {
    this.items.set(name, value)
    this.length = this.items.size
  }

  removeItem (name) {
    this.items.delete(name)
    this.length = this.items.size
  }

  clear () {
    this.items.clear()
    this.length = this.items.size
  }
}

describe('WebStorage', function () {
  it('fetches docs from web storage', async () => {
    const localStorage = new LocalStorage()
    const doc = { id: randomHex(8), foo: 'bar' }
    localStorage.setItem('foo', JSON.stringify([doc]))
    const storage = new ThinStorage({
      name: 'foo',
      handler: new WebStorageHandler(localStorage)
    })

    await storage.fetch()
    expect(storage.find()).to.deep.equal([doc])
  })
  it('inserts docs to web storage', async () => {
    const localStorage = new LocalStorage()
    const doc = { id: randomHex(8), foo: 'bar' }
    localStorage.setItem('foo', JSON.stringify([doc]))
    const storage = new ThinStorage({
      name: 'foo',
      handler: new WebStorageHandler(localStorage)
    })

    const doc2 = { bar: 'baz' }
    await storage.fetch()
    const ids = await storage.insert(doc2)
    expect(ids.length).to.equal(1)
    const expectedDoc2 = { bar: 'baz', id: ids[0] }
    expect(storage.find()).to.deep.equal([doc, expectedDoc2])
    expect(localStorage.getItem('foo')).to.equal(JSON.stringify([doc, expectedDoc2], null, 0))
  })
  it('updates docs in web storage', async ()=> {
    const localStorage = new LocalStorage()
    const docs = [
      { id: randomHex(8), foo: 'bar' },
      { id: randomHex(8), foo: 'baz' },
      { id: randomHex(8), foo: 'baz' },
      { id: randomHex(8), foo: 'bar' },
    ]
    const clone = docs.map(entry => ({ ...entry }))
    localStorage.setItem('foo', JSON.stringify(docs))

    const storage = new ThinStorage({
      name: 'foo',
      handler: [
        {
          async update(documents, modifier, options, updated) {
            return updated
          }
        },
        new WebStorageHandler(localStorage)
      ]
    })

    await storage.fetch()

    const query = { foo: 'baz' }
    const updated = await storage.update(query, { foo: 'moo', yolo: 1 })
    expect(updated).to.equal(2)

    clone[1].foo = 'moo'
    clone[1].yolo = 1
    clone[2].foo = 'moo'
    clone[2].yolo = 1

    const str = JSON.stringify(clone, null, 0)
    expect(localStorage.getItem('foo')).to.equal(str)
  })
  it('removes docs from web storage', async () => {
    const localStorage = new LocalStorage()
    const docs = [
      { id: randomHex(8), foo: 'bar' },
      { id: randomHex(8), foo: 'baz' },
      { id: randomHex(8), foo: 'baz' },
      { id: randomHex(8), foo: 'bar' },
    ]

    localStorage.setItem('foo', JSON.stringify(docs))

    const storage = new ThinStorage({
      name: 'foo',
      handler: [
        new WebStorageHandler(localStorage)
      ]
    })

    await storage.fetch()
    const removed = await storage.remove(docs[2])
    expect(removed).to.equal(1)

    const str = JSON.stringify([docs[0], docs[1], docs[3]], null, 0)
    expect(localStorage.getItem('foo')).to.equal(str)
  })
})