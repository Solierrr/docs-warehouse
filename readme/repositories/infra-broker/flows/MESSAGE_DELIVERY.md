<p align="center">
  <img src="../assets/readme/banners/rabbitmq.png" alt="RabbitMQ" width="100%">
</p>

# Entrega de mensagem em tempo real

Quando o `api-messenger` publica um evento de conversa e o relay externo está ativo, o RabbitMQ distribui o tópico às conexões do serviço de mensagens. Cada instância entrega o evento às sessões que mantém conectadas. A autorização da pessoa e o conteúdo do evento pertencem ao `api-messenger`.

```mermaid
sequenceDiagram
    participant App as Aplicativo
    participant Origem as api-messenger
    participant Broker as RabbitMQ
    participant Destino as Outra instância do api-messenger
    participant Sessao as Sessão conectada

    App->>Origem: mensagem por WebSocket e STOMP com JWT
    Origem->>Origem: valida a sessão e processa o comando
    Origem->>Broker: publica em /topic por STOMP com usuário e senha
    Broker-->>Destino: distribui o tópico por STOMP
    Destino-->>Sessao: entrega por WebSocket e STOMP
    alt broker indisponível ou credenciais inválidas
        Broker-->>Origem: conexão STOMP falha
    end
```

## Casos de erro

- Sem conexão com o broker, o relay não distribui novos eventos por ele. O repositório do broker não define reenvio nem fila de falhas.
- Com credenciais inválidas, o RabbitMQ recusa a conexão STOMP.
- Com o relay desabilitado, o `api-messenger` usa o broker em memória, e a entrega fica limitada à mesma instância.

O fluxo de autenticação do cliente está em [LOGIN_AND_TOKEN.md](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/LOGIN_AND_TOKEN.md).
