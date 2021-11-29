import IISOMessage from './dtos/ISOMessage';
import net from 'net';
import readlineSync from 'readline-sync';
import { createISOMessage } from './utils';

interface IMenuParams {
  milliseconds: number;
}

const options: net.SocketConnectOpts = {
  host: 'localhost',
  port: 9000,
};

const client = new net.Socket();

function disconnect() {
  client.destroy();
}

function showMenu({
  milliseconds
}: IMenuParams) {
  setTimeout(() => {
    actionsMenu();
  }, milliseconds)
}

function menu_parametros() {

  let valueMinSensorTemperature: string | number = readlineSync
    .question('\n\nHow is the min value from the temperature sensor?\n');
    valueMinSensorTemperature = parseInt(valueMinSensorTemperature, 10);

  let valueMaxSensorTemperature: string | number = readlineSync
    .question('\n\nHow is the max value from the temperature sensor?\n');
    valueMaxSensorTemperature = parseInt(valueMaxSensorTemperature, 10);

  let valueMaxSensorHumidity: string | number = readlineSync
    .question('\n\nHow is the max value from the humidity sensor?\n');
    valueMaxSensorHumidity = parseInt(valueMaxSensorHumidity, 10);

  let valueMaxSensorCo2: string | number = readlineSync
    .question('\n\nHow is the max value from the CO2 sensor?\n');
    valueMaxSensorCo2 = parseInt(valueMaxSensorCo2, 10);

  const payload = createISOMessage({
    emitter: 'Client',
    message: {
      action: 'SENSOR_PARAMETERS',
      data: {
        valueMinSensorTemperature,
        valueMaxSensorTemperature,
        valueMaxSensorHumidity,
        valueMaxSensorCo2,
      }
    }
  });

  client.write(Buffer.from(JSON.stringify(payload)));

}

function actionsMenu() {

  const readLine = readlineSync
    .question('\n\nHow do you want do?\n\n(\n\t1 - LOG Temperatura\n\t2 - LOG Umidade\n\t3 - LOG CO2\n\t4 - Fechar conexão\n)\n');

  let payload;

  switch (readLine) {
    case "1":
      payload = createISOMessage({
        emitter: 'Client',
        message: {
          action: 'LOG_TEMPERATURA',
          data: {}
        }
      });

      client.write(Buffer.from(JSON.stringify(payload)));

      showMenu({ milliseconds: 2500 });

      break;
    case "2":
      payload = createISOMessage({
        emitter: 'Client',
        message: {
          action: 'LOG_UMIDADE',
          data: {}
        }
      });

      client.write(Buffer.from(JSON.stringify(payload)));

      showMenu({ milliseconds: 2500 });

      break;
    case "3":
      payload = createISOMessage({
        emitter: 'Client',
        message: {
          action: 'LOG_CO2',
          data: {}
        }
      });

      client.write(Buffer.from(JSON.stringify(payload)));

      showMenu({ milliseconds: 2500 });

      break;
    case "4":
      disconnect();

      break;
    default:
      console.log("\nAction not recognized, please, enter again.");
      showMenu({ milliseconds: 500 });

      break;
  }
}

client.on('end', function() {
  console.log('Requested an end to the TCP connection');
});

client.on('data', (data) => {
  const serializedData = data.toString();
  const parsedData: IISOMessage = JSON.parse(serializedData);

  if (parsedData.message.action === 'LOG') {
    console.log(parsedData.message.data);
  }
});

client.connect(options, () => {
  console.log('TCP connection established with the server.');

  const payload = createISOMessage({
    emitter: 'Client',
    message: {
      action: 'SOCKET_CLIENT',
      data: {}
    }
  });

  client.write(Buffer.from(JSON.stringify(payload)));

  menu_parametros();
  showMenu({ milliseconds: 500 });
});


