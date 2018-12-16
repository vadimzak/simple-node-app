'use strict';

const MongoClient = require('mongodb').MongoClient;


const databaseHost = process.env.DATABASE_HOST.trim();
const databasePort = process.env.DATABASE_PORT.trim();
const databaseUser = process.env.DATABASE_USER.trim();
const databasePassword = process.env.DATABASE_PASSWORD.trim();
const databaseName = process.env.DATABASE_NAME.trim();
const databaseConnectionOpts = process.env.DATABASE_CONNECTION_OPTIONS.trim();

const dbUrl = `mongodb://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}?${databaseConnectionOpts}`
const dbName = 'simple-node-app';


export async function updateHitCount() {
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = client.db(dbName);
    const hitsCollection = db.collection('hits');

    await hitsCollection.insert([{ time: Date.now() }])
    return await hitsCollection.count()
  } finally {
    client.close();
  }
}
