const net = require('net');
const readlineSync = require('readline-sync');

const options = {
  host: 'localhost',
  port: 9000,
};

const client = new net.Socket();

function disconnect() {
  client.destroy();
}

function menu() {
  const readLine = readlineSync
    .question('\n\nHow do you want do?\n\n(\n\t1 - Aquecer\n\t2 - Umidificar\n\t3 - Circular Ar\n\t4 - Fechar conexão\n)\n');

  switch (readLine) {
    case "1":
      client.write(JSON.stringify({
        action: 'aquecer'
      }));

      break;
    case "2":
      client.write(JSON.stringify({
        action: 'umidificar'
      }));

      break;
    case "3":
      client.write(JSON.stringify({
        action: 'circularAr'
      }));

      break;
    case "4":
      disconnect();
      break;
    default:
      console.log("\nAction not recognized, please, enter again.");
      menu();
      break;
  }
}
// Essa parte deve ser implementada em um outro client, que rodará em um processo
// separado apenas para mostrar essas informações, e esse client aqui somente para
// realizar as ações
client.on('data', function(chunk) {
  console.log(`Data received from the server: ${chunk.toString()}.`);

  // Request an end to the connection after the data has been received.
  // client.end();
});

client.on('end', function() {
  console.log('Requested an end to the TCP connection');
});

client.connect(options, () => {
  console.log('TCP connection established with the server.');
});

setTimeout(() => {
  menu();
}, 500)

