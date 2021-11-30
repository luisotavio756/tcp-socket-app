import IISOMessage from './dtos/ISOMessage';
import net from 'net';
import readlineSync from 'readline-sync';
import { createISOMessage } from './utils';

// Parâmetros do menu, no caso: em quanto tempo ele vai aparecer novamente.
interface IMenuParams {
  milliseconds: number;
}

// Opções de conexão do socket.
const options: net.SocketConnectOpts = {
  host: 'localhost',
  port: 9000,
};

// Crio o socket.
const client = new net.Socket();

function disconnect() {
  client.destroy();
}

function showMenu({
  milliseconds
}: IMenuParams) {
  setTimeout(() => {
    // Fico chamando action menu a cada milliseconds passados por parâmetro.
    actionsMenu();
  }, milliseconds)
}

// ( Só aparece uma vez ) Função que recebe os parâmetros máximos e mínimos de cada sensor.
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

  // Mando uma action do client para o server, e o server irá tratar da atribuição de valores máximos e mínimos para os sensores.
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

// ( Aparece de acordo com o parâmetro de showMenu ) Responsável por mostrar as opções do LOG do sensores.
function actionsMenu() {

  const readLine = readlineSync
    .question('\n\nHow do you want do?\n\n(\n\t1 - LOG Temperatura\n\t2 - LOG Umidade\n\t3 - LOG CO2\n\t4 - Fechar conexão\n)\n');

  let payload;

  // Dependendo do número dígitado, buscarei no server o ultimo valor do sensor escolhido e retornarei pro client.
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

// Define o fim da conexão.
client.on('end', function() {
  console.log('Requested an end to the TCP connection');
});


// Receberá as actions do server aqui, caso a action seja LOG, irá imprimir o LOG ou mensagem de sensor desligado.
client.on('data', (data) => {
  const serializedData = data.toString();
  const parsedData: IISOMessage = JSON.parse(serializedData);

  if (parsedData.message.action === 'LOG') {
    console.log(parsedData.message.data);
  }
});

// Ao conectar, envia seu Socket para o server, para futuras conexões do server para client.
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

  // Chama os parâmetros apenas uma vez.
  menu_parametros();

  // Chama o menu de LOG diversas vezes.
  showMenu({ milliseconds: 500 });
});


