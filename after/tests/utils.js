'use strict'

const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync
const workingDir = path.join(__dirname, '..')

module.exports = {

    getServiceEndpoint(stage = 'integration') {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '.serverless', `stack-output-${stage}.json`)).toString())
        return data.ServiceEndpoint
    },

    deployService(stage = 'integration') {
        execSync(`npm i`, {cwd: workingDir, stdio: 'inherit'})
        execSync(`sls deploy -s ${stage}`, {cwd: workingDir, stdio: 'inherit'})
    },

    removeService(stage = 'integration') {
        execSync(`sls remove -s ${stage}`, {cwd: workingDir, stdio: 'inherit'})
    },

    infoService(stage = 'integration') {
        execSync(`sls info -s ${stage}`, {cwd: workingDir, stdio: 'inherit'})
    }
}