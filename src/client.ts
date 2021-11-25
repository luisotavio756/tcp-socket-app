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
    menu();
  }, milliseconds)
}

function menu() {
  
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

 /*  const readLine = readlineSync
    .question('\n\nHow do you want do?\n\n(\n\t1 - Ligar aquecedor Aquecedor\n\t2 - Injetar CO2\n\t3 - Irrigar\n\t4 - Resfriar\n\t5 - Fechar conexão\n)\n');

  switch (readLine) {
    case "1":
     const payload = createISOMessage({
        emitter: 'Actuator-Injetor',
        message: {
          action: 'LIGAR_INJETOR',
          data: {}
        }
      });

      client.write(Buffer.from(JSON.stringify(payload)));
      showMenu({ milliseconds: 2500 });

      break;
    case "2":
      //TODO: disparar action para ligar actuator para injetar CO2
      showMenu({ milliseconds: 2500 });

      break;
    case "3":
      //TODO: disparar action para ligar actuator para irrigar

      showMenu({ milliseconds: 2500 });
      break;
    case "4":
      //TODO: disparar action para ligar actuator para irrigar

      showMenu({ milliseconds: 2500 });
      break;
    case "5":
      disconnect();

      break;
    default:
      console.log("\nAction not recognized, please, enter again.");
      showMenu({ milliseconds: 500 });

      break;
  } */
}

client.on('end', function() {
  console.log('Requested an end to the TCP connection');
});

client.connect(options, () => {
  console.log('TCP connection established with the server.');
});

showMenu({ milliseconds: 500 });

