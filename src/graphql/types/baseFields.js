import {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} from 'graphql'

export const baseFields = {
  uuid: { type: GraphQLString },
  title: { type: GraphQLString },
  edition: { type: GraphQLInt },
  description: { type: GraphQLString },
  created_at: { type: GraphQLFloat },
  updated_at: { type: GraphQLFloat }
}

export const freebaseFields = {
  mid: { type: GraphQLString },
  wikipedia: { type: GraphQLString },
  wiki: { type: GraphQLInt },
  freebase: { type: GraphQLString },
  basekb: { type: GraphQLString }
}
