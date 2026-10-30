<p align="center">
  <img src="../assets/readme/banners/rabbitmq.png" alt="RabbitMQ" width="100%">
</p>

# Visão de produto

O broker distribui eventos das conversas em tempo real. Ele atende o serviço de mensagens da plataforma e permite que uma conversa continue atualizando as sessões conectadas em instâncias diferentes desse serviço.

## O que permite

- Uma mensagem publicada pelo serviço de conversas chega às sessões inscritas no mesmo assunto.
- As instâncias do serviço de conversas compartilham a distribuição dos eventos quando o relay externo está ligado.
- A equipe consulta o painel de administração do broker para diagnosticar conexões e mensagens.

## Regras observadas

O serviço de conversas decide quem pode conectar e receber cada mensagem. O broker recebe a conexão desse serviço e distribui os eventos. Se o relay externo não estiver configurado, o serviço de conversas usa uma distribuição em memória, restrita à própria instância.

Não há interface do broker para a pessoa usuária. Ela percebe o resultado nas conversas do aplicativo. A entrega das mensagens está descrita no [fluxo deste repositório](../flows/MESSAGE_DELIVERY.md).
