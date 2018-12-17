'use strict';

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const { updateHitCount } = require('./db')

// Constants
const PORT = 3000;


// App
const app = express();

app.get('/', async (req, res) => {
  try {

    const count = await updateHitCount()

    const html = `
      <body>
        Hello ${process.env.END_COMPANY || 'guest'}, (hitcount: ${count})<br>
        Subscription type: ${process.env.SUBSCRIPTION}<br>
        Months: ${process.env.MONTHS}
      </body>
    `
    res.send(html);
  } catch (err) {
    res.send(`Error!\n\n${err.toString()}`);    
  }
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
