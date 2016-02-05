import neo4j from 'neo4j'

const dbconf = {
  url: 'http://localhost:7474',
  auth: {
    username: process.env.NEO4J_USER || 'neo4j',
    password: process.env.NEO4J_PASS || 'neo4j'
  }
}

export const db = new neo4j.GraphDatabase(dbconf)

/**
 * wrap neo4j cypher queries in a promise
 * should work with batching of queries too, just make sure
 * to pass parameters as specified in the repo
 * https://github.com/thingdom/node-neo4j/tree/v2#cypher
 * https://github.com/thingdom/node-neo4j/tree/v2#batching
 */
export function execute (query) {
  return new Promise((resolve, reject) => {
    db.cypher(query, (err, result) => {
      if (err) {
        reject(err.neo4j)
      } else {
        resolve(result)
      }
    })
  })
}

/**
 * wrap neo4j http/plugin requests in a promise
 * https://github.com/thingdom/node-neo4j/tree/v2#http-plugins
 */
export function request (query) {
  return new Promise((resolve, reject) => {
    db.http(query, (err, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}
