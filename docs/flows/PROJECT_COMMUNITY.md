# Comunidade de projeto

Cada projeto tem uma comunidade no `api-messenger`, com a equipe e o cliente. Quem participa e com qual papel não é decidido no `api-messenger`. Ele pergunta ao `api-core`, que é dono do projeto, e sincroniza a comunidade a cada acesso.

```mermaid
sequenceDiagram
    participant Pessoa as Cliente (web ou mobile)
    participant Msg as api-messenger
    participant Core as api-core

    Pessoa->>Msg: abre a comunidade do projeto (JWT)
    Msg->>Core: GET /internal/projects/{id}/access/{pessoa} (X-Service-Key)
    Core-->>Msg: papel no projeto
    Msg->>Msg: sincroniza membros, papéis e status
    alt pessoa saiu do projeto
        Msg->>Msg: remove da comunidade e dos subgrupos
        Msg->>Msg: desfaz os subgrupos que ela geria
        Msg-->>Pessoa: 403
    else pessoa participa
        Msg-->>Pessoa: comunidade e conversas
    end
```

- Os papéis do projeto viram papéis da comunidade. OWNER continua OWNER, MANAGER vira ADMIN, MEMBER continua MEMBER e VIEWER continua VIEWER, que só lê.
- Projeto encerrado deixa a comunidade arquivada.
- Toda comunidade ativa com pelo menos dois membros tem a conversa geral do projeto, com todos dentro.
