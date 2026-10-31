# Criação do usuário no cadastro central

A conta nasce no `api-auth`, que guarda só identidade e sessão. O perfil de produto (cliente, profissional, empresa) fica no `api-core`. Para os dois ficarem sincronizados, o `api-auth` publica o evento numa fila e um consumidor cria o usuário no `api-core`.

```mermaid
sequenceDiagram
    participant Cliente
    participant Auth as api-auth
    participant Fila as Redis (outbox)
    participant Core as api-core

    Cliente->>Auth: cadastro
    Auth->>Auth: grava a conta no authdb
    Auth->>Fila: evento de usuário criado
    Auth-->>Cliente: conta criada
    Fila->>Auth: consumidor core-user-provisioner
    Auth->>Core: POST /internal/users (X-Service-Key)
    alt sucesso
        Core-->>Auth: 201
    else falha temporária
        Core-->>Auth: erro
        Auth->>Fila: o evento volta para nova tentativa
    end
```

- A rota `/internal/users` do `api-core` só aceita o `api-auth`, pela [autenticação entre serviços](./SERVICE_TO_SERVICE_AUTH.md).
- Como o envio é assíncrono, o perfil pode demorar alguns segundos para aparecer no `api-core` depois do cadastro.
