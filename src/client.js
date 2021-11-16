const wstcpClient = require('./lib/client.js');

let client = wstcpClient({
  url: 'ws://localhost:8000',
  tcpPort: 22,
  remote: true
});

client.on('connection', () => console.log('Client: Your are connected!'))
client.on('close', () => console.log('Client: The TCP server is down!'))
client.on('error', err => {
  console.error(`client: error: ${err.message}`);
});