const assert = require('assert')
const utils = require('./utils')
const supertest = require('supertest')

const prop = (...arr) => obj => arr.reduce((acc, v) => acc && acc.hasOwnProperty(v) ? acc[v] : undefined, obj)

describe('with graphql endpoint', function() {
  this.timeout(5 * 1000)

  const request = () => supertest(utils.getServiceEndpoint())

  it('writing a value', () => {
    const key = 'SET-KEY'
    const expected = 'some value'

    return request().get('/graphql')
      .query({query: `mutation {set(key:"${key}", value:"${expected}")}`})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(r => {
        assert.equal(expected,
          r.body.data.set,
          JSON.stringify(prop('body', 'errors')(r))) })
  })

  it('reading a value', () => {
    const key = 'GET-KEY'
    const expected = ''

    return request().get('/graphql')
      .query({query: `{value(key:"${key}")}`})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(r => {
        assert.equal(expected,
          r.body.data.value,
          JSON.stringify(prop('body', 'errors')(r)))
      })
  })

  it('getting an error', () => {
    return request().get('/graphql')
      .query({query: '{value}'})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(r => {
        assert.equal(1,
          prop('body', 'errors', 'length')(r),
          JSON.stringify(prop('body', 'errors')(r)))
      })
  })
})
