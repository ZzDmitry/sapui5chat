/* eslint-disable no-console */
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

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

http.listen(8001, () => {
  console.log('Express server is listening on 8001');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ', msg);
  });
});
