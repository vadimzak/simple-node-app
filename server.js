'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET || 'secret'
const endCompany = process.env.END_COMPANY || 'guest'

// Constants
const PORT = 3000;

// App
const app = express();
app.get('/', (req, res) => {
  try {
    const token = req.query.token

    const jwtObj = jwt.verify(token, secret, { algorithm: 'HS256' })

    res.send(`Hello ${endCompany}!\n\n${JSON.parse(jwtObj, null, 4)}`);
  } catch (err) {
    res.send(`Error!\n\n${err.toString()}`);
  }
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

