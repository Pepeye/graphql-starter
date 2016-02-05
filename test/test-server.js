import express from 'express'
import graphqlHTTP from 'express-graphql'
import bodyParser from 'body-parser'
import { Book } from '../src/models'

import schema from '../src/graphql/schema'
// import loaders from './graphql/loaders'

// A P P   C O N F I G
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// A U T H   E N P O I N T S

// G R A P H Q L
app.use('/graphql', graphqlHTTP(request => ({
  schema,
  graphiql: process.env.NODE_ENV !== 'production'
})))

// A P I   E N P O I N T S
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

// E R R O R   H A N D L I N G
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  let status = err.status || 500

  res.status(status)
  res.end('Server Error: ' + status)
})

export default app
