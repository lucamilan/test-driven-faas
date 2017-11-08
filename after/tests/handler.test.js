const assert = require('assert')
const AWS = require('aws-sdk-mock')
const handler = require('../src/handler')

const stubDocumentClient = (result, f) => {
  AWS.mock('DynamoDB.DocumentClient', f, (params, callback) => {
    callback(null, result)
  })
}
const stubDocumentClientRead = result => stubDocumentClient(result, 'get')
const stubDocumentClientWrite = result => stubDocumentClient(result, 'update')

process.env.DB_TABLE = 'some-table'

describe('querying', () => {
  it('retrieving value for a key', done => {
    const expected = 'fake value'
    stubDocumentClientRead({
      Item: {
        info: expected
      }
    })
    const evt = {
      queryStringParameters: {
        query: '{value(key: "Username")}'
      }
    }
    handler.graphql(evt, null, (error, result) => {
      assert.equal(expected, JSON.parse(result.body).data.value)
      done()
    })
  })

  it('missing key', done => {
    const expected = ''
    stubDocumentClientRead({ })
    const evt = {
      queryStringParameters: {
        query: '{value(key: "Username")}'
      }
    }
    handler.graphql(evt, null, (error, result) => {
      assert.equal(expected, JSON.parse(result.body).data.value)
      done()
    })
  })

  it('wrong format query', done => {
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

describe('mutating', () => {
  it('writing value for a key', done => {
    const expected = 'Mario'
    stubDocumentClientWrite({ })
    const evt = {
      queryStringParameters: {
        query: `mutation {value(key: "Username", value: "${expected}")}`
      }
    }
    handler.graphql(evt, null, (error, result) => {
      assert.equal(expected, JSON.parse(result.body).data.value)
      done()
    })
  })

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient')
  })
})
