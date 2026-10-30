<p align="center">
  <img src="../assets/readme/banners/rabbitmq.png" alt="RabbitMQ" width="100%">
</p>

# Deploy

O [`Dockerfile`](https://github.com/Solierrr/infra-broker/blob/main/Dockerfile) cria uma imagem a partir de `rabbitmq:4.3.7-management-alpine` e copia a configuração do broker. O [workflow de publicação](https://github.com/Solierrr/infra-broker/blob/main/.github/workflows/release.yml) chama o workflow compartilhado de imagens após push na `main`. O processo comum de release está em [RELEASE_AND_DEPLOY.md](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RELEASE_AND_DEPLOY.md).

## Ambientes

| Ambiente | Onde | Endereço |
|---|---|---|
| Local | Docker Compose | STOMP em `localhost:61614` e painel em [`localhost:15672`](http://localhost:15672) |
| QA e produção | não confirmado no repositório | nenhum endereço confirmado <!-- PENDENTE: 1 --> |

## Particularidades

O contêiner expõe `61613` para STOMP e `15672` para administração. O arquivo `rabbitmq.conf` abre também `5672` para AMQP. O repositório não contém manifestos de deploy, endereço público ou configuração de credenciais de QA e produção. <!-- PENDENTE: 1 -->

O ambiente local injeta `RABBITMQ_USER` e `RABBITMQ_PASSWORD` no contêiner. A imagem de produção contém apenas a configuração de portas e plugins. A forma de injetar credenciais e preservar os dados fora do ambiente local depende da implantação escolhida. <!-- PENDENTE: 1 -->
