import { expect } from 'chai'
import { describe, it } from 'mocha'
import { Edge } from '../../src/models'
import { Book1, Book2, genUUID } from '../helpers/mocks'

// S P E C S

describe('Edge Tests', () => {
  describe('Edge:', () => {
    let type = 'SIMILAR_TO'
    let uuid = genUUID()
    let props = {
      uuid,
      kind: 'SUBJECT'
    }

    it('CREATES a new EDGE', async () => {
      await Edge
        .create(Book1.uuid, Book2.uuid, type, props)
        .then(result => {
          expect(result).to.exist
          expect(result[0].properties.uuid).to.equal(uuid)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('finds ALL edges of type', async () => {
      await Edge
        .all(['SIMILAR_TO'])
        .then(result => {
          expect(result).to.exist
          expect(result.length).to.equal(1)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('GETS edges between two nodes', async () => {
      await Edge
        .get(Book1.uuid, Book2.uuid, type)
        .then(result => {
          expect(result).to.exist
          expect(result.length).to.equal(1)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('FINDS edge by UUID', async () => {
      await Edge
        .find(uuid)
        .then(result => {
          expect(result).to.exist
          expect(result.length).to.equal(1)
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('UPDATES an existing edge', async () => {
      await Edge
        .update(uuid, { updated: true })
        .then(result => {
          expect(result).to.exist
          expect(result.length).to.equal(1)
          expect(result[0].properties.updated).to.be.true
        })
        .catch(err => { expect(err).to.not.exist })
    })

    it('DELETES an edge matching properties provided', async () => {
      let props = {
        uuid,
        kind: 'SUBJECT'
      }

      await Edge
        .deleteEdge(props)
        .then(result => {
          expect(result).to.exist
          expect(result.status).to.equal(200)
        })
        .catch(err => {
          console.log('[error]', err)
          expect(err).to.not.exist
        })
    })

    // it('INSERTS new edge', async () => {
    //   await Edge
    //     .insert(Book1.uuid, Book2.uuid, type, props)
    //     .then(result => {
    //       expect(result).to.exist
    //     })
    //     .catch(err => { expect(err).to.not.exist })
    // })

    // it('FINDS edge by id', async () => {
    //   await Edge
    //     .findByID(105)
    //     .then(result => {
    //       expect(result).to.exist
    //       expect(result.length).to.equal(1)
    //     })
    //     .catch(err => { expect(err).to.not.exist })
    // })

    // it('DELETES edge by ID', async () => {
    //   await Edge
    //     .delete(97)
    //     .then(result => {
    //       expect(result).to.exist
    //       expect(result.status).to.equal(200)
    //     })
    //     .catch(err => { expect(err).to.not.exist })
    // })
  })
})
