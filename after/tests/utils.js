'use strict'

const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

const slsExec = path.join(__dirname, '..', 'node_modules', 'serverless', 'bin', 'serverless');
const workingDir = path.join(__dirname, '..')

module.exports = {
    slsExec: slsExec,

    getServiceEndpoint(stage = 'integration') {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '.serverless', `stack-output-${stage}.json`)).toString())
        return `${data.ServiceEndpoint}/graphql`
    },

    deployService(stage = 'integration') {
        execSync(`${slsExec} deploy -s ${stage}`, { cwd: workingDir, stdio: 'inherit' })
    },

    removeService(stage = 'integration') {
        execSync(`${slsExec} remove -s ${stage}`, { cwd: workingDir, stdio: 'inherit' })
    },

    getFunctionLogs(stage = 'integration') {
        const logs = execSync(`${slsExec} logs -f graphql -s ${stage}`, { cwd: workingDir, stdio: 'inherit' })
        if(!logs)return ''
        const logsString = new Buffer(logs, 'base64').toString();
        process.stdout.write(logsString);
        return logsString;
    }
}