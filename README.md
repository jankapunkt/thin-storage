# Thin Storage 📦

![Test suite](https://github.com/jankapunkt/thin-storage/workflows/Test%20suite/badge.svg)
[![Build and publish](https://github.com/jankapunkt/thin-storage/actions/workflows/publish.yml/badge.svg)](https://github.com/jankapunkt/thin-storage/actions/workflows/publish.yml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![GitHub](https://img.shields.io/github/license/jankapunkt/thin-storage)

Thin and lightweight JavaScript storage interface with middleware layer. Designed for small projects.
Not necessarily scalable. Designed for simplicity. Great for DIY adapters.

## About this package

If you plan to do simple operations on some collections then this tool might be for you.
It allows to CRUD a local in-memory store and provdies a minimal middleware stack that allows
to commit the changes to whatever will actually store the data.

It brings no sync system but a simple API to help you with it.

## What's included?

### Tools / stack

* 🗪 [Babel](https://babeljs.io/) for transpiling
* 🪄 [Standard](https://standardjs.com/) for linting
* ⚗️ [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com) for testing
* 🔍 [c8](https://github.com/bcoe/c8) for code coverage
* 📚 [JSDoc](https://jsdoc.app/) for documentation and [jsdoc-to-markdown](https://www.npmjs.com/package/jsdoc-to-markdown) to create docs as markdown files
* ⚡ [GitHub actions](https://github.com/features/actions) for continuous integration
* 📦 [Rollup](https://rollupjs.org) for bundling

All tools are defined as **`dev-dependencies`**!

### Docs and repository

This template repository has all relevant GitHub community standards implemented:

- [x] Description
- [x] [README](./README.md)
- [x] [Code of conduct](./CODE_OF_CONDUCT.md)
- [x] [Contributing](./CONTRIBUTING.md)
- [x] [License](./LICENSE)
- [x] [Security policy](./SECURITY.md)
- [x] [Issue templates](./.github/ISSUE_TEMPLATE)
- [x] [Pull request template](./.github/PULL_REQUEST_TEMPLATE.md)

## Getting started

First, [create a new repository with this repository as template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)
or fork the repository and clone it to your local machine.

From here, simply create your Js files in the `./lib` folder and add the tests in the `test` folder.

### Use the tools

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

## Contributing and development

We provide an [extensive contribution guideline](./CONTRIBUTING.md) and a [code of conduct](./CODE_OF_CONDUCT.md)
to help you in making your contribution a success!

## Security

Please read our [security policy](./SECURITY.md) to get to know which versions are covered.

## License

MIT, see [license file](LICENSE)
