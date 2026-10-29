# Cópia dos dados para análise

Os bancos de negócio e de autenticação são copiados para a camada bronze no Databricks, onde os notebooks e dashboards do `databricks-stocker` trabalham. A cópia é disparada à mão, sem agendamento, para não consumir a cota gratuita.

```mermaid
sequenceDiagram
    participant Pessoa as Quem dispara
    participant Sync as databricks-sync
    participant PG as Postgres (coredb e authdb)
    participant DBX as Databricks
    participant Stocker as databricks-stocker

    Pessoa->>Sync: POST de sincronização (token)
    Sync->>PG: leitura das tabelas
    Sync->>DBX: grava na camada bronze
    alt sucesso
        Sync-->>Pessoa: resumo por tabela
    else erro em alguma tabela
        Sync-->>Pessoa: 500 com o resumo em result
    end
    Stocker->>DBX: notebooks e dashboards sobre a bronze
```

- O schema dos dois bancos é mantido no `database-console`.
