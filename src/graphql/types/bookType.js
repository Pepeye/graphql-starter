import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import { baseFields, freebaseFields } from './baseFields'

const bookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    labels: { type: new GraphQLList(GraphQLString) },
    properties: { type: bookProps }
  })
})

let bookProps = new GraphQLObjectType({
  name: 'Properties',
  fields: {
    ...baseFields,
    website: { type: GraphQLString },
    ...freebaseFields
  }
})

export default bookType
