import { expect } from 'chai'
import { describe, it } from 'mocha'
import { Node } from '../../src/models'
import { UUID, Book1, Book2, MockBook, genUUID } from '../helpers/mocks'
import { validateNeo4jNode } from '../helpers/helpers'

// S P E C S

describe('Node tests', () => {
  describe('Node:', () => {
    let newnode = new Node(MockBook)

    it('CREATES a new node with labels', async () => {
      return await Node
        .create(MockBook)
        .then(result => {
          validateNeo4jNode(result)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('FINDS a node by UUID', async () => {
      await Node
        .find(UUID)
        .then(result => {
          validateNeo4jNode(result)
          // expect(result[0]).to.deep.equal(MockBook)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('QUERY nodes using CYPHER ', async () => {
      let qry = `
        MATCH (n)
        RETURN n
        LIMIT 2
      `
      await Node
        .query(qry)
        .then(result => {
          // let count = Object.keys(result).length
          expect(result).to.exist
          // expect(count).to.equal(2)  // TODO: remove later, fine with seed data
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('FINDS a node BY specified PROPERTIES', async () => {
      let params = { title: Book1.title, website: Book1.website }
      await Node
        .findByProperties(params)
        .then(result => {
          let count = Object.keys(result).length
          expect(result).to.exist
          expect(count).to.equal(1) // TODO: remove later, fine with seed data
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('GETS node UUID property on class', () => {
      // let newnode = new Company(MockBook)
      expect(newnode.uuid).to.equal(UUID)
    })

    it('GETS node LABELS property on class', () => {
      // let newnode = new Company(MockBook)
      // let labels = newnode.label
      expect(newnode.label).to.deep.equal([])
    })

    it('SETS node LABELS property on class', () => {
      // let newnode = new Company(MockBook)
      newnode.label = ['Book', 'Document']
      expect(newnode.label).to.deep.equal(['Book', 'Document'])
    })

    it('GETS node PROPERTIES', () => {
      // let newnode = new Company(MockBook)
      expect(newnode.info).to.deep.equal(MockBook)
    })

    it('SETS node PROPERTIES on class', () => {
      // let newnode = new Company(MockBook)
      let newprops = {
        uuid: UUID,
        title: 'Exploring ES6',
        edition: 1,
        description: 'Upgrade to the next version of JavaScript',
        website: 'http://exploringjs.com/es6/'
      }
      newnode.info = newprops
      expect(newnode.info).to.deep.equal(newprops)
      // expect(newnode.info).to.deep.equal(newnode.properties)
    })

    it('can SAVE node PROPERTIES to DB', async () => {
      let uuid = genUUID()
      // let newnode = new Company(MockBook)
      let newprops = {
        title: 'Exploring ES6',
        edition: 1,
        description: 'Upgrade to the next version of JavaScript',
        website: 'http://exploringjs.com/es6/'
      }
      newnode.info = newprops
      await newnode
        .save()
        .then(saved => {
          Node
            .findByProperties({uuid})
            .then(result => {
              expect(result).to.deep.equal(saved)
            })
            .catch(err => { expect(err).to.not.exist })
        })
    })

    it('can UPDATE node PROPERTIES to DB', async () => {
      let props = {
        title: 'Exploring ES6',
        edition: 1,
        description: 'Upgrade to the next version of JavaScript',
        website: 'http://exploringjs.com/es6/',
        updated: true
      }

      await Node
        .update(UUID, props)
        .then(result => {
          expect(result[0].properties.updated).to.be.true
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('ADDS to node LABELS in DB', async () => {
      await Node
        .addLabels(newnode.uuid, ['Thing'])
        .then(result => {
          expect(result[0].labels.indexOf('Thing')).to.be.gt(-1)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('GETS node LABELS from DB', async () => {
      await Node
        .findLabels(UUID)
        .then(result => {
          expect(result[0]).to.exist
          expect(result[0].indexOf('Thing')).to.be.gt(-1)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('can REMOVE label from node', async () => {
      // let newnode = new Company(MockBook)
      await Node
        .deleteLabels(UUID, ['Document'])
        .then(result => {
          expect(result).to.exist
          expect(result[0].labels).to.deep.equal(['Thing', 'Book'])
          validateNeo4jNode(result)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('DELETES a node', async () => {
      let msg = { status: 200, message: `Node (uuid: ${newnode.uuid}) successfully deleted` }
      await Node
        .delete(newnode.uuid)
        .then(data => {
          expect(data).to.exist
          expect(data).to.deep.equal(msg)
        })
        .catch(err => {
          console.log('[error]', err)
          expect(err).to.not.exist
        })
    })

    // TODO: don't use hard coded uuid or setup test data first
    it('CREATES EDGE on a node', async () => {
      let uuid = genUUID()
      let props = {
        uuid,
        stake: 1.0,
        kind: 'SUBJECT'
      }

      await Node
        .createEdge(Book1.uuid, Book2.uuid, 'SIMILAR_TO', props)
        .then(result => {
          expect(result).to.exist
        })
        .catch(err => {
          expect(err).to.not.exist
        })
    })

    it('FINDS EDGES on a node', async () => {
      await Node
        .findEdges(Book1.uuid)
        .then(result => {
          expect(result).to.exist
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('DELETES EDGE on a node', async () => {
      let props = {
        kind: 'SUBJECT'
      }

      await Node
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
