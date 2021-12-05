# PROJETO ESTUFA INTELIGENTE

## EQUIPE:
  CRISTIANO RODRIGUES DE LIMA - 473855 <br>
  FRANCISCO ANDRE DA SILVA FREIRE - 470997 <br>
  LUIS OTAVIO LIMA CAMINHA - 470876 <br>
  MATEUS FONSECA LIMA - 471855 <br>

## COMO EXECUTAR O PROJETO:
 
### 1 - Caso tenha o node, npm e o yarn instalado, basta executar os comandos abaixo:
```bash
# yarn server ( starta os server )
# yarn sensor-temperatura ( starta o sensor de temperatura )
# yarn sensor-umidade ( starta o sensor de umidade )
# yarn sensor-co2 ( starta o sensor de CO² )
# yarn client ( para startar o client, definindo os parâmetros máximos e mínimos dos sensores)
# yarn actuator-aquecedor ( para aumentar a temperatura )
# yarn actuator-resfriador ( para diminuir a temperatura )
# yarn actuator-irrigacao ( para aumentar a umidade )
# yarn actuator-injetor ( para aumentar o nível de  CO² )
```

<hr>

### 2 - Caso queira executar o projeto com docker:

```bash
# docker-compose up -d gerenciador ( para iniciar o gerenciador )
# docker logs -f gerenciador ( para ver os logs do servidor )
# docker-compose up -d sensor-temperatura ( para iniciar o sensor de temperatura )
# docker-compose up -d sensor-umidade ( para iniciar o sensor de umidade)
# docker-compose up -d sensor-co2 ( para iniciar o sensor de CO² )
# docker run --rm -it --name client --network host cristiano23lima/trabalho-redes:latest yarn client ( para iniciar o client )
# docker-compose up -d atuador-aquecedor ( para iniciar o atuador de aquecedor )
# docker-compose up -d atuador-resfriador ( para iniciar o atuador de resfriador )
# docker-compose up -d atuador-irrigacao ( para iniciar o atuador de irrigação )
# docker-compose up -d atuador-injetor ( para iniciar o atuador de injetor )
```