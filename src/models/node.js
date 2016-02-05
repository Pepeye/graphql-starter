import uuid from 'node-uuid'
import { execute } from '../lib/db'
import { labelstr, edgestr, addSetProperties } from './model.helpers'

export default class Node {

  constructor (props) {
    this.labels = []
    this.properties = { uuid: uuid.v4(), ...props }
  }

  get uuid () {
    return this.properties.uuid
  }

  get label () {
    return this.labels
  }

  set label (newlabels) {
    this.labels = [ ...newlabels ]
  }

  get info () {
    return this.properties
  }

  set info (newprops) {
    if (newprops) {
      this.properties = Object.assign({}, this.info, newprops)
    }
  }

  async save () {
    let { uuid, labels, properties } = this
    let now = new Date()
    properties = { ...properties, created_at: now.getTime(), updated_at: now.getTime() }
    let params = { uuid, meta: { ...properties } }
    let query = `
      MERGE (n {uuid: { uuid } } )
      ON CREATE SET n += { meta }, n ${labelstr(labels)}
      ON MATCH SET n += { meta }, n ${labelstr(labels)}
      RETURN n
    `
    // if no labels adjust cypher query
    if (labels.length === 0) {
      query = `
        MERGE (n {uuid: { uuid } } )
        ON CREATE SET n += { meta }
        ON MATCH SET n += { meta }
        RETURN n
      `
    }

    let result = await execute({ query, params })
    return result.map(row => row.n)
  }

  // S T A T I C   M E T H O D S

  static async all (labels = [], limit = 25) {
    let query = `
      MATCH (n${labelstr(labels)})
      RETURN n
      LIMIT ${limit}
    `
    let result = await execute(query)
    return result.map(row => row.n)
  }

  static create (...props) {
    let node = new this(...props)
    return node.save()
  }

  static async delete (uuid) {
    let query = `
      MATCH (n {uuid: '${uuid}'})
      DETACH DELETE n
    `
    return await execute(query)
      .then(() => {
        return { status: 200, message: `Node (uuid: ${uuid}) successfully deleted` }
      })
      .catch(err => err)
  }

  static async find (uuid) {
    let query = `
      MATCH (n {uuid: '${uuid}' })
      RETURN n
    `

    let result = await execute(query)
    return result.map(row => row.n)
  }

  static async findByID (id) {
    let query = `
      MATCH (n)
      WHERE ID(n) = ${id}
      RETURN n
    `

    let result = await execute(query)
    return result.map(row => row.n)
  }

  static async merge (uuid, props) {
    let now = new Date()
    props = { ...props, updated_at: now.getTime() }
    let params = { uuid, meta: { uuid, ...props } }
    let query = `
      MERGE (node {uuid: { uuid } } )
      ON CREATE SET node += { meta }, n.created_at: ${now.getTime()}
      ON MATCH SET node += { meta }
      RETURN node
    `

    let result = await execute({ query, params })
    return result.map(row => row.n)
  }

  static async update (uuid, props) {
    let now = new Date()
    props = { ...props, updated_at: now.getTime() }
    let params = { uuid, meta: { uuid, ...props } }
    let query = `
      MATCH (n {uuid: { uuid } } )
      SET n += { meta }
      RETURN n
    `

    let result = await execute({ query, params })
    return result.map(row => row.n)
  }

  static async findByProperties (args) {
    let conditions = []
    let params = { meta: args }

    Object.keys(args).forEach(key => {
      conditions.push(`${key}:'${args[key]}'`)
    })

    let query = `
      MATCH (n {${conditions.join(',')}} )
      RETURN n
    `
    let result = await execute({ query, params })
    return result.map(row => row.n)
  }

  static async findLabels (uuid) {
    let query = `
      MATCH (n { uuid: '${uuid}' })
      RETURN LABELS(n) as labels
    `

    let result = await execute(query)
    return result.map(row => row.labels)
  }

  static async deleteLabels (uuid, label) {
    if (label) {
      let query = `
        MATCH (n { uuid: '${uuid}' })
        REMOVE n${labelstr(label)}
        SET n.updated_at = ${new Date().getTime()}
        RETURN n
      `

      let result = await execute(query)
      return result.map(row => row.n)
    }
  }

  static async addLabels (uuid, newlabels) {
    /**
     * set if there are new labels
     * type: string, Array | expect length > 0
     * fetch node labels from database
     */
    if (newlabels.length > 0) {
      let types = labelstr(newlabels)
      let query = `
        MATCH (n { uuid: '${uuid}' })
        SET n ${types}, n.updated_at = ${new Date().getTime()}
        RETURN n
      `

      let result = await execute(query)
      return result.map(row => row.n)
    }
  }

  static async findEdges (uuid) {
    let params = { uuid }
    let query = `
      MATCH (n {uuid: { uuid } } )-[r]-()
      RETURN r
    `

    let result = await execute({ query, params })
    return result.map(row => row.r)
  }

  static async createEdge (from, to, edge_name, props) {
    let params = { from, to, meta: { ...props } }
    let queryprops = addSetProperties(props, 'r')
    let query = `
      MATCH (from { uuid: { from } })
      MATCH (to { uuid: { to } })
      MERGE (from)-[r${edgestr(edge_name)}]->(to)
      ON CREATE SET ${ queryprops }
      ON MATCH SET ${ queryprops }
      RETURN r
    `

    let result = await execute({ query, params })
    return result.map(row => row.r)
  }

  static async deleteEdge (from, to, edge_name, props = {}) {
    let params = { from, to, meta: { props } }
    let queryprops = addSetProperties(props, 'r')
    let query = `
      MATCH (from { uuid: { from } })
      MATCH (to { uuid: { to } })
      MATCH (from)-[r${edgestr(edge_name)}]->(to)
      DELETE r
    `
    // find specific edge by properties if they exist
    if (props) {
      query = `
        MATCH (from { uuid: { from } })
        MATCH (to { uuid: { to } })
        MATCH (from)-[r${edgestr(edge_name)}]->(to)
        WHERE ${ queryprops }
        DELETE r
      `
    }

    return await execute({ query, params })
      .then(() => {
        let edgeMsg = (edgestr(edge_name).length > 0) ? `TYPE (${edgestr(edge_name)})` : ``
        return {
          status: 200,
          message: `Edge ${edgeMsg} from (uuid: '${from}') to (uuid: '${to}') deleted`
        }
      })
      .catch(err => err)
  }

  static async query (qry) {
    let result = await execute(qry)
    return result.map(row => row.n)
  }

  static async where (...args) { }

}
