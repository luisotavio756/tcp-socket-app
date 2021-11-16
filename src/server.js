const net = require('net');

const server = net.createServer();

let statusInterval = null;
let details = {
  temperaturaDoAr: 0,
  umidade: 0,
  oxigenacao: 0,
  batimentos: 0,
}

function clearStatusInterval() {
  statusInterval && clearInterval(statusInterval);
}

function setStatusInterval(socket) {
  if (statusInterval) {
    clearInterval(statusInterval);
  }

  statusInterval = setInterval(() => {
    // TODO: Está passando como JSON stringify aqui, mas precisa ser
    // um buffer. Deem uma olhada como passar aqui e receber no client
    socket.write(JSON.stringify(details));
  }, 1000);
}

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log('New client is connected %s', remoteAddress);

  socket.on('data', (data) => {
    const parsedData = JSON.parse(data);

    if (parsedData?.action === 'aquecer') {
      details = {
        ...details,
        temperaturaDoAr: details.temperaturaDoAr + 1
      };
    } else if (parsedData?.action === 'umidificar') {
      details = {
        ...details,
        umidade: details.umidade + 1
      };
    } else if (parsedData?.action === 'circularAr') {
      details = {
        ...details,
        oxigenacao: details.oxigenacao + 1
      };
    } else {
      console.log('Action not recognized..');
    }

    socket.write(JSON.stringify(details));
    setStatusInterval(socket);
  });

  socket.once('close', () => {
    console.log('Connecting from %s closed', remoteAddress);
  });

  socket.on('error', (err) => {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });

  if (!statusInterval) {
    setStatusInterval(socket)
  }
});

server.on('close', () => {
  clearStatusInterval();
});

server.listen(9000, () => {
  console.log("Server started on port 9000");
});
