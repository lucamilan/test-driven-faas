const assert = require('assert')
const utils = require('./utils')
const supertest = require('supertest')
const stage = `T${(new Date().getTime() / 1000 | 0).toString()}`

describe('deploy service', function () {
  this.timeout(5 * 60 * 1000)
  let request
  let graphql

  before(function () {
    utils.deployService(stage)
    request = supertest(utils.getServiceEndpoint(stage))
  })

  after(function () {
    utils.getFunctionLogs(stage)
    utils.removeService(stage)
  })

  beforeEach(function(){
    graphql = request.get('/graphql')
  })

  it('retrieving value for a key', function (done) {
    graphql
      .query({query: '{value(key:"FAKE-KEY")}'})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        assert.equal('', res.body.data.value)
      })
      .end(done)
  })

  it('getting an error', function (done) {
    graphql.query({query: '{value}'})
           .expect('Content-Type', /json/)
           .expect(200)
           .expect(res => { assert.equal(1, res.body.errors.length) })
           .end(done)
  })

  it('writing value for a key', function (done) {
    const expected = 'TEST'
    graphql.query({query: `mutation {value(key:"SET-KEY", value:"${expected}")}`})
           .expect('Content-Type', /json/)
           .expect(200)
           .expect(res => { assert.equal(expected, res.body.data.value) })
           .end(done)
  })
})
