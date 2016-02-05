import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString
} from 'graphql'

const nodeType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    _id: { type: GraphQLID },
    labels: { type: new GraphQLList(GraphQLString) },
    properties: { type: nodeProperties }
  })
})

let nodeProperties = new GraphQLObjectType({
  name: 'Properties',
  fields: {
    uuid: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    website: { type: GraphQLString }
  }
})

export default nodeType
