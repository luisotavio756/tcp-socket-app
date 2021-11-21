const net = require('net');

const actuatorId = Date.now();

const options = {
  host: 'localhost',
  port: 9000,
  localAddress: '127.0.0.4'
};

const payload = {
  module: 'resfriador',
  action: 'ligar'
};

const client = new net.Socket();

client.on('data', function(chunk) {
  console.log(`Data received from the server: ${chunk.toString()}.`);

  // Request an end to the connection after the data has been received.
  // client.end();
});

client.on('end', function() {
  console.log('Requested an end to the TCP connection');
});

client.connect(options, () => {
  console.log(`Actuator '${actuatorId}' connected to server successfully`);
  // Sensor faz sua identificação para o servidor
  client.write("HEAD / LCM/1.0\r\n");
  client.write(`Host: ${options.host}\r\n`);
  client.write(`User-Agent: Actuator Client - Resfriador\r\n`);
  client.write(`ActuatorId: ${actuatorId}`);


  setInterval(() => {
    client.write(Buffer.from(JSON.stringify(payload)))
  }, 2000)
});

