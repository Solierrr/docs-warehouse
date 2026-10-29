# Convite de projeto por e-mail

Quando alguém é convidado para um projeto, o `api-core` pede ao `api-email` o envio do convite. O `api-email` monta o e-mail a partir do modelo e envia por SMTP.

```mermaid
sequenceDiagram
    participant Dono as Dono do projeto
    participant Core as api-core
    participant Email as api-email
    participant SMTP

    Dono->>Core: convida uma pessoa (JWT)
    Core->>Core: grava o convite
    Core->>Email: POST com modelo e dados (X-Service-Key)
    Email->>Email: monta o e-mail pelo modelo
    Email->>SMTP: envio
    alt envio aceito
        Email-->>Core: envio aceito
    else SMTP fora do ar
        Email-->>Core: 503 EMAIL_SEND_FAILED
    end
    Core-->>Dono: convite criado
```

- Os e-mails da conta (confirmação, recuperação de senha) ainda saem por SMTP próprio do `api-auth` e devem passar pelo `api-email` no futuro.
