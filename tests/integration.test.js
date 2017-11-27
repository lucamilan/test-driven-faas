const assert = require('assert')
const utils = require('./utils')
const supertest = require('supertest')

describe('with graphql endpoint', function() {
  this.timeout(5 * 1000)

  const request = () => {
    const endpoint = utils.getServiceEndpoint()

    return supertest(endpoint)
  }

  it('read your write', () => {
    const key = 'SET-KEY'
    const expected = 'some value'
    return request().get('/graphql')
      .query({query: `mutation {value(key:"${key}", value:"${expected}")}`})
      .expect('Content-Type', /json/)
      .expect(200)
      .then(r => request().get('/graphql')
        .query({query: `{value(key:"${key}")}`})
        .expect(res => {
          assert.equal(expected, res.body.data.value)
        }))
      .catch(e => {
        if (e) {
          throw e
        }
     })
  })

  it('getting an error', () => {
    return request().get('/graphql')
      .query({query: '{value}'})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => { assert.equal(1, res.body.errors.length) })
  })
})
