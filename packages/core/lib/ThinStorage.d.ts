/**
 * change event.
 *
 * @event Storage#change
 * @type {object}
 * @property {object} options
 * @property {string} options.type - the type this change is associated with
 */
/**
 * remove event.
 *
 * @event Storage#remove
 * @type {object}
 * @property {string[]} keys - the list of removed keys
 */
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
    constructor(options?: object | undefined);
    documents: any;
    keys: any;
    hooks: any;
    name: any;
    primary: any;
    idGen: any;
    handler: any[];
    hasInsert: any;
    hasUpdate: any;
    hasRemove: any;
    hasFetch: any;
    /**
     * Adds a new listener function to a given event.
     * @param name {string} name of the event
     * @param fn {function} handler to run on emit
     * @return {function(): *} returns a function to remove the listener
     */
    on(name: string, fn: Function): () => any;
    /**
     * Clears the local documents without informing the middleware.
     * @fires Storage#remove
     * @fires Storage#change
     */
    clear(): void;
    /**
     * Retrieves documents from a remote source through
     * handlers. If no handlers implement the fetch method then
     * nothing is retrieved and -1 is returned.
     *
     * @param query {object}
     * @param options {object=}
     * @return {Promise<number>}
     */
    fetch(query: object, options?: object | undefined): Promise<number>;
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
    insert(documents?: object | object[]): Promise<any[]>;
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
    update(query: any, modifier: any, options?: {}): Promise<any>;
    /**
     * Removes documents from the storage by given query.
     * If a middleware with remove implementation does not exist then the change is applied immediately.
     * @param query {object|string|string[]|function}
     * @param options {object=}
     * @return {Promise<number>} the number of removed documents
     */
    remove(query: object | string | string[] | Function, options?: object | undefined): Promise<number>;
    /**
     *
     * @param query
     * @param options
     * @return {unknown[]|*[]}
     */
    find(query: any, options?: {}): unknown[] | any[];
}
