# Chamada entre serviços

Quando um serviço chama outro em nome de si mesmo, e não de uma pessoa, ele se identifica pelo cabeçalho `X-Service-Key`. Cada serviço tem a própria chave, e o destino diz quais chamadores aceita em cada rota. O padrão completo está em [SERVICE_AUTH.md](../standards/SERVICE_AUTH.md).

```mermaid
sequenceDiagram
    participant Infisical
    participant A as Serviço chamador
    participant B as Serviço destino

    Infisical-->>A: SERVICE_KEY (a própria chave)
    Infisical-->>B: SERVICE_KEY_<CHAMADOR> de cada chamador aceito
    A->>B: /internal/... com X-Service-Key
    B->>B: compara em tempo constante e descobre quem chamou
    alt chave conhecida e chamador aceito na rota
        B-->>A: resposta
    else chave ausente ou desconhecida
        B-->>A: 401 UNAUTHENTICATED
    else chamador não aceito nesta rota
        B-->>A: 403 FORBIDDEN
    end
```

- As chaves ficam na pasta `/service-keys` do Infisical, nos ambientes `local`, `qa` e `prod`.
- As rotas `/internal/**` não aparecem no Swagger público. Elas ficam documentadas no `openapi.yaml` do repositório.
- Quando o serviço age em nome de uma pessoa, como os agentes ao ler dados do usuário, ele repassa o JWT da pessoa em vez da chave.
