'use strict'

const wstcpServer = require('./lib/server.js');

let server = wstcpServer({
  port: 8000,
  tcpPort: 10000,
  remote: true
});

let temperaturaDoAr = 0;
let umidade = 0;
let oxigenacao = 0;
let batimentos = 0;

let statusInterval = setInterval(() => {
  emitStatus();
}, 1000);

function emitStatus() {
  const details = {
    temperaturaDoAr,
    umidade,
    oxigenacao,
    batimentos
  };

  server.emit('status', details);
}

function clearStatusInterval() {
  clearInterval(statusInterval);
}

server.on('connection', (t) => console.log('Server: New client connected!'));

server.on('aquecer', () => {
  temperaturaDoAr += 1;

  emitStatus();
  clearStatusInterval();
});
server.on('umidificar', () => {
  umidade += 1;

  emitStatus();
  clearStatusInterval();
});
server.on('circularAr', () => {
  temperaturaDoAr -= 1;

  emitStatus();
  clearStatusInterval();
});

server.on('error', err => {
  console.error(`server: error: ${err.message}`);

  clearStatusInterval();
});
