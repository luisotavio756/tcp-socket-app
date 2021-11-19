const net = require('net');
const { isJSON } = require('./utils');

const server = net.createServer({ allowHalfOpen: true });

let lastestSensorLogs = [];// array do tipo {sensorID: number, message: string}

function addSensor(socket, data){
  const newSensor = {
    sensorId: data.sensorId,
    remoteAddress: socket.remoteAddress,
    message: JSON.stringify(data),
    socket
  };

  //remove o sensor caso ele exista
  lastestSensorLogs = lastestSensorLogs.filter(sensor => sensor.sensorId !== data.sensorId);
  // adicina o sensor novamente, só que com a ultima mensagem enviada.
  lastestSensorLogs.push(newSensor);
}

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log('New client is connected %s', remoteAddress);

  socket.on('data', (data) => {
    //caso a mensagem seja um JSON, ele irá realizar as devidas ações
    if(isJSON(data.toString())){
      const parsedData = JSON.parse(data.toString());

      addSensor(socket, parsedData);

      console.log(parsedData);
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
  console.log('Server closed!');
});

server.listen(9000, () => {
  console.log("Server started on port 9000");
});
