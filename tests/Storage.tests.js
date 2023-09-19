/* global beforeEach afterEach */
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Storage } from '../lib/Storage.js'

const getDocs = storage => [...storage.documents]
const expectAsyncError = async ({ promise, onError }) => {
  try {
    await promise
  } catch (e) {
    return onError(e)
  }
  expect.fail('expected function to throw an error')
}

describe('Storage', () => {
  describe('no handler', () => {
    it('inserts new documents without primary keys', async () => {
      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      const storage = new Storage()
      const ids = await storage.insert(docs)
      expect(ids.length).to.equal(0)
      expect(getDocs(storage)).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
    it('updates existing documents by given modifier doc', async () => {
      const docs = [{ foo: 'bar', yolo: 1 }, { bar: 'baz', yolo: 1 }]
      const storage = new Storage()
      await storage.insert(docs)
      const updated1 = await storage.update({ foo: 'bar' }, { foo: 'moo' })
      expect(updated1).to.equal(1)
      expect(getDocs(storage)).to.deep.equal([{ foo: 'moo', yolo: 1 }, { bar: 'baz', yolo: 1 }])

      const updated2 = await storage.update({ foo: 'moo' }, { foo: null })
      expect(updated2).to.equal(1)
      expect(getDocs(storage)).to.deep.equal([{ yolo: 1 }, { bar: 'baz', yolo: 1 }])

      const updated3 = await storage.update(doc => 'bar' in doc, { foo: 'baz' })
      expect(updated3).to.equal(1)
      expect(getDocs(storage)).to.deep.equal([{ yolo: 1 }, { bar: 'baz', foo: 'baz', yolo: 1 }])

      const updated4 = await storage.update({ yolo: 1 }, doc => doc.yolo + 2)
      expect(updated4).to.equal(2)
      expect(getDocs(storage)).to.deep.equal([{ yolo: 3 }, { bar: 'baz', foo: 'baz', yolo: 3 }])

      const updated5 = await storage.update('idabcdef', { moo: 0 })
      expect(updated5).to.equal(0)
      expect(getDocs(storage)).to.deep.equal([{ yolo: 3 }, { bar: 'baz', foo: 'baz', yolo: 3 }])
    })
  })
  describe('with handler', () => {
    it('inserts new documents with primary keys', async () => {
      const storage = new Storage({
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
      const storage = new Storage({
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
      const storage = new Storage({
        handler: {
          async insert () {
            return ['id1', 'id2']
          },
          async update (documents, update) {
            return documents.length
          }
        }
      })

      const docs = [{ foo: 'bar' }, { bar: 'baz' }]
      await storage.insert(docs)

      // by match query
      const updated = await storage.update({ foo: 'bar' }, { foo: 'moo' })
      expect(updated).to.equal(1)
      expect(storage.documents[0]).to.deep.equal({ id: 'id1', foo: 'moo' })
      expect(storage.documents[1]).to.deep.equal({ id: 'id2', bar: 'baz' })

      // by primary
      const updated2 = await storage.update('id2', { foo: 'moo' })
      expect(updated2).to.equal(1)
      expect(storage.documents[0]).to.deep.equal({ id: 'id1', foo: 'moo' })
      expect(storage.documents[1]).to.deep.equal({ id: 'id2', bar: 'baz', foo: 'moo' })

      // original docs unaltered
      expect(docs).to.deep.equal([{ foo: 'bar' }, { bar: 'baz' }])
    })
    it('it catches and reports errors during update')
    it('it removes docs by given query')
    it('it catches and reports errors during remove')
  })
  describe('with middleware', function () {
    it('allows to pre-process insert docs with middleware', async () => {
      const storage = new Storage({
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
    it('allows to pre-process update docs with middleware')
    it('allows to pre-process remove docs with middleware')
  })
})
