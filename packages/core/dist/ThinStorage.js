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
  constructor (target) { this.set(target); }

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
    refs.set(this, target);
  }
}

/**
 * Stores the actual reference to the documents.
 * Each reference is keyed by each {Document} instance.
 * @type {WeakMap<object, object>}
 * @private
 */
const refs = new WeakMap();

/**
 * Creates a new Document instance by given document object
 * @param doc {object} the document object to reference
 * @return {Document} a Document instance
 */
const createDocument = doc => new Document(doc);

/**
 * Minimal storage interface using a middleware stack.
 * Documentation: https://github.com/jankapunkt/thin-storage
 */
class ThinStorage {
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
    this.documents = options.set || new Set();
    this.keys = new Map();
    this.hooks = new Map();

    this.name = options.name || 'storage';
    this.primary = options.primary || 'id';
    this.idGen = options.idGen || incrementKey;
    this.handler = options.handler ? toArray(options.handler) : [];

    this.handler.forEach(h => {
      this.hasInsert = this.hasInsert || !!h.insert;
      this.hasUpdate = this.hasUpdate || !!h.update;
      this.hasRemove = this.hasRemove || !!h.remove;
      this.hasFetch = this.hasFetch || !!h.fetch;
    });
  }

  /**
   * Adds a new listener function to a given event.
   * @param name {string} name of the event
   * @param fn {function} handler to run on emit
   * @return {function(): *} returns a function to remove the listener
   */
  on (name, fn) {
    this.hooks.get(name)?.add(fn) || this.hooks.set(name, new Set([fn]));
    return () => this.hooks.get(name).remove(fn)
  }

  /**
   * Clears the local documents without informing the middleware.
   * @fires Storage#remove
   * @fires Storage#change
   */
  clear () {
    this.documents.clear();
    const keys = [...this.keys.keys()];
    this.keys.clear();

    /**
     * remove event.
     *
     * @event Storage#remove
     * @type {object}
     * @property {string[]} keys - the list of removed keys
     */
    emit(this, 'remove', { documents: keys });

    /**
     * change event.
     *
     * @event Storage#change
     * @type {object}
     * @property {string} type - the type this change is associated with
     */
    emit(this, 'change', { type: 'clear' });
  }

  /**
   * Retrieves documents from a remote source through
   * handlers. If no handlers implement the fetch method then
   * nothing is retrieved and -1 is returned.
   *
   * @param query {object}
   * @param options {object=}
   * @fires Storage#fetch
   * @fires Storage#change
   * @throws {Error} if any fetched document contains no primary key
   * @return {Promise<number>}
   */
  async fetch (query, options) {
    if (!this.hasFetch) { return -1 }

    let fetched = [];
    const fetchOptions = { ...options, ...getOptions(this) };

    for (const handler of this.handler) {
      if (handler.fetch) {
        fetched = await handler.fetch(query, fetchOptions, fetched);
      }
    }

    fetched.forEach((doc, i) => {
      const key = doc[this.primary];

      if (!key) {
        throw new Error(`Expected fetched document at index ${i} to have primary key "${this.primary}"`)
      }

      if (this.keys.has(key)) {
        const original = this.keys.get(key);
        original.set(doc);
      } else {
        const wrapped = createDocument(doc);
        this.keys.set(key, wrapped);
        this.documents.add(wrapped);
      }
    });

    /**
     * fetch event.
     *
     * @event Storage#fetch
     * @type {object}
     * @property {object[]} documents - the list of fetched document objects
     */
    emit(this, 'fetch', { documents: fetched });
    emit(this, 'change', { type: 'fetch' });
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
   * @fires Storage#insert
   * @fires Storage#change
   * @throws {Error} if handler returns a list of primaries with a different length of documents to be inserted
   * @return {Promise<Array.<Object>>}
   */
  async insert (documents = []) {
    documents = toArray(documents);
    const local = copy(documents);
    let primaries = [];

    if (this.hasInsert) {
      const options = getOptions(this);

      for (const handler of this.handler) {
        if (handler.insert) {
          primaries = await handler.insert(local, options, primaries);
        }
      }

      if (!primaries || primaries.length !== local.length) {
        throw new Error(`Insert return values expected to be of length (${primaries.length}), got (${local.length}) in storage ${this.name}`)
      }
    } else {
      primaries.length = local.length;

      for (let i = 0; i < local.length; i++) {
        primaries[i] = await this.idGen();
      }
    }
    local.forEach((doc, index) => {
      const key = primaries[index];
      doc[this.primary] = key;

      const wrapped = createDocument(doc);
      this.keys.set(key, wrapped);
      this.documents.add(wrapped);
    });

    /**
     * insert event.
     *
     * @event Storage#insert
     * @type {object}
     * @property {object[]} documents - the list of inserted document objects
     */
    emit(this, 'insert', { documents: local });
    emit(this, 'change', { type: 'insert' });
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
   * @param {object} query
   * @param {object} [options={}]
   * @param {boolean} [options.strict=] optional strict mode used to check for equal length queried and updated docs
   * @param {boolean} [options.strict=false]
   * @return {Promise<*>}
   */
  async update (query, modifier = {}, options = {}) {
    const local = copy(this.find(query, options));
    const entries = Object.entries(modifier);
    let updated = local.map(doc => {
      const copy = ({ ...doc });

      entries.forEach(([key, value]) => {
        const val = typeof value === 'function'
          ? value(copy[key])
          : value;
        if (val === null) {
          delete copy[key];
        } else if (val !== undefined) {
          copy[key] = val;
        }
      });
      return copy
    });

    if (this.hasUpdate) {
      const updateOptions = { ...options, ...getOptions(this) };
      for (const handler of this.handler) {
        if (handler.update) {
          updated = await handler.update(local, modifier, updateOptions, updated);
        }
      }

      if (options.strict && updated.length !== local.length) {
        throw new Error(`Update return values expected to be of length (${local.length}), got (${updated.length}) in storage ${this.name}`)
      }
    }

    updated.forEach(doc => {
      const key = doc[this.primary];
      const wrapped = this.keys.get(key);

      if (!wrapped) {
        throw new Error(`Doc not found by primary key ${key} in storage ${this.name}`)
      }

      wrapped.set(doc);
    });

    emit(this, 'update', { documents: updated });
    emit(this, 'change', { type: 'update' });
    return updated.length
  }

  /**
   * Removes documents from the storage by given query.
   * If a middleware with remove implementation does not exist then the change is applied immediately.
   * @param query {object|string|string[]|function}
   * @param {object} [options={}]
   * @param {boolean} [options.strict=] optional strict mode used to check for equal length queried and removed docs
   * @return {Promise<number>} the number of removed documents
   */
  async remove (query, options = {}) {
    const local = copy(this.find(query, options));
    let removed = local.map(doc => doc[this.primary]);

    if (this.hasRemove) {
      const removeOptions = { ...options, ...getOptions(this) };

      for (const handler of this.handler) {
        if (handler.remove) {
          removed = await handler.remove(local, removeOptions, removed);
        }
      }
      if (options.strict && removed.length !== local.length) {
        throw new Error(`Remove return values expected to be of length (${local.length}), got (${removed.length}) in storage ${this.name}`)
      }
    }

    removed.forEach(key => {
      const original = this.keys.get(key);

      if (!original) {
        throw new Error(`Doc not found by primary key ${key} in storage ${this.name}`)
      }

      this.documents.delete(original);
      this.keys.delete(key);
    });

    emit(this, 'remove', { documents: removed });
    emit(this, 'change', { type: 'remove' });
    return removed.length
  }

  /**
   * Select documents from the set by a given selector pattern (query).
   * @param {object|object[]|string|string[]|function|undefined} query
   * @param {object} [options={}]
   * @param {boolean} [options.loose=] use to check loosely (==) instead of strict (===)
   * @param {number} [options.limit=] limits the amount of documents to add to the result
   * @returns {object[]}
   */
  find (query, options = {}) {
    const { limit, loose } = options;
    const docs = this.documents;

    if (typeof query === 'undefined' || query === null) {
      return filterDocs({ docs, limit, query: () => true })
    }

    const isArray = Array.isArray(query);
    const queryType = typeof query;

    if (queryType === 'string') {
      // string query is expected to be a primary key
      const doc = this.keys.get(query);
      return doc ? [doc.get()] : []
    }

    if (queryType === 'function') {
      return filterDocs({ docs, limit, query })
    }

    if (queryType === 'object' && !isArray) {
      const entries = Object.entries(query);
      if (entries.length === 0) {
        return filterDocs({ docs, limit, query: () => true })
      }

      const byMatcher = doc => entries.every(([key, value]) =>
        toArray(value)
          .some(val => loose
            ? doc[key] == val // eslint-disable-line
            : doc[key] === val));
      return filterDocs({ docs, limit, query: byMatcher })
    }

    if (isArray) {
      const subs = new Set();
      const add = doc => limit > 0 && subs.size >= limit ? undefined : subs.add(doc);
      for (const q of query) {
        // beware this is a recursion, we hope you know what you are doing
        this.find(q, { loose }).forEach(add);
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
const copy = docs => docs.map(doc => ({ ...doc }));

/**
 * Emitter function; extracted, so it can't be invoked from external.
 * @private
 * @param self
 * @param name
 * @param options
 * @return {*|number}
 */
const emit = (self, name, options) => {
  const hooks = self.hooks.get(name);
  return hooks && setTimeout(() => hooks.forEach(hook => hook(options)), 0)
};
/**
 * Extracts relevant properties to create options object
 * @private
 * @param primary
 * @param name
 * @return {{name, primary}}
 */
const getOptions = ({ primary, name }) => ({ primary, name });

/**
 * Applies query to each document and adds the document to the list,
 * if conditions apply and (optional) limit is not reached.
 * @private
 * @param docs
 * @param query
 * @param limit
 * @return {object[]}
 */
const filterDocs = ({ docs, query, limit }) => {
  const filtered = [];

  for (const wrapped of docs) {
    const doc = wrapped.get();

    if (query(doc)) {
      filtered.push(doc);
    }

    if (limit > 0 && filtered.length >= limit) {
      return filtered
    }
  }

  return filtered
};
/**
 * Transform any incoming argument to an array.
 * @private
 * @param x {*}
 * @return {Array.<*>}
 */
const toArray = x => typeof x === 'undefined' ? [] : Array.isArray(x) ? x : [x];
const incrementKey = ((count) =>
  (length = 16) => (++count).toString(10).padStart(length, '0'))(0);

export { ThinStorage };
//# sourceMappingURL=ThinStorage.js.map
