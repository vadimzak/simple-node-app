'use strict'

const MongoClient = require('mongodb').MongoClient

const databaseHost = (process.env.DATABASE_HOST || 'localhost').trim()
const databasePort = (process.env.DATABASE_PORT || '27017').trim()
const databaseUser = (process.env.DATABASE_USER || '').trim()
const databasePassword = (process.env.DATABASE_PASSWORD || '').trim()
const databaseName = (process.env.DATABASE_NAME || 'test_db').trim()
const databaseConnectionOpts = (process.env.DATABASE_CONNECTION_OPTIONS || '').trim()

const auth = (databaseUser && databasePassword) ? `${databaseUser}:${databasePassword}@` : ''
const dbUrl = `mongodb://${auth}${databaseHost}:${databasePort}/${databaseName}?${databaseConnectionOpts}`

exports.updateHitCount = async () => {
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = client.db(databaseName)
    const hitsCollection = db.collection('hits')

    await hitsCollection.insertOne({ time: Date.now() })
    return await hitsCollection.countDocuments()
  } finally {
    client.close()
  }
}

exports.getLastAgentRequest = async () => {
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = client.db(databaseName)
    const agentRequestsCollection = db.collection('agent_requests')
    const lastRecord = await agentRequestsCollection.findOne({}, { sort: [['time', -1]] })
    return lastRecord ? lastRecord.hostname : null
  } finally {
    client.close()
  }
}

exports.registerAgentRequest = async (hostname) => {
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = client.db(databaseName)
    const agentRequestsCollection = db.collection('agent_requests')
    await agentRequestsCollection.insertOne({ time: Date.now(), hostname: hostname })
  } finally {
    client.close()
  }
}
