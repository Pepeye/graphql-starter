import { expect } from 'chai'
import { describe, it } from 'mocha'
import { stringify } from 'query-string'
import request from 'supertest-as-promised'
import app from '../test-server'

const urlString = (urlParams) => {
  var string = '/graphql'
  if (urlParams) {
    string += ('?' + stringify(urlParams))
  }
  return string
}

describe('GraphQL-HTTP tests', () => {
  describe('Ping Server', () => {
    it('connects to addition endpoint', () => {
      request(app)
        .get('/add/1/1')
        .expect(200)
    })

    it('correctly performs addition api', () => {
      request(app)
        .get('/add/1/1')
        .expect(200)
        .then(res => { expect(parseFloat(res.text)).to.equal(2) })
        .catch(err => { expect(err).to.not.exist })
    })
  })

  describe('GET functionality', () => {
    let qry = '{ __schema { queryType { name, fields { name, description } } } }'
    let expected = {
      data: {
        __schema: {
          queryType: {
            name: 'Query',
            fields: [
              {
                name: 'book',
                description: 'a graph node of type book'
              },
              {
                name: 'books',
                description: 'a collection of nodes of type book'
              }
            ]
          }
        }
      }
    }

    it('test GET with thenable promise', async () => {
      await request(app)
        .get(urlString({query: qry}))
        .expect(200)
        .then(res => { expect(JSON.parse(res.text)).to.deep.equal(expected) })
        .catch(err => { expect(err).to.not.exist })
    })

    it('allows GET with query param', async () => {
      let res = await request(app)
        .get(urlString({query: qry}))

      expect(JSON.parse(res.text)).to.deep.equal(expected)
    })
  })

  describe('POST functionality', async () => {
    let qry = '{ __schema { queryType { name, fields { name, description } } } }'
    let expected = {
      data: {
        __schema: {
          queryType: {
            name: 'Query',
            fields: [
              {
                name: 'book',
                description: 'a graph node of type book'
              },
              {
                name: 'books',
                description: 'a collection of nodes of type book'
              }
            ]
          }
        }
      }
    }

    it('allows POST with JSON encoding', async () => {
      let res = await request(app)
        .post('/graphql')
        .send({query: qry})

      expect(JSON.parse(res.text)).to.deep.equal(expected)
    })

    it('allows POST with url encoding', async () => {
      let res = await request(app)
        .post('/graphql')
        .send(stringify({query: qry}))

      expect(JSON.parse(res.text)).to.deep.equal(expected)
    })
  })
})
