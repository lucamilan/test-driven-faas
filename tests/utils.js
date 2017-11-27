'use strict'

const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync
const workingDir = path.join(__dirname, '..')

const getArg = name => {
  const args = process.argv
  const index = args.indexOf(name)

  if (index !== -1 && index < (args.length - 1)) {
      return args[index+1]
  }

  return undefined
}

module.exports = {
  getServiceEndpoint() {
    const stage = getArg('--stage')
    const endpoint = getArg('--endpoint')

    if (typeof endpoint !== 'undefined') {
      return endpoint
    }

    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '.serverless', `stack-output-${stage}.json`)).toString())

    return data.ServiceEndpoint
  }
}
