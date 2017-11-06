const assert = require('assert')
const AWS = require('aws-sdk-mock')
const handler = require('../src/handler')

const stubDocumentClient = result => {
  AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
    callback(null, result)
  })
}

process.env.DB_TABLE = 'some-table'

describe('graphql', () => {
  it('retrieving value for a key', done => {
    const expected = 'fake value'
    stubDocumentClient({
      Item: {
        info: expected
      }
    })
    const evt = {
      queryStringParameters: {
        query: '{getKey(key:"Username")}'
      }
    }
    handler.graphql(evt, null, (error, result) => {
      assert.equal(expected, JSON.parse(result.body).data.getKey)
      done()
    })
  })

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient')
  })
})
