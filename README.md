<div align="center">
<img src="assets/logo.png" alt="Thin Storage 📦">
<h1>A Thin JavaScript Document Storage with Middleware Stack</h1>

<a href="https://github.com/jankapunkt/thin-storage/actions/workflows/testsuite.yml">
  <img src="https://github.com/jankapunkt/thin-storage/workflows/Test%20suite/badge.svg" alt="Test Suite" title="Test Suite">
</a>
<a href="https://github.com/jankapunkt/thin-storage/actions/workflows/publish.yml">
  <img src="https://github.com/jankapunkt/thin-storage/actions/workflows/publish.yml/badge.svg" alt="Build" title="Build">
</a>
<a href="https://standardjs.com">
  <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide" title="JavaScript Style Guide">
</a>
<a href="https://www.repostatus.org/#active">
  <img src="https://www.repostatus.org/badges/latest/active.svg" 
    alt="Project Status: Active – The project has reached a stable, usable state and is being actively developed." 
    title="Project Status: Active – The project has reached a stable, usable state and is being actively developed.">
</a>
<a href="https://github.com/jankapunkt/thin-storage/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/jankapunkt/thin-storage" 
    alt="Project license" 
    title="Project license">
</a>
<a href="https://github.com/sponsors/jankapunkt">
  <img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub" 
    alt="Sponsor" 
    title="Sponsor">
</a>
</div>

- 🤩 No dependencies.
- 🤯 Designed for simplicity, no `$fancy` keywords
- 👣 Minimal footprint (? kb minified+gzipped)
- 🤓 Great for writing your own adapters.
- 🙈 Not necessarily scalable.

## Concepts and conventions 💡

