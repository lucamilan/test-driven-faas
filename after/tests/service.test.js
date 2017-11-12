const assert = require('assert')
const utils = require('./utils')
const request = require('superagent')

describe('deploy service', function () {
    this.timeout( 5 * 60 * 1000 )

    before(function () {
        utils.deployService()
    })

    after(function () {
        utils.removeService()
    })

    afterEach(function(){
        utils.getFunctionLogs()
    })

    it('retrieving value for a key', function (done) {
        const expected = ''
        request.get(utils.getServiceEndpoint())
            .query({query: '{value(key:"FAKE-KEY")}'})
            .end((err, res) => {
                if (err) return done(err)
                assert.equal(expected, res.body.data.value)
                done()
            })
    })

    it('getting an error', function (done) {
        const expected = 1
        request.get(utils.getServiceEndpoint())
            .query({query: '{value}'})
            .end((err, res) => {
                if (err) return done(err)
                assert.equal(expected,res.body.errors.length)
                done()
            })
    })

    it('writing value for a key', function (done) {
        const expected = 'TEST'
        request.get(utils.getServiceEndpoint())
            .query({query: `mutation {value(key:"SET-KEY", value:"${expected}")}`})
            .end((err, res) => {
                if (err) return done(err)
                assert.equal(expected, res.body.data.value)
                done()
            })
    })
})
