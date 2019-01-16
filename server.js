'use strict'

const express = require('express')

const { updateHitCount, getLastAgentRequest, registerAgentRequest } = require('./db')

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
  webApp.get('/', async (req, res) => {
    try {
      const hitCount = await updateHitCount()
      const agentHostname = await getLastAgentRequest()

      const html = `
      <body>
        Hello <strong>${process.env.END_COMPANY || 'guest'}</strong>, (hitcount: <strong>${hitCount}</strong>)<br>
        Subscription type: <strong>${process.env.SUBSCRIPTION}</strong><br>
        SLA: <strong>${process.env.SLA}</strong><br>
        Months: <strong>${process.env.MONTHS}</strong><br>
        Agent hostname: <strong>${JSON.stringify(agentHostname)}</strong><br>
      </body>
    `
      res.send(html)
      console.error('Web request completed')
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
  agentApp.get('/', async (req, res) => {
    try {
      const hostname = req.query['agent-hostname']
      await registerAgentRequest(hostname)
      res.send(200)
      console.error('Agent request completed')
    } catch (err) {
      res.send(500, `Error!\n\n${err.toString()}`)
      console.error('Agent request failed', err)
    }
  })

  agentApp.listen(AGENT_PORT)
  console.log('Running on http://localhost:' + AGENT_PORT)
}
