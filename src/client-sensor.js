const net = require("net");
//identificador único do sensor
const sensorId = Date.now();

const options = {
  host: "localhost",
  port: 9000,
  sensorId: sensorId
}

let details = {sensorId: sensorId, temperatura: 30, umidade:1, nivelCO2: 3};

const client = new net.Socket();

let statusInterval = null;

function disconnect(){
  console.debug("Successfully disconnected from server!");
  client.destroy();
}

function clearStatusInterval(){
  statusInterval && clearInterval(statusInterval);
}

function setStatusInterval(socket) {
  if (statusInterval) {
    clearInterval(statusInterval);
  }

  statusInterval = setInterval(() => {
    const buffer = Buffer.from(JSON.stringify(details));
    socket.write(buffer);
  }, 1000);
}

client.on("data", function(chunk){
  console.log(JSON.parse(chunk));

  client.end();
})

// o sensor se conecta ao gerenciador
client.connect(options, () => {
  console.log(`Sensor '${options.sensorId}' connected to server successfully`);
  //Sensor faz sua identificação para o servidor
  client.write("HEAD / LCM/1.0\r\n");
  client.write(`Host: ${options.host}\r\n`);
  client.write(`User-Agent: Sensor Client ${details.sensorId}\r\n`);
  client.write(`SensorId: ${details.sensorId}`);

  // inicializa o envio de mensagens para o servidor a cada 1 segundo
  setStatusInterval(client);
})

client.on("close", ()=>{disconnect(); clearStatusInterval();})
