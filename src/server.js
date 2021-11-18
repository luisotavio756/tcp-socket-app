const net = require('net');

const server = net.createServer({ allowHalfOpen: true });

let statusInterval = null;
let details = {
  temperaturaDoAr: 0,
  umidade: 0,
  oxigenacao: 0,
  batimentos: 0,
};

let lastestSensorLogs = [];// array do tipo {sensorID: number, message: string, remoteAddress: string}

function clearStatusInterval() {
  statusInterval && clearInterval(statusInterval);
}

function addSensor(socket, data){
  const newSensor= {sensorId: data.sensorId, remoteAddress: socket.remoteAddress, message: JSON.stringify(data) };
  //remove o sensor caso ele exista
  lastestSensorLogs = lastestSensorLogs.filter(sensor => sensor.sensorId !== data.sensorId);
  // adicina o sensor novamente, só que com a ultima mensagem enviada.
  lastestSensorLogs.push(newSensor);
}

// verifica se é um JSON válido
function isJSON(text) {
  if (
    /^[\],:{}\s]*$/.test(
      text
        .replace(/\\["\\\/bfnrtu]/g, '@')
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          ']'
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
    )
  ) {
    return true;
  } else {
    return false;
  }
}

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log('New client is connected %s', remoteAddress);

  socket.on('data', (data) => {
    //caso a mensagem seja um JSON, ele irá realizar as devidas ações
    if(isJSON(data.toString())){
      const parsedData = JSON.parse(data.toString());

      addSensor(socket, parsedData);

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
        //mostrando mensagens dos sensores
        console.log(parsedData);
      }
    }else{
      console.log(data.toString());
    }
  });

  socket.once('close', () => {
    lastestSensorLogs = [];
    console.log('Connecting from %s closed', remoteAddress);
  });

  socket.on('error', (err) => {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
});

server.on('close', () => {
  clearStatusInterval();
});

server.listen(9000, () => {
  console.log("Server started on port 9000");
});
