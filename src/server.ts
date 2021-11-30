import ISensorDetails from './dtos/ISensorDetais';
import * as net from 'net';
import { createISOMessage, isJSON } from './utils/index';
import IISOMessage from './dtos/ISOMessage';

const server = net.createServer({ allowHalfOpen: true });

let lastestSensorLogs: Array<{
  sensorId: number;
  sensorName: string;
  remoteAddress: string | undefined;
  message: string;
  socket: net.Socket;
}> = [];

let socketClient: null | net.Socket = null;

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
        case 'SOCKET_CLIENT': {
          socketClient = socket;

          break;
        }
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
              action: 'LIGAR_AQUECEDOR',
              data: {}
            }
          });

          socketSensorTemperatura?.socket.write(Buffer.from(JSON.stringify(payload)));

          break;
        }
        case 'LIGAR_RESFRIADOR': {
          const socketSensorTemperatura = findBySensorName('temperatura');

          const payload = createISOMessage({
            emitter: 'Server',
            message: {
              action: 'LIGAR_RESFRIADOR',
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
        case 'SENSOR_PARAMETERS': {
          const {
            valueMinSensorTemperature,
            valueMaxSensorTemperature,
            valueMaxSensorHumidity,
            valueMaxSensorCo2,
          } = parsedData.message.data as ISensorDetails;

          let payload;

          // Seta o valor mínimo e máximo para o sensor de temperatura.
          const socketSensorTemperature = findBySensorName('temperatura');

          payload = createISOMessage({
            emitter: 'Server',
            message: {
              action: 'SET_PARAMETERS_VALUES',
              data: {
                valueMinSensorTemperature,
                valueMaxSensorTemperature,
              }
            }
          });

          socketSensorTemperature?.socket.write(Buffer.from(JSON.stringify(payload)));

          // Seta o valor máximo para o sensor de umidade.
          const socketSensorHumidity = findBySensorName('umidade');

          payload = createISOMessage({
            emitter: 'Server',
            message: {
              action: 'SET_PARAMETERS_VALUES',
              data: {
                valueMaxSensorHumidity,
              }
            }
          });

          socketSensorHumidity?.socket.write(Buffer.from(JSON.stringify(payload)));

          // Seta o valor máximo para o sensor de CO2.
          const socketSensorCO2 = findBySensorName('co2');

          payload = createISOMessage({
            emitter: 'Server',
            message: {
              action: 'SET_PARAMETERS_VALUES',
              data: {
                valueMaxSensorCo2,
              }
            }
          });

          socketSensorCO2?.socket.write(Buffer.from(JSON.stringify(payload)));

          break;
        }
        case 'ALERT_SENSOR_TEMPERATURE_MAX_VALUE': {
          const sensorDetail: ISensorDetails = parsedData.message.data as ISensorDetails;

          addSensor(socket, sensorDetail);

          console.log(sensorDetail);

          console.log(`The ${sensorDetail.sensorName}-${sensorDetail.sensorId} sensor is smaller than the limit\nActual value: ${sensorDetail.temperatura}`);

          break;
        }
        case 'ALERT_SENSOR_TEMPERATURE_MIN_VALUE': {
          const sensorDetail: ISensorDetails = parsedData.message.data as ISensorDetails;

          addSensor(socket, sensorDetail);

          console.log(sensorDetail);

          console.log(`The ${sensorDetail.sensorName}-${sensorDetail.sensorId} sensor is smaller than the limit\nActual value: ${sensorDetail.temperatura}`);

          break;
        }
        case 'ALERT_SENSOR_HUMIDITY_MAX_VALUE': {
          const sensorDetail: ISensorDetails = parsedData.message.data as ISensorDetails;

          addSensor(socket, sensorDetail);

          console.log(sensorDetail);

          console.log(`The ${sensorDetail.sensorName}-${sensorDetail.sensorId} sensor is bigger than the limit\nActual value: ${sensorDetail.umidade}`);

          break;
        }
        case 'ALERT_SENSOR_CO2_MAX_VALUE': {
          const sensorDetail: ISensorDetails = parsedData.message.data as ISensorDetails;

          addSensor(socket, sensorDetail);

          console.log(sensorDetail);

          console.log(`The ${sensorDetail.sensorName}-${sensorDetail.sensorId} sensor is bigger than the limit\nActual value: ${sensorDetail.nivelCO2}`);

          break;
        }
        case 'LOG_TEMPERATURA': {
          const latestLogSensor = findBySensorName('temperatura');

          const payload = createISOMessage({
            emitter: 'Server',
            message: {
              action: 'LOG',
              data: latestLogSensor?.message ?
                JSON.parse(latestLogSensor?.message) :
                {
                  info: 'You need start the sensor Temperatura to get its logs'
                }
            }
          });

          socketClient?.write(Buffer.from(JSON.stringify(payload)));

          break;
        }
        case 'LOG_UMIDADE': {
          const latestLogSensor = findBySensorName('umidade');

          const payload = createISOMessage({
            emitter: 'Server',
            message: {
              action: 'LOG',
              data: latestLogSensor?.message ?
                JSON.parse(latestLogSensor?.message) :
                {
                  info: 'You need start the sensor Umidade to get its logs'
                }
            }
          });

          socketClient?.write(Buffer.from(JSON.stringify(payload)));

          break;
        }
        case 'LOG_CO2': {
          const latestLogSensor = findBySensorName('co2');

          const payload = createISOMessage({
            emitter: 'Server',
            message: {
              action: 'LOG',
              data: latestLogSensor?.message ?
                JSON.parse(latestLogSensor?.message) :
                {
                  info: 'You need start the sensor CO² to get its logs'
                }
            }
          });

          socketClient?.write(Buffer.from(JSON.stringify(payload)));

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
