const assert = require('assert')
const utils = require('./utils')
const request = require('superagent')
const stage = `T${(new Date().getTime() / 1000 | 0).toString()}`

describe('deploy service', function () {
    this.timeout( 5 * 60 * 1000 )

    before(function () {
        utils.deployService(stage)
    })

    after(function () {
        utils.getFunctionLogs(stage)
        utils.removeService(stage)
    })

    it('retrieving value for a key', function (done) {
        const expected = ''
        request.get(utils.getServiceEndpoint(stage))
            .query({query: '{value(key:"FAKE-KEY")}'})
            .end((err, res) => {
                if (err) return done(err)
                assert.equal(200, res.statusCode)
                assert.equal(expected, res.body.data.value)
                done()
            })
    })

    it('getting an error', function (done) {
        const expected = 1
        request.get(utils.getServiceEndpoint(stage))
            .query({query: '{value}'})
            .end((err, res) => {
                if (err) return done(err)
                assert.equal(200, res.statusCode)
                assert.equal(expected,res.body.errors.length)
                done()
            })
    })

    it('writing value for a key', function (done) {
        const expected = 'TEST'
        request.get(utils.getServiceEndpoint(stage))
            .query({query: `mutation {value(key:"SET-KEY", value:"${expected}")}`})
            .end((err, res) => {
                if (err) return done(err)
                assert.equal(200, res.statusCode)
                assert.equal(expected, res.body.data.value)
                done()
            })
    })
})
