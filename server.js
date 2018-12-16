'use strict';

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

var database = require('./config/database');                      // load the database config


// Constants
const PORT = 3000;

const databaseHost = process.env.DATABASE_HOST.trim();
const databasePort = process.env.DATABASE_PORT.trim();
const databaseUser = process.env.DATABASE_USER.trim();
const databasePassword = process.env.DATABASE_PASSWORD.trim();
const databaseName = process.env.DATABASE_NAME.trim();
const databaseConnectionOpts = process.env.DATABASE_CONNECTION_OPTIONS.trim();

const dbUrl: `mongodb://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}?${databaseConnectionOpts}`
const dbName = 'simple-node-app';

async function updateHitCount() {
  const client = await MongoClient.connect(url)
  try {
    const db = client.db(dbName);
    const hitsCollection = db.collection('hits');

    await hitsCollection.insert([{ time: Date.now() }])
    return await hitsCollection.count()
  } finally {
    client.close();
  }
}


// App
const app = express();
app.get('/', async (req, res) => {
  try {

    let count = null

    const client = await MongoClient.connect(url)
    try {
      const db = client.db(dbName);
      const hitsCollection = db.collection('hits');

      await hitsCollection.insert([{ time: Date.now() }])
      count = await hitsCollection.count()
    } finally {
      client.close();    
    }

    const html = `
      <body style="background-color: ${process.env.BACKGROUND_COLOR}; color: ${process.env.TEXT_COLOR}">
        Hello ${process.env.END_COMPANY || 'guest'}, (hitcount: ${count})<br>
        <ol>
          ${[...Array(Number(process.env.BULLETS)).keys()].map(i => `<li>${process.env.MOTO}</li>`).join('')}
        </ol >
      </body >
    `
    res.send(html);
  } catch (err) {
    res.send(`Error!\n\n${err.toString()}`);    
  }
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
