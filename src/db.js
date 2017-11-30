'use strict'
const AWS = require('aws-sdk')

module.exports = (stage, tableName) => {
  const client = stage => new AWS.DynamoDB.DocumentClient(require('./config.json')[stage] || {})

  return {
    getValue: key => {
      const params = {
        TableName: tableName,
        Key: { key }
      }

      return new Promise((resolve, reject) => {
        client(stage).get(params, (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(typeof data.Item === 'undefined' ? '' : data.Item.val)
          }
        })
      })
    },
    setValue: (key, value) => {
      const params = {
        TableName: tableName,
        Key: { key: key },
        UpdateExpression: 'SET val = :value',
        ExpressionAttributeValues: {
          ':value': value
        },
        ReturnValues: 'ALL_NEW'
      }

      return new Promise((resolve, reject) => {
        client(stage).update(params, (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(data.Attributes.val)
          }
        })
      })
    }
  }
}
