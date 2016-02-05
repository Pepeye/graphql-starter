import { expect } from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest-as-promised'
import { Book1 } from '../helpers/mocks'
import app from '../test-server'

describe('REST API tests', () => {
  describe('REST endpoints', () => {
    it('retrieves data at: /book/:uuid', async () => {
      let expected = Book1.title
      let res = await request(app)
              .get('/book/088d9b8b-42d9-4add-9971-33000302a78c')
              .expect(200)
      let result = JSON.parse(res.text)

      expect(result[0].properties.title).to.deep.equal(expected)

      await request(app)
              .get('/book/088d9b8b-42d9-4add-9971-33000302a78c')
              .expect(200)
              .then(res => { expect(result[0].properties.title).to.deep.equal(expected) })
              .catch(err => { expect(err).to.not.exist })
    })

    // 3 companies in database as of now
    // TODO: use mock/test database and insert record first
    it('retrieves data at endpoint: /books', async (done) => {
      let res = await request(app)
              .get('/books')
              .expect(200)

      expect(JSON.parse(res.text).length).to.be.gte(1)

      await request(app)
              .get('/books')
              .expect(200)
              .then(res => { expect(JSON.parse(res.text).length).to.be.gte(1) })
              .catch(err => { expect(err).to.not.exist })

      done()
    })
  })
})
