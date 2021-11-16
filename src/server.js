'use strict'

const wstcpServer = require('./lib/server.js');

let server = wstcpServer({
  port: 8000,
  tcpPort: 10000,
  remote: true
});

server.on('connection', (t) => console.log('Server: New client connected!'));
server.on('error', err => {
  console.error(`server: error: ${err.message}`);
});