'use strict'
const AWS = require('aws-sdk')
const options = process.env.IS_OFFLINE ? {
  region: 'localhost',
  endpoint: 'http://localhost:8000'
} : {}

module.exports = () => new AWS.DynamoDB.DocumentClient(options)