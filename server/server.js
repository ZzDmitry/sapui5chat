/* eslint-disable no-console */
const express = require('express');


const app = express();

app.get('/script.js', (req, res) => {
  console.log('get script.js');
  res.sendFile('script.js', { root: '../client/' });
});

app.get('/chat.html', (req, res) => {
  console.log('get chat.html');
  res.sendFile('chat.html', { root: '../client/' });
});

app.listen(8001, () => {
  console.log('Express server is listening on 8001');
});
