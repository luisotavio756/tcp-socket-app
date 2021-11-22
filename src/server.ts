import ISensorDetails from './dtos/ISensorDetais';
import * as net from 'net';
import { createISOMessage, isISOMessage, isJSON } from './utils/index';
import IISOMessage from './dtos/ISOMessage';

const server = net.createServer({ allowHalfOpen: true });

let lastestSensorLogs: Array<{
  sensorId: number;
  sensorName: string;
  remoteAddress: string | undefined;
  message: string;
  socket: net.Socket;
}> = [];

function addSensor(socket: net.Socket, data: ISensorDetails): void {
  const newSensor = {
    sensorId: data.sensorId,
    sensorName: data.sensorName,
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
    .find(sensor => sensor.sensorName.toLocaleLowerCase() === sensorName);
}

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log('New client is connected %s', remoteAddress);

  socket.on('data', (data: Buffer) => {
    const serializedData = data.toString();
    //caso a mensagem seja um JSON, ele irá realizar as devidas ações
    if (isJSON(serializedData)){
      const parsedData: IISOMessage = JSON.parse(serializedData);
      const action = parsedData.message.action;

      switch (action) {
        case 'SENSOR_DETAILS': {
          const sensorDetail: ISensorDetails = parsedData.message.data as ISensorDetails;

          addSensor(socket, sensorDetail);
          console.log(sensorDetail);

          break;
        }
        case 'LIGAR_AQUECEDOR': {
          const socketSensorTemperatura = findBySensorName('temperatura');

          const payload = createISOMessage({
            emitter: 'Server',
            message: {
              action: 'LIGAR',
              data: {}
            }
          });

          socketSensorTemperatura?.socket.write(Buffer.from(JSON.stringify(payload)));

          break;
        }
        case 'LIGAR_INJETOR': {
          const socketSensorCO2 = findBySensorName('co2');

          const payload = createISOMessage({
            emitter: 'Server',
            message: {
              action: 'LIGAR',
              data: {}
            }
          });

          socketSensorCO2?.socket.write(Buffer.from(JSON.stringify(payload)));

          break;
        }
        case 'LIGAR_IRRIGACAO': {
          const socketSensorUmidade = findBySensorName('umidade');

          const payload = createISOMessage({
            emitter: 'Server',
            message: {
              action: 'LIGAR',
              data: {}
            }
          });

          socketSensorUmidade?.socket.write(Buffer.from(JSON.stringify(payload)));

          break;
        }
        default:
          console.log('Action not recognized!');
          break;
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
