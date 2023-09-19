class Storage {
  constructor (options = {}) {
    this.documents = new Set();
    this.keys = new Map();

    this.name = options.name;
    this.primary = options.primary || 'id';
    this.handler = options.handler
      ? Array.isArray(options.handler) ? options.handler : [options.handler]
      : [];
    this.hasInsert = this.handler.find(h => !!h.insert);
    this.hasUpdate = this.handler.find(h => !!h.update);
    this.hasRemove = this.handler.find(h => !!h.remove);
  }

  async insert (documents = []) {
    documents = Array.isArray(documents) ? documents : [documents];
    const local = shallowCopies(documents);
    let primaries = [];

    if (this.hasInsert) {
      const options = getOptions(this);

      // this runs a middleware stack on the shallow copies of the docs
      // which might even alter the size and the signature of the docs
      // as long as the last return value is the array with the primary keys
      // which is also passed as third argument in order to allow
      // throughput until the end, in case it has been created
      // before the last handler in the stack
      for (const handler of this.handler) {
        if (handler.insert) {
          primaries = await handler.insert(local, options, primaries);
        }
      }

      if (!primaries || primaries.length !== local.length) {
        throw new Error(`Insert return values expected to be of length (${primaries.length}), got (${local.length}) in storage ${this.name}`)
      }
    } else {
      primaries = local.map(() => incrementKey());
    }

    local.forEach((doc, index) => {
      const key = primaries[index];
      doc[this.primary] = key;
      this.keys.set(key, doc);
      this.documents.add(doc);
    });

    local.length = 0;
    return primaries
  }

  async update (query, modifier, options = {}) {
    if (this.primary in modifier) {
      throw new Error(`Unexpected primary in modifier in store ${this.name}`)
    }

    const local = shallowCopies(this.find(query, options));
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
      for (const handler of this.handler) {
        if (handler.update) {
          updated = await handler.update(local, modifier, options, updated);
        }
      }

      if (updated.length !== local.length) {
        throw new Error(`Update return values expected to be of length (${updated.length}), got (${local.length}) in storage ${this.name}`)
      }
    }

    updated.forEach(doc => {
      const key = doc[this.primary];
      const original = this.keys.get(key);

      if (!original) {
        throw new Error(`Doc not found by primary key ${key}`)
      }
      this.documents.delete(original);
      this.documents.add(doc);
      this.keys.set(key, doc);
    });

    return updated.length
  }

  async remove (query, options = {}) {
    const local = shallowCopies(this.find(query, options));
    let removed = local.map(doc => doc[this.primary]);

    if (this.hasRemove) {
      const options = getOptions(this);

      for (const handler of this.handler) {
        if (handler.remove) {
          removed = await handler.remove(local, options, removed);
        }
      }
      if (removed.length !== local.length) {
        throw new Error(`Remove return values expected to be of length (${removed.length}), got (${local.length}) in storage ${this.name}`)
      }
    }

    removed.forEach(key => {
      const original = this.keys.get(key);

      if (!original) {
        throw new Error(`Doc not found by primary key ${key}`)
      }
      this.documents.delete(original);
      this.keys.delete(key);
    });

    return removed.length
  }

  find (query, options = {}) {
    const { limit } = options;
    const docs = this.documents.values();

    if (!query) {
      return filterDocs({ docs, limit, query: () => true })
    }

    const queryType = typeof query;

    if (queryType === 'string') {
      // string query is expected to be a primary key
      const doc = this.keys.get(query);
      return doc ? [doc] : []
    }

    if (queryType === 'function') {
      return filterDocs({ docs, limit, query })
    }

    if (queryType === 'object') {
      const { looseMatching } = options;
      const entries = Object.entries(query);
      if (entries.length === 0) {
        return filterDocs({ docs, limit, query: () => true })
      }

      const byMatcher = doc => entries.every(([key, value]) => {
        return looseMatching
          ? doc[key] == value // eslint-disable-line
          : doc[key] === value
      });
      return filterDocs({ docs, limit, query: byMatcher })
    }

    throw new Error(`Unsupported query type "${queryType}"`)
  }
}

const shallowCopies = docs => docs.map(doc => ({ ...doc }));
const getOptions = ({ primary, name }) => ({ primary, name });
const filterDocs = ({ docs, query, limit }) => {
  const filtered = [];

  for (const doc of docs) {
    if (query(doc)) {
      filtered.push(doc);
    }
    if (limit > 0 && filtered.length >= limit) {
      return filtered
    }
  }

  return filtered
};
const incrementKey = (() => {
  let count = 0;
  return (length = 16) => (++count).toString(10).padStart(length, '0')
})();

export { Storage };
//# sourceMappingURL=Storage.js.map
