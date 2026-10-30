<p align="center">
  <img src="../assets/readme/banners/rabbitmq.png" alt="RabbitMQ" width="100%">
</p>

# Situação

Levantamento do código da `main` em 2026-10-30. A configuração existente de RabbitMQ substitui a descrição de molde ainda presente no checklist de documentação. <!-- PENDENTE: 3 -->

## Configurado

- A imagem fixa RabbitMQ 4.3.7 e habilita os plugins STOMP e de administração (2026-10-30).
- O Compose local publica STOMP, AMQP e o painel, usa um volume e verifica o processo com `rabbitmq-diagnostics` (2026-10-30).
- O `api-messenger` contém a configuração do relay STOMP e usa o broker em memória quando o relay está desligado (2026-10-30).
- O repositório contém workflows de release e de publicação da imagem (2026-10-30).

## Não confirmado

- O código não mostra onde a imagem roda em QA ou produção, nem o endereço e o armazenamento desses ambientes (2026-10-30). <!-- PENDENTE: 1 -->
- Não há políticas ou definições versionadas de filas, exchanges e retenção neste repositório (2026-10-30). <!-- PENDENTE: 2 -->
