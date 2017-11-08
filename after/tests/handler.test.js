const assert = require('assert')
const AWS = require('aws-sdk-mock')
const handler = require('../src/handler')
const db = require('../src/db')

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
        query: '{value(key:"Username")}'
      }
    }
    handler.graphql(evt, null, (error, result) => {
      assert.equal(expected, JSON.parse(result.body).data.value)
      done()
    })
  })

  it('missing key', done => {
    const expected = ''
    stubDocumentClient({ })
    const evt = {
      queryStringParameters: {
        query: '{value(key:"Username")}'
      }
    }
    handler.graphql(evt, null, (error, result) => {
      assert.equal(expected, JSON.parse(result.body).data.value)
      done()
    })
  })

  it('wrong format query', done => {
    const expected = ''
    stubDocumentClient({ })
    const evt = {
      queryStringParameters: {
        query: '{valuekeyUsername")}'
      }
    }
    handler.graphql(evt, null, (error, result) => {
      assert.equal(1, JSON.parse(result.body).errors.length)
      done()
    })
  })

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient')
  })
})
