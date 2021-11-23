import net from 'net';
import readlineSync from 'readline-sync';

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
  const readLine = readlineSync
    .question('\n\nHow do you want do?\n\n(\n\t1 - Aquecer\n\t2 - Injetar CO2\n\t3 - Irrigar\n\t4 - Resfriar\n\t5 - Fechar conexão\n)\n');

  switch (readLine) {
    case "1":
      //TODO: disparar action para ligar actuator para aquecer
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
  }
}

client.on('end', function() {
  console.log('Requested an end to the TCP connection');
});

client.connect(options, () => {
  console.log('TCP connection established with the server.');
});

showMenu({ milliseconds: 500 });

