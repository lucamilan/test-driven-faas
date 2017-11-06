const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql')

const getKeyValue = db => key => {
  const params = {
    TableName: process.env.DB_TABLE,
    Key: { key }
  }

  return new Promise((resolve, reject) => {
    db.get(params, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(typeof data.Item === 'undefined' ? '' : data.Item.info)
      }
    })
  })
}

const setKeyValue = db => (key, info) => {
  const params = {
    TableName: process.env.DB_TABLE,
    Key: { key: key },
    UpdateExpression: 'SET info = :info',
    ExpressionAttributeValues: {
      ':info': info
    }
  }
  return db.update(params).promise().then(() => info)
}

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
        resolve: (parent, args) => setKeyValue(db)(args.key, args.value)
      }
    }
  }),
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      getKey: {
        args: { key: { name: 'key', type: new GraphQLNonNull(GraphQLString) } },
        type: GraphQLString,
        resolve: (parent, args) => getKeyValue(db)(args.key)
      }
    }
  })
})
