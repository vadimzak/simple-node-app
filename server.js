'use strict'

const express = require('express')
const basicAuth = require('express-basic-auth')

const { updateHitCount, getLastAgentRequest, registerAgentRequest } = require('./db')

function readEnv (envVarName) {
  return process.env[envVarName] || (() => { throw new Error(`Env var '${envVarName}' is unset`) })
}

const endCompany = readEnv('END_COMPANY')
const accountApiKey = readEnv('ACCOUNT_API_KEY')
const subscription = readEnv('SUBSCRIPTION')
const sla = readEnv('SLA')
const months = readEnv('MONTHS')
const adminEmail = readEnv('ADMIN_EMAIL')
const adminPassword = readEnv('ADMIN_PASSWORD')

;(async () => {
  try {
    await Promise.all([
      startWebServer(),
      startAgentServer(),
    ])
  } catch (err) {
    console.error('Fatal error', err)
  }
})()

async function startWebServer () {
  const WEB_PORT = 3000

  const webApp = express()

  webApp.use(basicAuth({
    users: { [adminEmail]: adminPassword }
  }))

  webApp.get('/', async (req, res) => {
    try {
      const hitCount = await updateHitCount()
      const agentHostname = await getLastAgentRequest()

      const html = `
      <body>
        Hello <strong>${endCompany}</strong>, (hitcount: <strong>${hitCount}</strong>)<br>
        Subscription type: <strong>${subscription}</strong><br>
        SLA: <strong>${sla}</strong><br>
        Months: <strong>${months}</strong><br>
        Agent hostname: <strong>${JSON.stringify(agentHostname)}</strong><br>
      </body>
    `
      res.send(html)
      console.log('Web request completed')
    } catch (err) {
      res.send(500, `Error!\n\n${err.toString()}`)
      console.error('Web request failed', err)
    }
  })

  webApp.listen(WEB_PORT)
  console.log('Running on http://localhost:' + WEB_PORT)
}

async function startAgentServer () {
  const AGENT_PORT = 4000

  const agentApp = express()

  agentApp.use(basicAuth({
    users: { [endCompany]: accountApiKey }
  }))

  agentApp.get('/', async (req, res) => {
    try {
      const hostname = req.query['agent-hostname']
      await registerAgentRequest(hostname)
      res.send(200)
      console.log('Agent request completed')
    } catch (err) {
      res.send(500, `Error!\n\n${err.toString()}`)
      console.error('Agent request failed', err)
    }
  })

  agentApp.listen(AGENT_PORT)
  console.log('Running on http://localhost:' + AGENT_PORT)
}
