const net = require("net");
//identificador único do sensor
const sensorId = Date.now();

const options = {
  host: "localhost",
  port: 9000,
  localAddress: "127.0.0.2"
}

let details = {
  sensorId: sensorId,
  nivelCO2: 0,
  sensorName: "co2"
};

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
  // Sensor faz sua identificação para o servidor
  client.write("HEAD / LCM/1.0\r\n");
  client.write(`Host: ${options.host}\r\n`);
  client.write(`User-Agent: Sensor Client - Nível de CO2\r\n`);
  client.write(`SensorId: ${details.sensorId}`);

  // inicializa o envio de mensagens para o servidor a cada 1 segundo
  setStatusInterval(client);
})

/**
 * @param injectorStatus é do tipo boolean, possíveis valores true ou false
 */
client.on("data", (injectorStatus)=>{
  if(injectorStatus === "injetor"){ // se o injetor tiver ligado, o sensor vai aumentar os valores do nivel de CO2
    details = {
      ...details,
      nivelCO2: details.nivelCO2 + 1
    }
  }
})

client.on("close", () => {
  disconnect();
  clearStatusInterval();
});
