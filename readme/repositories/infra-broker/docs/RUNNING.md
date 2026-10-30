<p align="center">
  <img src="../assets/readme/banners/rabbitmq.png" alt="RabbitMQ" width="100%">
</p>

# Executando localmente

Este repositório usa Docker Compose diretamente. Não há `Makefile` nem testes automatizados próprios. O ambiente está definido em [`local/docker-compose.yml`](https://github.com/Solierrr/infra-broker/blob/main/local/docker-compose.yml).

## Pré-requisitos

- Docker com o plugin Compose.
- Portas locais `5672`, `61614` e `15672` disponíveis.
- Credenciais locais do RabbitMQ em `local/.env`, obtidas a partir de [`local/.env.example`](https://github.com/Solierrr/infra-broker/blob/main/local/.env.example). Use uma senha própria, sem registrar o valor na documentação.

## Iniciar e verificar

Execute a partir da raiz do repositório de origem:

```bash
cp local/.env.example local/.env
docker compose --env-file local/.env -f local/docker-compose.yml up -d
docker compose --env-file local/.env -f local/docker-compose.yml ps
```

O painel local fica em [http://localhost:15672](http://localhost:15672). A porta STOMP do contêiner é `61613`, publicada no host como `61614`. Para apontar um `api-messenger` iniciado fora do Compose para esse broker, use `RABBITMQ_HOST=localhost`, `RABBITMQ_STOMP_PORT=61614` e as mesmas credenciais locais. A configuração do consumidor está em [`application.properties`](https://github.com/Solierrr/api-messenger/blob/main/src/main/resources/application.properties).

Para parar sem apagar o volume, execute:

```bash
docker compose --env-file local/.env -f local/docker-compose.yml down
```

## Problemas conhecidos

Se o serviço de conversas tentar `61613` no host, a conexão local falha porque o Compose publica STOMP em `61614`. Se `RABBITMQ_HOST` não estiver definido, o serviço de conversas pode usar o broker em memória e o RabbitMQ local não receberá eventos.
