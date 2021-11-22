import net from 'net';
import { createISOMessage } from '../utils';

const actuatorId = Date.now();

const options: net.SocketConnectOpts = {
  host: 'localhost',
  port: 9000,
  localAddress: '127.0.0.4'
};

const client = new net.Socket();

client.on('end', function() {
  console.log('Requested an end to the TCP connection');
});

client.connect(options, () => {
  console.log(`Actuator '${actuatorId}' connected to server successfully`);
  // Sensor faz sua identificação para o servidor
  client.write("HEAD / LCM/1.0\r\n");
  client.write(`Host: ${options.host}\r\n`);
  client.write(`User-Agent: Actuator Client - Irrigação\r\n`);
  client.write(`ActuatorId: ${actuatorId}`);

  const payload = createISOMessage({
    emitter: 'Actuator-Irrigação',
    message: {
      action: 'LIGAR_IRRIGACAO',
      data: {}
    }
  });

  client.write(Buffer.from(JSON.stringify(payload)));
});

