'use strict'
const {graphql} = require('graphql')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const {makeExecutableSchema} = require('graphql-tools')

module.exports.graphql = (event, context, callback) => {
  const db = require('./db')(process.env.STAGE, process.env.DB_TABLE)
  const source = event.queryStringParameters.query
  const contextValue = db
  const schema = makeExecutableSchema({typeDefs, resolvers})
  graphql({schema, source, contextValue})
    .then(result => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
      })
    })
    .catch(error => {
      console.error(JSON.stringify(error))
      callback(error)
    })
}
