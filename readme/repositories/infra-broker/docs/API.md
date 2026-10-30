<p align="center">
  <img src="../assets/readme/banners/rabbitmq.png" alt="RabbitMQ" width="100%">
</p>

# Protocolo STOMP

Este repositório não expõe uma API HTTP da plataforma nem um contrato OpenAPI. O acesso usado pelo `api-messenger` é STOMP sobre TCP, configurado na porta `61613` do contêiner. O painel de administração usa HTTP em `15672`, mas não é uma API para clientes da plataforma.

## Autenticação e contrato

O relay do `api-messenger` conecta com `RABBITMQ_USER` e `RABBITMQ_PASSWORD`. O serviço configura o virtual host `/` e usa as mesmas credenciais para as conexões de cliente e de sistema. O contrato de destinos fica na [configuração WebSocket](https://github.com/Solierrr/api-messenger/blob/main/src/main/java/com/solaria/messenger/websocket/config/WebSocketConfig.java) e nas classes de destinos do serviço de conversas.

## Destinos

O relay encaminha os destinos com prefixo `/topic`. Os comandos dos clientes usam `/app` e são processados pelo `api-messenger`, antes da distribuição. Dentro dos tópicos, o serviço de conversas usa ponto como separador após `/topic`, conforme a configuração do relay.

## Falhas

Credenciais incorretas ou broker indisponível impedem a conexão STOMP do relay. O código deste repositório não define códigos de erro de negócio nem um fallback de transporte. O broker em memória é escolhido na configuração do `api-messenger`, antes de ligar o relay.

## Exemplo de configuração

Para o contêiner local publicado no host, o serviço de conversas usa os nomes de variáveis abaixo. Os valores das credenciais devem vir do arquivo local e não devem ser copiados para a documentação.

```text
RABBITMQ_RELAY_ENABLED=true
RABBITMQ_HOST=localhost
RABBITMQ_STOMP_PORT=61614
RABBITMQ_USER=<usuario-local>
RABBITMQ_PASSWORD=<senha-local>
```
