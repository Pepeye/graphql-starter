import uuid from 'node-uuid'
import { execute } from '../lib/db'
import { edgestr, addSetProperties, addLiteralMap } from './model.helpers'

export default class Edge {

  constructor (from, to, type, props = {}) {
    this.from = from
    this.to = to
    this._type = type
    this._properties = { uuid: uuid.v4(), ...props }
  }

  get uuid () {
    return this.properties.uuid
  }

  get type () {
    return this._type
  }

  // set type (value) {
  //   this._type = value
  // }

  get properties () {
    return this._properties
  }

  set properties (newprops) {
    if (newprops) {
      this._properties = Object.assign({}, this.properties, newprops)
    }
  }

  async save () {
    let { from, to, type, properties } = this
    let now = new Date()
    properties = { ...properties, created_at: now.getTime(), updated_at: now.getTime() }
    let params = { from, to }
    let literalProps = addLiteralMap(properties, 'r')
    let query = `
      MATCH (from { uuid: { from } })
      MATCH (to { uuid: { to } })
      MERGE (from)-[r${edgestr(type)} { ${ literalProps } }]->(to)
      RETURN r
    `

    let result = await execute({ query, params })
    return result.map(row => row.r)
  }

  // S T A T I C   M E T H O D S

  static async all (edgeTypes = [], limit = 25) {
    let types = (edgeTypes && Array.isArray(edgeTypes)) ? edgeTypes.join('|') : edgeTypes
    let query = `
      MATCH ()-[r${edgestr(types)}]-()
      RETURN DISTINCT r
      LIMIT ${limit}
    `
    let result = await execute(query)
    return result.map(row => row.r)
  }

  static create (from, to, type, ...props) {
    let edge = new this(from, to, type, ...props)
    return edge.save()
  }

  static async delete (id) {
    let query = `
      MATCH ()-[r]->()
      WHERE ID(r) = ${ id }
      DELETE r
    `
    return await execute(query)
      .then(() => {
        return {
          status: 200,
          message: `Edge with ID (${ id }) deleted`
        }
      })
      .catch(err => err)
  }

  static async deleteEdge (props) {
    let literalProps = addLiteralMap(props)
    let query = `
      MATCH ()-[r { ${ literalProps } }]->()
      DELETE r
    `
    return await execute(query)
      .then(() => {
        return {
          status: 200,
          message: `Edge with props (${ literalProps }) deleted`
        }
      })
      .catch(err => err)
  }

  static async get (from, to, types) {
    let params = { from, to }
    let edges = edgestr(types)
    let query = `
      MATCH (from {uuid: { from } } )-[r${edges}]->(to { uuid: { to } })
      RETURN DISTINCT r
    `

    let result = await execute({ query, params })
    return result.map(row => row.r)
  }

  static async insert (from, to, types, props) {
    let params = { from, to }
    let now = new Date()
    props = { ...props, created_at: now.getTime(), updated_at: now.getTime() }
    let queryprops = addSetProperties(props, 'r')
    let query = `
      MATCH (from { uuid: { from } })
      MATCH (to { uuid: { to } })
      MERGE (from)-[r${edgestr(types)}]->(to)
      ON CREATE SET ${ queryprops }
      ON MATCH SET ${ queryprops }
      RETURN DISTINCT r
    `

    let result = await execute({ query, params })
    return result.map(row => row.r)
  }

  static async find (uuid) {
    let params = { uuid }
    let query = `
      MATCH ()-[r]->()
      WHERE r.uuid = { uuid }
      RETURN DISTINCT r
    `

    let result = await execute({ query, params })
    return result.map(row => row.r)
  }

  static async findByID (id) {
    let query = `
      MATCH ()-[r]->()
      WHERE ID(r) = ${id}
      RETURN DISTINCT r
    `
    let result = await execute(query)
    return result.map(row => row.r)
  }

  static async update (uuid, props) {
    let params = { uuid }
    let queryprops = addSetProperties(props, 'r')
    let query = `
      MATCH ()-[r]->()
      WHERE r.uuid = { uuid }
      SET ${ queryprops }
      RETURN r
    `

    let result = await execute({ query, params })
    return result.map(row => row.r)
  }

  static async where (args = {}, limit = 25) {
    let queryprops = addSetProperties(args, 'r')
    let query = `
      MATCH ()-[r]->()
      WHERE ${ queryprops }
      RETURN r
      LIMIT ${limit}
    `

    if (!args) query = `MATCH ()-[r]->() RETURN DISTINCT r LIMIT ${limit}`

    let result = await execute(query)
    return result.map(row => row.r)
  }

}
