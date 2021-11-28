import net from 'net';
import { createISOMessage } from '../utils';
const actuatorId = Date.now();

const options: net.SocketConnectOpts = {
  host: 'localhost',
  port: 9000,
  localAddress: '127.0.0.5'
};

const client = new net.Socket();

client.on('end', () => {
  console.log('Requested an end to the TCP connection');
});

client.connect(options, () => {
  console.log(`Actuator '${actuatorId}' connected to server successfully`);
  // Sensor faz sua identificação para o servidor
  client.write("HEAD / LCM/1.0\r\n");
  client.write(`Host: ${options.host}\r\n`);
  client.write(`User-Agent: Actuator Client - Resfriador\r\n`);
  client.write(`ActuatorId: ${actuatorId}`);

  const payload = createISOMessage({
    emitter: 'Actuator-Resfriador',
    message: {
      action: 'LIGAR_RESFRIADOR',
      data: {}
    }
  });

  setInterval(()=>{
    client.write(Buffer.from(JSON.stringify(payload)));
  }, 1500);
});

