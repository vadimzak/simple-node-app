'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET || 'secret'
const endCompany = process.env.END_COMPANY || 'guest'

// Constants
const PORT = 3001;

// App
const app = express();
app.get('/', (req, res) => {
  const token = req.query.token

  const jwtObj = jwt.verify(token, secret, { algorithm: 'HS256' })

  res.send(`Hello ${endCompany}!\n\n${JSON.stringify(jwtObj, null, 4)}`);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

