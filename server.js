'use strict'

const express = require('express')
const basicAuth = require('express-basic-auth')

const { updateHitCount, getLastAgentRequest, registerAgentRequest } = require('./db')
const JovianXSDK = require('./JovianXSDK')

function readEnv (envVarName) {
  return process.env[envVarName] || (() => { throw new Error(`Env var '${envVarName}' is unset`) })
}

const vendorCompany = readEnv('VENDOR_COMPANY')
const endCompany = readEnv('END_COMPANY')
const accountApiKey = readEnv('ACCOUNT_API_KEY')
const enableTosSecureChange = readEnv('ENABLE_TOS_SECURE_CHANGE')
const months = readEnv('MONTHS')
const adminEmail = readEnv('ADMIN_EMAIL')
const adminPassword = readEnv('ADMIN_PASSWORD')
const apiHost = readEnv('API_HOST')

const jovianXSDK = new JovianXSDK(apiHost, vendorCompany, endCompany, accountApiKey)

;(async () => {
  try {
    await Promise.all([
      startWebServer(),
      startAgentServer(),
    ])
    await jovianXSDK.trackEvent('App initialized', { timestamp: Date.now() })
  } catch (err) {
    console.error('Fatal error', err)
    await jovianXSDK.trackEvent('App initialization failed', { err: err.toString() })
  }
})()

async function startWebServer () {
  const WEB_PORT = 3000

  const webApp = express()

  webApp.use('/app', basicAuth({
    users: { [adminEmail]: adminPassword },
    challenge: true,
    realm: 'jovianx-simple-node-app',
  }))

  webApp.get('/app', async (req, res) => {
    try {
      const hitCount = await updateHitCount()
      const agentHostname = await getLastAgentRequest()

      const html = `
        <body>
          Hello <strong>${endCompany}</strong>, (hitcount: <strong>${hitCount}</strong>)<br>
          TOS Secure: <strong>${enableTosSecureChange}</strong><br>
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

  webApp.get('/health', async (req, res) => {
    res.sendStatus(200)
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
      res.sendStatus(200)
      console.log('Agent request completed')
      await jovianXSDK.trackEvent('Agent reported', { hostname: hostname })
    } catch (err) {
      res.send(500, `Error!\n\n${err.toString()}`)
      console.error('Agent request failed', err)
    }
  })

  agentApp.listen(AGENT_PORT)
  console.log('Running on http://localhost:' + AGENT_PORT)
}
