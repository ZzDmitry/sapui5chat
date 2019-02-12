/* eslint-disable no-console */
const express = require('express');


const app = express();

function sendClientFile(res, filename) {
  res.sendFile(
    filename,
    {
      root: '../client/',
    },
  );
}

app.get('/script.js', (req, res) => {
  console.log('get script.js');
  sendClientFile(res, 'script.js');
});

app.get('/chat.html', (req, res) => {
  console.log('get chat.html');
  sendClientFile(res, 'chat.html');
});

app.listen(8001, () => {
  console.log('Express server is listening on 8001');
});
