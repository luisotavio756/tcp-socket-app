Projeto Estufa Inteligente
Equipe:
  Cristiano Rodrigues
  Luis Otávio
  Mateus Fonseca

* COMO EXECUTAR O PROJETO
1 - Caso tenha o node, npm e o yarn instalado, basta executar os comandos abaixos
- yarn server
- yarn sensor-co2
- yarn sensor-temperatura
- yarn sensor-umidade
- yarn actuator-irrigacao
- yarn actuator-injetor
- yarn actuator-aquecedor
- yarn actuator-resfriador
- yarn client

* COMO EXECUTAR O PROJETO COM DOCKER
1 - Executar o comando "docker-compose -f docker-compose.yml up -d --build"
2 - docker exec -it gerenciador bash (aqui é para entrar no container do gerenciador e rodar o comando do client)
3 - Quando estiver dentro do container, basta rodar o comando yarn client e aproveitar a estufa inteligente.
