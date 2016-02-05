import { expect } from 'chai'

// L O G G E R
export function logger (data, recordcount, keys) {
  console.log(`
    LOGGER -------------------------------------------------------------
    _id: ${data[0]._id}
    labels: ${data[0].labels}
    properties: ${JSON.stringify(data[0].properties, null, 2)}
    keys: ${keys}
    --------------------------------------------------------------------
    count: ${recordcount}
  `)
}

//
export function validateNeo4jNode (result, debug = false) {
  // body...
  let recordcount = Object.keys(result).length
  let keys = Object.keys(result[0])
  if (debug) logger(result, recordcount, keys)
  // expect to find data
  expect(result).to.exist

  // response object shape is { node: { _id, labels, properties } }
  expect(keys.indexOf('_id')).to.be.gt(-1)
  expect(keys.indexOf('labels')).to.exist
  expect(keys.indexOf('properties')).to.be.gt(-1)

  // // only one record is returned
  expect(recordcount).to.equal(1)
}

// for (let key in props) {
//  if (props.hasOwnProperty(key)) {
//     let obj = props[key];
//     for (let prop in obj) {
//        if (obj.hasOwnProperty(prop)) {
//           alert(prop + " = " + obj[prop]);
//        }
//     }
//  }
// }

export function addCypherSetQueries (props, alias) {
  let arr = []
  if (props) {
    for (let key in props) {
      if (props.hasOwnProperty(key)) {
        // console.log(`${alias}.${key} = ${props[key]}`)
        if (typeof props[key] === 'string') {
          arr.push(`${alias}.${key} = '${props[key]}'`)
        } else {
          arr.push(`${alias}.${key} = ${props[key]}`)
        }
      }
    }
  }
  return arr.join(', ')
}
