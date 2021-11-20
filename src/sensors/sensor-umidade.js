const net = require("net");
//identificador único do sensor
const sensorId = Date.now();

const options = {
  host: "localhost",
  port: 9000,
  localAddress: "127.0.0.2"
}

let details = {sensorId: sensorId, umidade:1, sensorName: "umidade"};

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

// o sensor se conecta ao gerenciador
client.connect(options, () => {
  console.log(`Sensor '${details.sensorId}' connected to server successfully`);
  //Sensor faz sua identificação para o servidor
  client.write("HEAD / LCM/1.0\r\n");
  client.write(`Host: ${options.host}\r\n`);
  client.write(`User-Agent: Sensor Client - Umidade do Solo\r\n`);
  client.write(`SensorId: ${details.sensorId}`);

  // inicializa o envio de mensagens para o servidor a cada 1 segundo
  setStatusInterval(client);
})


/**
 * @param irrigationStatus é do tipo boolean, possíveis valores true ou false
 */
client.on("data", (irrigationStatus)=>{
  if(irrigationStatus === "irrigacao"){ // se o sistema de irrigação tiver ligado, o sensor vai aumentar os valores da umidade
    details = {
      ...details,
      umidade: details.umidade + 1
    }
  }
})

client.on("close", ()=>{disconnect(); clearStatusInterval();})
