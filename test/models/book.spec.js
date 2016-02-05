import { expect } from 'chai'
import { describe, it } from 'mocha'
import { Book } from '../../src/models'
import { UUID, MockBook, Book1, Book2, genUUID } from '../helpers/mocks'
import { validateNeo4jNode } from '../helpers/helpers'

// S P E C S

describe('Book tests', () => {
  describe('Book:', () => {
    let newbook = new Book(MockBook)
    let bookID

    it('CREATES a new Book with labels', async () => {
      // let newbook = new Book(MockBook)
      return await Book
        .create(MockBook)
        .then(result => {
          validateNeo4jNode(result)
          expect(result[0].labels.indexOf('Book')).to.be.gt(-1)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('FINDS a Book by UUID', async () => {
      await Book
        .find(UUID)
        .then(result => {
          validateNeo4jNode(result)
          expect(result[0].labels.indexOf('Book')).to.be.gt(-1)
          bookID = result[0]._id
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('FINDS a Book by ID', async () => {
      await Book
        .findByID(bookID)
        .then(result => {
          validateNeo4jNode(result)
          expect(result[0].labels.indexOf('Book')).to.be.gt(-1)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('QUERY books using CYPHER ', async () => {
      let qry = `
        MATCH (n)
        RETURN n
        LIMIT 2
      `
      await Book
        .query(qry)
        .then(result => {
          let count = Object.keys(result).length
          expect(result).to.exist
          expect(count).to.equal(2)  // TODO: remove later, fine with seed data
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('FINDS a Book BY specified PROPERTIES', async () => {
      let params = { title: Book1.name, website: Book1.website }
      await Book
        .findByProperties(params)
        .then(result => {
          // let count = Object.keys(result).length
          expect(result).to.exist
          // expect(count).to.equal(1) // TODO: remove later, fine with seed data
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('GETS Book UUID', () => {
      // let newbook = new Book(MockBook)
      expect(newbook.uuid).to.equal(UUID)
    })

    it('GETS Book LABELS', () => {
      // let newbook = new Book(MockBook)
      // let labels = newbook.label
      expect(newbook.label).to.deep.equal(['Book'])
    })

    it('SETS Book LABELS', () => {
      // let newbook = new Book(MockBook)
      newbook.label = ['Book', 'Document']
      expect(newbook.label).to.deep.equal(['Book', 'Document'])
    })

    it('GETS Book PROPERTIES', () => {
      // let newbook = new Book(MockBook)
      expect(newbook.info).to.deep.equal(MockBook)
    })

    it('SETS Book PROPERTIES', () => {
      // let newbook = new Book(MockBook)
      let newprops = {
        uuid: UUID,
        title: 'Exploring ES6',
        edition: 1,
        description: 'Upgrade to the next version of JavaScript',
        website: 'http://exploringjs.com/es6/'
      }
      newbook.info = newprops
      expect(newbook.info).to.deep.equal(newprops)
      // expect(newbook.info).to.deep.equal(newbook.properties)
    })

    it('can SAVE Book PROPERTIES', async () => {
      let uuid = genUUID()
      // let newbook = new Book(MockBook)
      let newprops = {
        title: 'Exploring ES6',
        edition: 1,
        description: 'Upgrade to the next version of JavaScript',
        website: 'http://exploringjs.com/es6/'
      }
      newbook.info = newprops
      await newbook
        .save()
        .then(saved => {
          Book
            .findByProperties({uuid})
            .then(result => {
              expect(result).to.deep.equal(saved)
            })
            .catch(err => { expect(err).to.not.exist })
        })
    })

    it('can REMOVE label from Book', async () => {
      // let newbook = new Book(MockBook)
      return await newbook
        .save()
        .then(data => {
          Book
            .deleteLabels(['Document'])
            .then(result => {
              expect(result).to.exist
              expect(result[0].labels).to.equal(['Book'])
              validateNeo4jNode(result)
            })
            .catch(err => { expect(err).to.not.exist })
        })
    })

    it('DELETES a Book', async () => {
      let msg = { status: 200, message: `Node (uuid: ${newbook.uuid}) successfully deleted` }
      await Book
        .delete(newbook.uuid)
        .then(data => {
          expect(data).to.exist
          expect(data).to.deep.equal(msg)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    // TODO: don't use hard coded uuid or setup test data first
    it('CREATES EDGE on a node', async () => {
      let uuid = genUUID()
      let props = {
        uuid,
        kind: 'SUBJECT'
      }

      await Book
        .createEdge(Book1.uuid, Book2.uuid, 'SIMILAR_TO', props)
        .then(result => {
          expect(result).to.exist
        })
        .catch(err => {
          expect(err).to.not.exist
        })
    })

    it('FINDS EDGES on a Book', async () => {
      await Book
        .findEdges(Book1.uuid)
        .then(data => {
          expect(data).to.exist
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('DELETES EDGE on a node', async () => {
      let props = {
        kind: 'SUBJECT'
      }

      await Book
        .deleteEdge(Book1.uuid, Book2.uuid, 'SIMILAR_TO', props)
        .then(result => {
          expect(result).to.exist
          expect(result.status).to.equal(200)
        })
        .catch(err => {
          console.log('[error]', err)
          expect(err).to.not.exist
        })
    })
  })
})
