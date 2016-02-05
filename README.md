Node/Express GraphQL Server
===========================

GraphQL server using node / express and written in ES6 (ES2015) and ES7 (ES2016)

Getting Started
--------

```sh
npm i

```

create a file in the project root called `.env` and within it set environment variables `NEO4J_USER` and `NEO4J_PASS`. Note you can also edit database credentials in the file `src/lib/db.js`

example `.env` file

```sh
NODE_ENV=development
NEO4J_USER=neo4j
NEO4J_PASS=neo4j
DEBUG=api:*
```

to start, run:
```sh
npm start
```
To run tests:

```sh
npm test
```
Tests will use the database credentials in the file `src/lib/db.js` as I've not yet configured [Mocha](https://github.com/mochajs/mocha) to use the [dotenv](https://github.com/bkeepers/dotenv) `.env` file.

Stack
--------

* [GraphQL](https://github.com/graphql/)
  * [graphql-js](https://github.com/graphql/graphql-js)
  * [express-graphql](https://github.com/graphql/express-graphql)
* [Express](https://github.com/strongloop/express/)
* [Neo4j](https://github.com/neo4j/neo4j)
  * [node-neo4j](https://github.com/thingdom/node-neo4j/tree/v2#readme) (`^2.0.0-RC2`)
* ES6/ES7
  * ES6 goodness
  * async/await
  * rest & spread operators
* [Mocha](https://github.com/mochajs/mocha)
  * Mocha w/ chai, and chai-as-promised
* [supertest](https://github.com/visionmedia/supertest)
  * [supertest-as-promised](https://github.com/WhoopInc/supertest-as-promised)
* [Babel](https://github.com/babel/babel) (`^6.3.0`)
  * [babel-preset-node5](https://github.com/leebenson/babel-preset-node5)
  * [babel-preset-stage-0](https://babeljs.io/docs/plugins/preset-stage-0)
* [ESLint](http://eslint.org)
  * Uses [Standard Style](https://github.com/feross/standard) by default, but you're welcome to change this!
  * Includes separate test-specific `.eslintrc` to work with Mocha and Chai
* [dotenv](https://github.com/bkeepers/dotenv)
  * used for loading environment variables


TODO
--------

* Project structure is WIP
* Move GraphQL code into modules/models
* Add custom GraphQL scalar types
