# Login e validação do token

A pessoa entra uma vez pelo `api-auth` e recebe um JWT. Os outros serviços não consultam o `api-auth` a cada chamada. Eles baixam a chave pública dele e conferem a assinatura do token localmente.

```mermaid
sequenceDiagram
    participant Cliente as web-app, mobile-app ou web-sandbox
    participant Auth as api-auth
    participant Firebase
    participant Servico as Serviço chamado

    alt login federado
        Cliente->>Firebase: login com Google
        Firebase-->>Cliente: token do Firebase
        Cliente->>Auth: troca o token do Firebase
    else login com e-mail e senha
        Cliente->>Auth: e-mail e senha
    end
    Auth-->>Cliente: JWT de acesso (15 min) e refresh token (7 dias)

    Cliente->>Servico: chamada com o JWT
    Servico->>Auth: chave pública (/.well-known/jwks.json), guardada em cache
    Servico->>Servico: confere assinatura e validade
    alt token válido
        Servico-->>Cliente: resposta
    else token ausente, inválido ou expirado
        Servico-->>Cliente: 401 UNAUTHENTICATED
        Cliente->>Auth: refresh token
        Auth-->>Cliente: novo JWT
    end
```

- O app mobile entra por deeplink com PKCE.
- O JWT é assinado com RS256. Cada serviço recebe o endereço da chave pública por variável (`JWT_JWK_SET_URI` nos serviços Spring, `JWT_JWKS_URL` nos agentes).
- Os erros seguem o [contrato de erro](../standards/ERRORS.md).
