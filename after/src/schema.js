'use strict'
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql')

module.exports = db => new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      setKey: {
        args: {
          key: { name: 'key', type: new GraphQLNonNull(GraphQLString) },
          value: { name: 'value', type: new GraphQLNonNull(GraphQLString) }
        },
        type: GraphQLString,
        resolve: (parent, args) => db.setKeyValue(args.key, args.value)
      }
    }
  }),
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      getKey: {
        args: { key: { name: 'key', type: new GraphQLNonNull(GraphQLString) } },
        type: GraphQLString,
        resolve: (parent, args) => db.getKeyValue(args.key)
      }
    }
  })
})
