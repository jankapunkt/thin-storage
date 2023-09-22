export function createDocument(doc: object): Document;
/**
 * Holds a reference to a document in the storage.
 * The reference can be swapped using the {set} method,
 * which in turn allows updating documents in the set without removing them.
 * @class
 * @internal
 */
declare class Document {
    /**
     * Creates a new instance. Requires a target document object.
     * @param target {object} the document object to point to.
     * @constructor
     */
    constructor(target: object);
    /**
     * Returns the referenced document.
     * @method
     * @returns {object}
     */
    get(): object;
    /**
     * Establishes a reference (= points) to the target document object.
     * @method
     * @throws {TypeError} if the document is not of type 'object'
     * @param target {object} the document object to point to
     */
    set(target: object): void;
}
export {};
