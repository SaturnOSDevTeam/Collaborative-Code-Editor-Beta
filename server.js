const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

let sharedContent = '';

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.send(JSON.stringify({ type: 'content', content: sharedContent }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'contentChange') {
      sharedContent = data.content;

      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'contentChange', content: sharedContent }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
