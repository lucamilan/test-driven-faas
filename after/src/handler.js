'use strict'
const { graphql } = require('graphql')
const db = require('./db')

module.exports.graphql = (event, context, callback) => {
  const schema = require('./schema')(db())
  graphql(schema, event.queryStringParameters.query)
    .then(result => callback(null, {
    statusCode: 200,
    body: JSON.stringify(result)
  }), error => callback(error))
}
