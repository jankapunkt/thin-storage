/**
 * Holds a reference to a document in the storage.
 * The reference can be swapped using the {Document.set} method,
 * which in turn allows updating documents in the set without removing them.
 * @class
 * @internal
 */
class Document {
  /**
   * Creates a new instance. Requires a target document object.
   * @param target {object} the document object to point to.
   * @constructor
   */
  constructor (target) { this.set(target) }

  /**
   * Returns the referenced document.
   * @method
   * @returns {object}
   */
  get () { return refs.get(this) }

  /**
   * Establishes a reference (= points) to the target document object.
   * @method
   * @throws {TypeError} if the document is not of type 'object'
   * @param target {object} the document object to point to
   */
  set (target) {
    if (typeof target !== 'object') {
      throw new TypeError(`Expected object, got ${target}`)
    }
    refs.set(this, target)
  }
}

/**
 * Stores the actual reference to the documents.
 * Each reference is keyed by each {Document} instance.
 * @type {WeakMap<object, object>}
 * @private
 */
const refs = new WeakMap()

/**
 * Creates a new Document instance by given document object
 * @param doc {object} the document object to reference
 * @return {Document} a Document instance
 */
export const createDocument = doc => new Document(doc)
