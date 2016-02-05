import express from 'express'
import graphqlHTTP from 'express-graphql'
import logger from 'morgan'
import favicon from 'serve-favicon'
import bodyParser from 'body-parser'
import config from '../config'
import _debug from 'debug'
import { Book } from './models'

import schema from './graphql/schema'
// import loaders from './graphql/loaders'

/**
 * Base App Configuration
 */
const app = express()
const debug = _debug('api:server')
// const Book = new Book()

debug('configuring server middleware')

app.use(favicon(config.favicon))
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

debug('finished configuring server middleware')

/**
 * Authenticated Routs / Middleware
 */

/**
* GraphQL routes
*/
app.use('/graphql', graphqlHTTP(request => ({
  schema,
  graphiql: process.env.NODE_ENV !== 'production'
  // rootValue: {
  //   domain: request.hostname,
  //   locale: request.cookies.locale || 'en',
  //   user: request.user,
  //   loaders: loaders()
  // }
})))

/**
 * API routes / endpoints
 */
app.use('/message', (req, res) => {
  res.json({ message: 'welcome to tenshi api!' })
})

app.use('/book/:uuid', (req, res) => {
  let uuid = req.params.uuid
  let data = Book.find(uuid)
  data.then(result => res.json(result))
  // data.then(result => res.json(result.map(row => row.node)))
})

app.use('/books', (req, res) => {
  let data = Book.all(['Book'], 10)
  // c.then(result => res.json(result.map(row => row.node)))
  data.then(result => res.json(result))
})

app.get('/add/:first/:second', (req, res) => {
  // convert the two values to floats and add them together
  let sum = parseFloat(req.params.first) + parseFloat(req.params.second)
  res.status(200).send(String(sum))
  // res.send(200, String(sum))  -- DEPRICATED, use above pattern instead
})

app.use('/', (req, res) => {
  res.json({ message: 'welcome to tenshi api!' })
})

/**
 * Error handling
 * Note: must be declared after routes
 */
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  let status = err.status || 500

  debug(err)
  res.status(status)
  res.end('Server Error: ' + status)
})

export default app
