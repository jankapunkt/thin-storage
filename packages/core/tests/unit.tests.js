/* eslint-env mocha */
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { ThinStorage } from '../lib/ThinStorage.js'

const getDocs = storage => [...storage.documents.values()]
const expectAsyncError = async ({ promise, onError }) => {
  try {
    await promise
  } catch (e) {
    return onError(e)
  }
  expect.fail('expected function to throw an error')
}

describe('Storage', () => {
  describe('find / query', () => {
    it('works with a single primary key string')
    it('works with a list of primary key strings')
    it('works with an object of key value pairs')
    it('works with an object of key value-list pairs')
    it('returns docs with limit', async () => {
      const storage = new ThinStorage({
        handler: {
          async insert () { return ['id1', 'id2'] }
        }
      })
      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      await storage.insert(docs)
      expect(storage.find(null, { limit: 1 })).to.deep.equal([
        { id: 'id1', foo: 'bar' }
      ])
    })
  })
  describe('no handler', () => {
    it('fetches no docs', async () => {
      const storage = new ThinStorage()
      const fetched = await storage.fetch({})
      expect(fetched).to.equal(-1)
      expect(storage.find()).to.deep.equal([])
    })
    it('inserts new documents without primary keys', async () => {
      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      const storage = new ThinStorage()
      const ids = await storage.insert(docs)
      expect(ids.length).to.equal(2)
      expect(getDocs(storage)).to.deep.equal([
        { id: '0000000000000001', foo: 'bar' },
        { id: '0000000000000002', bar: 'baz' }]
      )
      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
    it('updates existing documents by given modifier doc', async () => {
      const docs = [{ foo: 'bar', yolo: 1 }, { bar: 'baz', yolo: 1 }]
      const storage = new ThinStorage()
      await storage.insert(docs[0])
      await storage.insert(docs[1])
      const updated1 = await storage.update({ foo: 'bar' }, { foo: 'moo' })
      expect(updated1).to.equal(1)
      expect(storage.find()).to.deep.equal([
        { id: '0000000000000004', bar: 'baz', yolo: 1 },
        { id: '0000000000000003', foo: 'moo', yolo: 1 }
      ])

      const updated2 = await storage.update({ foo: 'moo' }, { foo: null })
      expect(updated2).to.equal(1)
      expect(storage.find()).to.deep.equal([
        { id: '0000000000000004', bar: 'baz', yolo: 1 },
        { id: '0000000000000003', yolo: 1 }
      ])

      const updated3 = await storage.update(doc => 'bar' in doc, { foo: 'baz' })
      expect(updated3).to.equal(1)
      expect(storage.find()).to.deep.equal([
        { id: '0000000000000003', yolo: 1 },
        { id: '0000000000000004', bar: 'baz', foo: 'baz', yolo: 1 }
      ])

      const updated4 = await storage.update({ yolo: 1 }, { yolo: value => value + 2 })
      expect(updated4).to.equal(2)
      expect(storage.find()).to.deep.equal([
        { id: '0000000000000003', yolo: 3 },
        { id: '0000000000000004', bar: 'baz', foo: 'baz', yolo: 3 }
      ])

      const updated5 = await storage.update('idabcdef', { moo: 0 })
      expect(updated5).to.equal(0)
      expect(storage.find()).to.deep.equal([
        { id: '0000000000000003', yolo: 3 },
        { id: '0000000000000004', bar: 'baz', foo: 'baz', yolo: 3 }
      ])
    })
    it('removes existing documents by query', async () => {
      const docs = [{ foo: 'bar', yolo: 1 }, { bar: 'baz', yolo: 1 }, { moo: 'baz', yolo: 1 }]
      const storage = new ThinStorage()
      await storage.insert(docs)

      const removed = await storage.remove({ nope: 'whatever' })
      expect(removed).to.equal(0)
      expect(storage.find()).to.deep.equal([
        { id: '0000000000000005', foo: 'bar', yolo: 1 },
        { id: '0000000000000006', bar: 'baz', yolo: 1 },
        { id: '0000000000000007', moo: 'baz', yolo: 1 }
      ])

      const removed1 = await storage.remove(doc => 'bar' in doc)
      expect(removed1).to.equal(1)
      expect(storage.find()).to.deep.equal([
        { id: '0000000000000005', foo: 'bar', yolo: 1 },
        { id: '0000000000000007', moo: 'baz', yolo: 1 }
      ])

      const removed2 = await storage.remove({ yolo: 1 })
      expect(removed2).to.equal(2)
      expect(storage.find()).to.deep.equal([])
    })
  })
  describe('single handler middleware', () => {
    it('fetches docs from the handlers', async () => {
      const storage = new ThinStorage({
        name: 'testStorage',
        handler: {
          async fetch (query) {
            return docs
          }
        }
      })
      const docs = [{ id: 'id1', foo: 'bar' }, { id: 'id2', bar: 'baz' }]
      await storage.fetch()
      expect(storage.find()).to.deep.equal(docs)
    })
    it('fetches and replaces existing docs with the remote', async () => {
      const storage = new ThinStorage({
        name: 'testStorage',
        handler: {
          async insert (documents, options, primaries) {
            expect(documents).to.deep.equal(docs)
            expect(options).to.deep.equal({ name: 'testStorage', primary: 'id' })
            return ['id1', 'id2']
          },
          async fetch () {
            return [{
              id: 'id1', foo: 'moo', yolo: 1
            }]
          }
        }
      })
      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      await storage.insert(docs)

      expect(getDocs(storage)).to.deep.equal([
        { id: 'id1', foo: 'bar' },
        { id: 'id2', bar: 'baz' }
      ])

      await storage.fetch()
      expect(getDocs(storage)).to.deep.equal([
        { id: 'id2', bar: 'baz' },
        { id: 'id1', foo: 'moo', yolo: 1 }
      ])
    })
    it('inserts new documents with primary keys', async () => {
      const storage = new ThinStorage({
        name: 'testStorage',
        handler: {
          async insert (documents, options, primaries) {
            expect(documents).to.deep.equal(docs)
            expect(options).to.deep.equal({ name: 'testStorage', primary: 'id' })
            return ['id1', 'id2']
          }
        }
      })
      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      const ids = await storage.insert(docs)
      expect(ids).to.deep.equal(['id1', 'id2'])
      expect(getDocs(storage)).to.deep.equal([
        { id: 'id1', foo: 'bar' },
        { id: 'id2', bar: 'baz' }
      ])
      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
    it('does not insert if an error occurs', async () => {
      const storage = new ThinStorage({
        handler: {
          async insert () {
            throw new Error('expected error')
          }
        }
      })
      const docs = [{ foo: 'bar' }, { bar: 'baz' }]

      await expectAsyncError({
        promise: storage.insert(docs),
        onError: e => {
          expect(e.message).to.equal('expected error')
        }
      })
      expect(getDocs(storage)).to.deep.equal([])

      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
    it('updates docs by query and modifier', async () => {
      const storage = new ThinStorage({
        handler: {
          async insert () {
            return ['id1', 'id2']
          },
          async update (documents, modifier, options, updated) {
            return updated
          }
        }
      })

      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      await storage.insert(docs)

      // by match query
      const updated = await storage.update({ foo: 'bar' }, { foo: 'moo' })
      expect(updated).to.equal(1)
      expect(storage.find()).to.deep.equal([
        { id: 'id2', bar: 'baz' },
        { id: 'id1', foo: 'moo' }
      ])

      // by primary
      const updated2 = await storage.update('id2', { foo: 'moo' })
      expect(updated2).to.equal(1)
      expect(storage.find()).to.deep.equal([
        { id: 'id1', foo: 'moo' },
        { id: 'id2', bar: 'baz', foo: 'moo' }
      ])

      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
    it('it catches and reports errors during update', async () => {
      const storage = new ThinStorage({
        handler: {
          async insert () {
            return ['id1', 'id2']
          },
          async update (documents, modifier, options, updated) {
            throw new Error('expected update error')
          }
        }
      })

      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      await storage.insert(docs)

      await expectAsyncError({
        promise: storage.update({ foo: 'bar' }, { foo: 'moo' }),
        onError: e => {
          expect(e.message).to.deep.equal('expected update error')
        }
      })

      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
    it('it removes docs by given query', async () => {
      const storage = new ThinStorage({
        handler: {
          async insert () {
            return ['id1', 'id2']
          },
          async remove (documents, options, removed) {
            expect(removed).to.deep.equal(['id1', 'id2'])
            return removed
          }
        }
      })
      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      await storage.insert(docs)
      const removed = await storage.remove({})
      expect(removed).to.equal(2)
      expect(storage.find()).to.deep.equal([])
      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
    it('it catches and reports errors during remove', async () => {
      const storage = new ThinStorage({
        handler: {
          async insert () {
            return ['id1', 'id2']
          },
          async remove (documents, options, removed) {
            throw new Error('expected remove error')
          }
        }
      })
      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      await storage.insert(docs)
      await expectAsyncError({
        promise: storage.remove({}),
        onError: e => expect(e.message).to.equal('expected remove error')
      })

      expect(storage.find()).to.deep.equal([{ id: 'id1', foo: 'bar' }, { id: 'id2', bar: 'baz' }])
      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
  })
  describe('multiple handler middleware', () => {
    it('allows to pre-process insert docs with middleware', async () => {
      const storage = new ThinStorage({
        handler: [
          {
            async insert (documents, options, primaries) {
              documents.forEach(doc => {
                doc.yolo = 1
              })
              expect(primaries).to.deep.equal([])
              return ['1', '2']
            }
          },
          {
            async insert (documents, options, primaries) {
              documents.forEach(doc => expect(doc.yolo).to.equal(1))
              expect(primaries).to.deep.equal(['1', '2'])
              return ['id1', 'id2']
            }
          }
        ]
      })

      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      const ids = await storage.insert(docs)
      expect(ids).to.deep.equal(['id1', 'id2'])
      expect(getDocs(storage)).to.deep.equal([
        { id: 'id1', foo: 'bar', yolo: 1 },
        { id: 'id2', bar: 'baz', yolo: 1 }
      ])
      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
    it('allows to pre-process update docs with middleware', async () => {
      const storage = new ThinStorage({
        handler: [
          {
            async insert (documents, options, primaries) {
              return ['id1', 'id2']
            },
            async update (documents, modifier, options, updated) {
              // remove last doc, which we won't delete
              // as this middleware has decided
              documents.pop()
              updated.pop()
              return updated
            }
          },
          {
            async update (documents, modifier, options, updated) {
              expect(documents.length).to.equal(1)
              expect(updated.length).to.equal(1)
              return updated
            }
          }
        ]
      })

      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      const ids = await storage.insert(docs)
      expect(ids).to.deep.equal(['id1', 'id2'])
      expect(storage.find()).to.deep.equal([
        { id: 'id1', foo: 'bar' },
        { id: 'id2', bar: 'baz' }
      ])

      const updated = await storage.update({}, { yolo: 1 })
      expect(updated).to.equal(1)
      expect(storage.find()).to.deep.equal([
        { id: 'id2', bar: 'baz' },
        { id: 'id1', foo: 'bar', yolo: 1 }
      ])

      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
    it('allows to pre-process remove docs with middleware')
  })
})
