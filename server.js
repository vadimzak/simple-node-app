'use strict';

const express = require('express');
// const jwt = require('jsonwebtoken');

// const jwtSecret = process.env.JWT_SECRET
const endCompany = process.env.END_COMPANY || 'guest'


// Constants
const PORT = 3000;

const html = `<body style="background-color: ${process.env.BACKGROUND_COLOR}; color: ${process.env.TEXT_COLOR}">
Hello ${endCompany},<br>
<ol>
${Array(Number(process.env.BULLETS)).keys().map(i) => `<li>${process.env.MOTO}</li>`}
</ol>
</body>
`

// App
const app = express();
app.get('/', (req, res) => {
  try {
    // const token = req.query.token
    // const jwtObj = jwt.verify(token, jwtSecret, { algorithm: 'HS256' })
    res.send(html);
  } catch (err) {
    res.send(`Error!\n\n${err.toString()}`);    
  }
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