- 📦 out of the box - run locally in-memory without any further required implementations
- ⚖️ all or nothing - changes rejected by middleware will not be applied at all
- 🍹 bring your own - validation, cleaning, processing is all possible but entirely optional and done by middleware
- 🏖️ keep it simple - the api is minimal and easy to comprehend, you have learned it in a few minutes
- 
## Overview
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Is this package for you? 🤔](#is-this-package-for-you-)
- [Installation and basic usage 🧙‍♂️](#installation-and-basic-usage-)
  - [Insert documents](#insert-documents)
  - [Update documents](#update-documents)
  - [Remove documents](#remove-documents)
  - [Fetching documents](#fetching-documents)
  - [Reusing the middleware stack](#reusing-the-middleware-stack)
- [Rules 🧑‍⚖️](#rules-)
- [Primary Keys](#primary-keys)
- [Queries](#queries)
- [Modifiers](#modifiers)
- [Integrations 🤝](#integrations-)
  - [Vue 3](#vue-3)
  - [React](#react)
- [Development 🛠️](#development-)
  - [Tools / stack](#tools--stack)
  - [Contributing and development (quick guide)](#contributing-and-development-quick-guide)
- [Security 🚨](#security-)
- [License 🧾](#license-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Is this package for you? 🤔

This tool allows to CRUD a local in-memory store and provides a minimal middleware stack,
which in turn allows to implement your own sync system to whatever will actually store the data.

It brings **no sync or replication system** but a simple, yet flexible API to help you with it.
It also does not distinct between store and collections - every instance is a collection where
you can either reuse or mix the middleware stack for each of them individually.

Reactivity is not "baked in" but possible to achieve, which is also described in the 
[integrations section](#integrations-).

This approach keeps the package small and concise. 

## Installation and basic usage 🧙‍♂️

First, install from npm via

```shell
$ npm install thin-storage
```

Let's create a minimal storage that has no middleware and runs
solely in-memory:

```js
import { ThinStorage } from 'thin-storage'

const storage = new ThinStorage()
```

### Insert documents

Now, let's add and query some documents. It's super simple:

```js
await storage.insert({ foo: 'bar' })
await storage.insert([{ bar: 'baz' }])

storage.find({ yolo: 1 }) // []
storage.find({ foo: 'bar' }) // [{ id: '0000000000000001', foo: 'bar' }]
storage.find(doc => 'bar' in doc) // [{ id: '0000000000000002', bar: 'baz' }]
storage.find() // [{...}, {...}] 
```

As you can see the storage will generate values for the default primary key `id`, 
since there is currently no middleware handler implementing `insert`.
You can read more on this in the [primary key section](#primary-keys).

### Update documents

Now let's update some documents:

```js
const query = { foo: 'bar' }
const modifier = { foo: 'moo', yolo: 1 }
await storage.update(query, modifier)

storage.find({ foo: 'bar' }) 
// [{ id: '0000000000000001', foo: 'moo', yolo: 1 }]
```

The update query follows the exact same rules as queries for the `find` method.
Here, we select all documents where `foo` exactly equals `'bar'`.
Read the [queries section](#queries) for all possibilities to build queries.

The modifier however in this example changes in all found documents the `foo` property to `'moo'`
and `yolo` to `1`. If the properties are not present in the queried documents then they will be added
with the given values. More modifications are described in the [modifiers section](#modifiers).
Both are described in the rules section.

### Remove documents

Finally, let's remove some documents:

```js
const query = doc => ['foo', 'bar'].some(val => val in doc)
await storage.remove(query)

storage.find({}) 
// []
```

The query is now a function. Basically, it checks, whether a doc contains `foo` or `bar` as property.
This resulted in all documents being selected for removal, which is why we ended up with an empty storage.

That's pretty much it so far for the introduction. Wait, there is also fetching documents!
Let me explain, why and how its different from `find`.

### Fetching documents



### Reusing the middleware stack

A simple approach to reuse the middleware stack for each instance is to use a factory function:

```js
const handler = [{
  async insert () { ... },
  async update () { ... },
  async remove () { ... }
}, {
  async fetch () { ... },
  async insert () { ... },
  async update () { ... },
  async remove () { ... }
}]

export const createStorage = ({ name, primary = 'id' }) => {
  return new Storage({ name, primary, handler })
}
```

## Rules 🧑‍⚖️



There are a few simple rules to know, in order to construct valid queries and modifiers.
In contrast to other storage tools we don't use `$fancy` keys but simple conventions.

If they don't cover your use-case - worry not - you can still provide a callback to construct entirely custom
queries and modifiers! 💪

## Primary Keys

We assume there is always some primary key for a collection of documents, the default value is `id` but
you can change it to anything you need to (for example in MongoDB it's typically `_id`).

There are three ways to generate primary keys:

- let the middleware handle it (recommended)
- let the default handle it (recommended when no middleware is expected/you will use the storage entirely local)
- override the id generation by passing a function to the `idGen` option

## Queries

Queries are used to define the subset of documents that is used for `find`, `update` or `remove` operations.
The following constructs are possible:

- a single string ⇒
  - finds a single document by its primary key with the argument as the value
  - example `'217db87c'`
  

- a list of strings ⇒ 
  - finds all documents by given primary key values
  - example `['7970d267', 'e818085e', '47d5df93']`
  

- an object with key-value pairs ⇒ 
  - finds all documents that exact/loosely match the properties
  - an empty objects leads always to selecting all documents 
  - example: `{foo: 'bar'}` ⇒ find all docs with property `foo` being `'bar'`
  - example: `{foo: ['bar', 'moo']}` ⇒ find all docs with property `foo` being `'bar'` or `'moo'`
  - example: `{foo: val => /moo/i.test(val)}` ⇒ find all docs that pass the function match test, 
    in this example represented by a RegEx test 


- a callback-style function ⇒ 
  - finds all documents that pass the test of the function (similar to the Array filter method)
  - example: `doc => 'foo' in doc` ⇒ returns all docs that have the `foo` property

## Modifiers

Modifiers define how documents should be updated. If a document matches the query then the modification will
be applied to it. The following constructs are possible:

- an object of key-value pairs
  - example: `{foo: 'moo'}` ⇒ changes the value of the `foo` property to `'moo'` in all queried documents
  - if the key is not in the document, it will be created with the given value
  - if the value is null (such as in `{foo: 'null'}`) the property will be deleted from the document
  - a value can be a function, too, allowing complex operations that don't fit key-value concepts
  - example: `doc => doc.moo += 1` increments `moo` by 1, assuming it exists as a number in the given documents
- callback-style function, manipulating the document in any possible way, needs to return the document
  - example: `doc => { doc.moo = doc.moo ? 0 : doc.moo + 1; return doc }`
  - similar to the Array map method callback


## Integrations 🤝

### Vue 3

The local documents in the storage are contained within a `Set`.
To observe changes using a `ref`, simply pass the ref value as `set` argument to the options
when constructing the storage:

```vue
<script setup>
  import { ref } from 'vue'
  import { ThinStorage } from '@thin-storage/core'

  const users = ref(new Set())
  const UsersCollection = new ThinStorage({
    name: 'users',
    set: users.value
  })
  
  // this operation will be reflected on the ref
  UsersCollection
          .insert({ username: 'johnnyCash01234' })
          .catch(console.error)
</script>
```

### React

React's `useState` [requires data to be immutable](https://react.dev/learn/updating-arrays-in-state) which
is why we added a simple EventEmitter-like functionality that dispatches changes, so you can listen to and 
update state as desired:

```js
export const useStorage = (storage, query = {}) => {
  const [docs, setDocs] = useState(() => storage.find(query))
  
  useEffect(() => {
    const off = storage.on('change', () => setDocs(storage.find(query)))
    return () => off()
  }, [])
  
  return docs
}
```

The following events are dispatched:

| Event    | When                            | Args                       |
|----------|---------------------------------|----------------------------|
| `change` | Any change to the documents set | `undefined`                |
| `insert` | new documents are insert        | Array of the inserted docs |
| `update` | documents are updated           | Array of the updated docs  |
| `remove` | documents were removed          | Array of the removed docs  |

## Development 🛠️

Thanks a lot for your intent to contributing to this project and free software in general.
The following sections will help you to get started as fast and easy as possible to make your contribution a success!

### Tools / stack

We use the following stack to develop and publish this package:

* 🗪 [Babel](https://babeljs.io/) for transpiling
* 🪄 [Standard](https://standardjs.com/) for linting
* ⚗️ [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com) for testing
* 🔍 [c8](https://github.com/bcoe/c8) for code coverage
* 📚 [JSDoc](https://jsdoc.app/) for documentation and [jsdoc-to-markdown](https://www.npmjs.com/package/jsdoc-to-markdown) to create docs as markdown files
* ⚡ [GitHub actions](https://github.com/features/actions) for continuous integration
* 📦 [Rollup](https://rollupjs.org) for bundling

All tools are defined as **`dev-dependencies`**!

### Contributing and development (quick guide)

**Note:** We provide an [extensive contribution guideline](./CONTRIBUTING.md) and a [code of conduct](./CODE_OF_CONDUCT.md)
to help you in making your contribution a success!

First, or fork the repository and clone it to your local machine:

```shell
$ git clone git@github.com:jankapunkt/thin-storage.git
```

From here, simply create your Js files in the `./lib` folder and add the tests in the `test` folder.

We provide a default set of tools via npm scripts. Run a script via

```shell
$ npm run <command>
```

where `<command>` is one of the following available commands:

| command         | description                                       | output     |
|-----------------|---------------------------------------------------|------------|
| `lint`          | runs the linter in read-mode                      |            |
| `lint:fix`      | runs the linter; fixes minor issues automatically |            |
| `test`          | runs the tests once                               |            |
| `test:watch`    | runs the tests; re-runs them on code changes      |            |
| `test:coverage` | runs the tests once and creates a coverage report | `coverage` |
| `docs`          | creates API documentation                         | `docs`     |
| `build`         | builds the bundles for several target platforms   | `dist`     |
| `build:full`    | runs `build` and `docs`                           | see above  |

## Security 🚨

Please read our [security policy](./SECURITY.md) to get to know which versions are covered.

## License 🧾

MIT, see [license file](LICENSE)
