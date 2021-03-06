'use strict'
const AWS = require('aws-sdk')
const config = require('./config.json')
const options = config[process.env.STAGE] || {}
const db = () => new AWS.DynamoDB.DocumentClient(options)

module.exports = {
  getValue: key => {
    const params = {
      TableName: process.env.DB_TABLE,
      Key: { key }
    }

    return new Promise((resolve, reject) => {
      db().get(params, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(typeof data.Item === 'undefined' ? '' : data.Item.info)
        }
      })
    })
  },
  setValue: (key, info) => {
    const params = {
      TableName: process.env.DB_TABLE,
      Key: { key: key },
      UpdateExpression: 'SET info = :info',
      ExpressionAttributeValues: {
        ':info': info
      }
    }

    return new Promise((resolve, reject) => {
      db().update(params, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      })
    })
  }
}
