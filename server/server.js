/* eslint-disable no-console */
const fs = require('fs');
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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/script.js', (req, res) => {
  console.log('get script.js');
  sendClientFile(res, 'script.js');
});

app.get('/chat.html', (req, res) => {
  console.log('get chat.html');
  sendClientFile(res, 'chat.html');
});

app.get('/example.html', (req, res) => {
  console.log('get chat.html');
  sendClientFile(res, 'example.html');
});

app.get('/chat-template.html', (req, res) => {
  console.log('get chat-template.html');
  fs.readFile('../client/chat.html', 'utf8', (err, text) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
      return;
    }
    function makeTemplateRe() {
      function makeTemplateTag(isBegin) {
        const templateTagText = 'CHAT-TEMPLATE';
        return `<!--\\s*${isBegin ? '' : '\\/'}${templateTagText}\\s*-->`;
      }
      return new RegExp(`${makeTemplateTag(true)}([\\s\\S]*)${makeTemplateTag(false)}`);
    }
    const templateMatch = text.match(makeTemplateRe());
    if (!templateMatch) {
      const errorText = 'Bad chat template';
      console.error(errorText);
      res.status(500).send(errorText);
      return;
    }
    res.send(templateMatch[1]);
  });
});

http.listen(8001, () => {
  console.log('Express server is listening on 8001');
});

const sentMessages = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('chat messages', sentMessages.slice(-10));
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ', msg);
    const { user, text } = msg;
    if (!user || !text) {
      return;
    }
    const sentMessage = {
      username: user.fullName,
      time: +new Date(),
      text,
    };
    io.emit('chat message', sentMessage);
    sentMessages.push(sentMessage);
  });
});
