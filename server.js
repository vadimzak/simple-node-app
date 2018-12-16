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
