'use strict'
const AWS = require('aws-sdk')
let options = {}

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }
}

const schema = require('./schema')(new AWS.DynamoDB.DocumentClient(options))
const { graphql } = require('graphql')

module.exports.graphql = (event, context, callback) => graphql(schema, event.queryStringParameters.query)
  .then(result => callback(null, {
    statusCode: 200,
    body: JSON.stringify(result)
  }), err => callback(err))
