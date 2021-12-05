# PROJETO ESTUFA INTELIGENTE

## EQUIPE:
  Cristiano Rodrigues
  Luis Otávio
  Mateus Fonseca
  Francisco André

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
# docker-compose -f docker-compose.yml up -d --build ( na pasta do projeto )
# docker exec -it gerenciador bash ( aqui é para entrar no container do gerenciador e rodar o comando do client )
# yarn client ( para startar o client, definindo os parâmetros máximos e mínimos dos sensores)
# docker start atuador-aquecedor ( para aumentar a temperatura )
# docker start atuador-resfriador ( para diminuir a temperatura )
# docker start atuador-irrigacao ( para aumentar a umidade )
# docker start atuador-injetor ( para aumentar o nível de  CO² )
```