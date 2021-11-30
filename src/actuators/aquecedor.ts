import net from 'net';
import { createISOMessage } from '../utils';

// Cria um identificador único para o atuador.
const actuatorId = Date.now();

// Opções de conexão.
const options: net.SocketConnectOpts = {
  host: 'localhost',
  port: 9000,
  localAddress: '127.0.0.4'
};

// Cria o socket.
const client = new net.Socket();

// Define o fim da conexão.
client.on('end', function() {
  console.log('Requested an end to the TCP connection');
});

// Informa que se conectou ao servidor e se identifica.
client.connect(options, () => {
  console.log(`Actuator '${actuatorId}' connected to server successfully`);
  client.write("HEAD / LCM/1.0\r\n");
  client.write(`Host: ${options.host}\r\n`);
  client.write(`User-Agent: Actuator Client - Aquecedor\r\n`);
  client.write(`ActuatorId: ${actuatorId}`);

  // Manda uma action para o server, que posteriormente manda para o sensor, para ligar o aquecedor.
  const payload = createISOMessage({
    emitter: 'Actuator-Aquecedor',
    message: {
      action: 'LIGAR_AQUECEDOR',
      data: {}
    }
  });

  setInterval(()=>{
    client.write(Buffer.from(JSON.stringify(payload)));
  }, 1000);
});

