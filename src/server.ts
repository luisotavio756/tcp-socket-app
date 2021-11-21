import ISensorDetails from './dtos/ISensorDetais';
import * as net from 'net';
import { isJSON } from './utils/index';

const server = net.createServer({ allowHalfOpen: true });

let lastestSensorLogs: Array<{
  sensorId: number;
  remoteAddress: string | undefined;
  message: string;
  socket: net.Socket;
}> = [];// array do tipo {sensorID: number, message: string, name_sensor: string}

function addSensor(socket: net.Socket, data: ISensorDetails): void {
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

function findBySensorName(sensorName: string) {
  return lastestSensorLogs
    .find(sensor => JSON
      .parse(sensor.message).sensorName.toLocaleLowerCase().includes(sensorName)
    );
}

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log('New client is connected %s', remoteAddress);

  socket.on('data', (data: Buffer) => {
    const serializedData = data.toString();
    //caso a mensagem seja um JSON, ele irá realizar as devidas ações
    if (isJSON(serializedData)){
      const parsedData = JSON.parse(serializedData);

      if (!!parsedData && !!parsedData?.sensorId){
        addSensor(socket, parsedData);
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
  console.log('Server closed!');
});

server.listen(9000, () => {
  console.log("Server started on port 9000");
});
