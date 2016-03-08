import { Book, Edge } from '../src/models'
import { Book1, Book2, genUUID } from './helpers/mocks'

before(() => {
  let props = {
    uuid: genUUID(),
    kind: 'SUBJECT'
  }
  Book.create(Book1)
  Book.create(Book2)
  Edge.create(Book1.uuid, Book2.uuid, 'SIMILAR_TO', props)
  console.log('[INFO]', 'run BEFORE all tests')
})

after(() => {
  Book.query('MATCH (n:Book) DETACH DELETE n')
  console.log('[INFO]', 'run AFTER all tests')
})
