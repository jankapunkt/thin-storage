/* eslint-env mocha */
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createDocument } from '../lib/Document.js'

describe(createDocument.name, () => {
  it('throws if the target is not an object type', () => {
    [true, false, 1, () => {}, '12312321'].forEach(target => {
      expect(() => createDocument(target))
        .to.throw(`Expected object, got ${target}`)
    })
  })
  it('creates a referable document', () => {
    const obj1 = {}
    const obj2 = {}
    const document = createDocument(obj1)
    expect(document.constructor.name).to.equal('Document')
    expect(document.get()).to.equal(obj1)
    expect(document.get()).to.not.equal(obj2)

    // swap refs
    document.set(obj2)
    expect(document.get()).to.equal(obj2)
    expect(document.get()).to.not.equal(obj1)
  })
})