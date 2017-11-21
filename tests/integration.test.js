const assert = require('assert')
const utils = require('./utils')
const supertest = require('supertest')

describe('with graphql endpoint', function() {
  this.timeout(5 * 1000)
  const request = () => {
    const endpoint = utils.getServiceEndpoint()
    console.log(`ENDPOINT: ${endpoint}`)
    return supertest(endpoint)
  }

  it('retrieving value for a key', done => {
    request().get('/graphql')
      .query({query: '{value(key:"FAKE-KEY")}'})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => { assert.equal('', res.body.data.value) })
      .end(done)
  })

  it('getting an error', done => {
    request().get('/graphql')
      .query({query: '{value}'})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => { assert.equal(1, res.body.errors.length) })
      .end(done)
  })

  it('writing value for a key', done => {
    const expected = 'TEST'
    request().get('/graphql')
      .query({query: `mutation {value(key:"SET-KEY", value:"${expected}")}`})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => { assert.equal(expected, res.body.data.value) })
      .end(done)
  })
})
