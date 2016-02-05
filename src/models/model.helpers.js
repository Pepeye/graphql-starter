export function labelstr (labels) {
  if (labels && labels.length > 0) {
    let str = (labels && Array.isArray(labels)) ? labels.join(':') : labels
    return `:${str}`
  }
  return ''
}

export function edgestr (edges) {
  if (edges && edges.length > 0) {
    let str = (edges && Array.isArray(edges)) ? edges.join('|') : edges
    return `:${str.toUpperCase()}`
  }
  return ''
}

export function addSetProperties (props, alias) {
  let arr = []
  let result = ''
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
    result = arr.join(', ')
  }
  return result
}

export function addLiteralMap (props) {
  let arr = []
  let result = ''
  if (props) {
    for (let key in props) {
      if (props.hasOwnProperty(key)) {
        // console.log(`${alias}.${key} = ${props[key]}`)
        if (typeof props[key] === 'string') {
          arr.push(`${key}: '${props[key]}'`)
        } else {
          arr.push(`${key}: ${props[key]}`)
        }
      }
    }
    result = arr.join(', ')
  }
  return result
}

export function logger (query, params, args) {
  let { uuid, labels, properties } = args
  console.log(`
    I N P U T   P A R A M E T E R S
    --------------------------------------------------
    uuid: ${uuid}
    labels: ${labels}
    labelString: ${labelstr(['Company', 'Busienes', 'Organization'])}
    properties: ${JSON.stringify(properties)}
    --------------------------------------------------
    `)

  console.log(`
    D A T A B A S E   E X E C U T I O N   P L A N
    [query] --------------------------------------------------
    ${JSON.stringify(query)}
    [parameters] ---------------------------------------------
    params: ${Object.keys(params)}
    properties: ${Object.keys(params.meta)}
    ----------------------------------------------------------
    `)
}
