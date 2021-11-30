import net from 'net';
import { createISOMessage } from '../utils';
import ISensorDetails from '../dtos/ISensorDetais';
import IISOMessage from '../dtos/ISOMessage';

const sensorId = Date.now();

let maxValue: null | number = null;

const options: net.SocketConnectOpts = {
  host: "localhost",
  port: 9000,
  localAddress: "127.0.0.2"
}

let details: ISensorDetails = {
  sensorId: sensorId,
  sensorName: "umidade",
  umidade: 1,
};

const client = new net.Socket();

let statusInterval: NodeJS.Timer | null = null;

function disconnect(){
  console.debug("Successfully disconnected from server!");
  client.destroy();
}

function incrementValue() {
  details = {
    ...details,
    umidade: details.umidade + 1
  }
}

function clearStatusInterval(){
  statusInterval && clearInterval(statusInterval);
}

function setStatusInterval(socket: net.Socket) {
  if (statusInterval) {
    clearInterval(statusInterval);
  }

  statusInterval = setInterval(() => {
    if (maxValue && (details.umidade >= maxValue)) {
      const payload = createISOMessage({
        emitter: 'Sensor-Umidade',
        message: {
          action: 'ALERT_SENSOR_HUMIDITY_MAX_VALUE',
          data: details
        }
      });

      const buffer = Buffer.from(JSON.stringify(payload));

      socket.write(buffer);

      clearStatusInterval();
    } else {
      const payload = createISOMessage({
        emitter: 'Sensor-Umidade',
        message: {
          action: 'SENSOR_DETAILS',
          data: details
        }
      });

      const buffer = Buffer.from(JSON.stringify(payload));

      socket.write(buffer);
    }

  }, 1000);
}

// o sensor se conecta ao gerenciador
client.connect(options, () => {
  console.log(`Sensor '${details.sensorId}' connected to server successfully`);
  //Sensor faz sua identificação para o servidor
  client.write("HEAD / LCM/1.0\r\n");
  client.write(`Host: ${options.host}\r\n`);
  client.write(`User-Agent: Sensor Client - Umidade do Solo\r\n`);
  client.write(`SensorId: ${details.sensorId}`);

  // inicializa o envio de mensagens para o servidor a cada 1 segundo
  setStatusInterval(client);
})


client.on("data", (data: Buffer)=>{
  const serializedData = data.toString();
  const parsedData: IISOMessage = JSON.parse(serializedData);

  if (parsedData.message.action === 'LIGAR') {
    incrementValue();

    !statusInterval && setStatusInterval(client);
  } else if (parsedData.message.action === 'SET_PARAMETERS_VALUES') {
    const {
      valueMaxSensorHumidity
    } = parsedData.message.data as ISensorDetails;

    maxValue = valueMaxSensorHumidity;
  }
})

client.on("close", () => {
  disconnect();
  clearStatusInterval();
});
