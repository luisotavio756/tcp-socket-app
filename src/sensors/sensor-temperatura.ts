import ISensorDetails from '../dtos/ISensorDetais';
import net from 'net';
import { createISOMessage } from '../utils';
import IISOMessage from '../dtos/ISOMessage';

const sensorId = Date.now();
let sensorOpen = false;

const options: net.SocketConnectOpts = {
  host: "localhost",
  port: 9000,
  localAddress: "127.0.0.2"
}

let details: ISensorDetails = {
  sensorId: sensorId,
  sensorName: 'temperatura',
  temperatura: 30,
};

const client = new net.Socket();

let statusInterval: NodeJS.Timer | null = null;

function disconnect() {
  console.debug("Successfully disconnected from server!");
  client.destroy();
}

function incrementValue() {
  details = {
    ...details,
    temperatura: details.temperatura + 1
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
    sensorOpen && incrementValue();

    const payload = createISOMessage({
      emitter: 'Sensor-Temperatura',
      message: {
        action: 'SENSOR_DETAILS',
        data: details
      }
    });

    const buffer = Buffer.from(JSON.stringify(payload));

    socket.write(buffer);
  }, 1000);
}

// o sensor se conecta ao gerenciador
client.connect(options, () => {
  console.log(`Sensor '${details.sensorId}' connected to server successfully`);
  // Sensor faz sua identificação para o servidor
  client.write("HEAD / LCM/1.0\r\n");
  client.write(`Host: ${options.host}\r\n`);
  client.write(`User-Agent: Sensor Client - Temperatura Interna\r\n`);
  client.write(`SensorId: ${details.sensorId}`);

  // inicializa o envio de mensagens para o servidor a cada 1 segundo
  setStatusInterval(client);
})


client.on('data', (data) => {
  const serializedData = data.toString();
  const parsedData: IISOMessage = JSON.parse(serializedData);

  if (parsedData.message.action === 'LIGAR') {
    sensorOpen = true;
  }
});

client.on("close", () => {
  disconnect();
  clearStatusInterval();
});