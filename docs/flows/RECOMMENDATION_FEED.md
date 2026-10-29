# Feed de recomendações

As recomendações de profissionais, ofertas e fornecedores vêm de um grafo no Neo4j. O `database-bootstrap` monta o grafo a partir do Postgres de negócio, e o `api-recommendation` consulta o grafo. Se o grafo não responde, ele cai para uma consulta direta ao Postgres.

```mermaid
flowchart LR
  CORE[(Postgres de negócio)] -->|leitura| BOOT[database-bootstrap]
  BOOT -->|job e cronjob| NEO[(Neo4j feeddb)]
  REC[api-recommendation] --> NEO
  REC -.->|fallback| CORE
  MCP[mcp-database] -->|X-Service-Key| REC
  SBX[web-sandbox] --> REC
```

- Hoje o feed chega ao usuário só pelo assistente, através do `mcp-database`. O `web-app` e o `mobile-app` ainda não consomem os feeds.
