# Thin Storage 📦

![Test suite](https://github.com/jankapunkt/thin-storage/workflows/Test%20suite/badge.svg)
[![Build and publish](https://github.com/jankapunkt/thin-storage/actions/workflows/publish.yml/badge.svg)](https://github.com/jankapunkt/thin-storage/actions/workflows/publish.yml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![GitHub](https://img.shields.io/github/license/jankapunkt/thin-storage)
[![sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub)](https://github.com/sponsors/jankapunkt)

Thin and lightweight JavaScript storage interface with middleware layer. Designed for small projects.
Not necessarily scalable. Designed for simplicity. Great for DIY adapters.

## Concepts and conventions

- out of the box - run locally in-memory without any further required implementations
- all or nothing - changes rejected by middleware will not be applied at all
- bring your own - validation, cleaning, processing is all optional and done by middleware
- keep it simple - the api is minimal and easy to comprehend

## Is this package for you?

If you plan to do simple operations on some collections then this tool might be for you.
It allows to CRUD a local in-memory store and provides a minimal middleware stack that allows
to commit the changes to whatever will actually store the data.

It brings no sync or replication system but a simple API to help you with it.
It also does not contain collections - every instance is a collection and you can either
reuse or mix the middleware stack for each individually.

This approach keeps the package small and concise.

## Installation and usage

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

Now, let's add and query some documents. It's super simple:

```js
await storage.insert({ foo: 'bar' })
await storage.insert([{ bar: 'baz' }])

storage.find({ yolo: 1 }) // []
storage.find({ foo: 'bar' }) // [{ id: '0000000000000001', foo: 'bar' }]
storage.find(doc => 'bar' in doc) // [{ id: '0000000000000002', bar: 'baz' }]
storage.find() // [{...}, {...}] 
```

As you can see the storage will generate values for the default primary key `id`
if there is no handler for `insert`.

Now let's update some documents:

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

## Development

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

## Security

Please read our [security policy](./SECURITY.md) to get to know which versions are covered.

## License

MIT, see [license file](LICENSE)
