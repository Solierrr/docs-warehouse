# Visão geral das integrações

Quem chama quem na plataforma. Setas cheias são integrações ligadas. Setas tracejadas são previstas e ainda não ligadas. Bancos e provedores externos ficam nos documentos de cada repositório.

```mermaid
flowchart LR
  subgraph Clientes
    WEB[web-app]
    MOB[mobile-app]
    SBX[web-sandbox]
    WRK[worker-failover]
  end
  subgraph APIs
    AUTH[api-auth]
    CORE[api-core]
    MSG[api-messenger]
    REC[api-recommendation]
    EMAIL[api-email]
    GOOG[api-google]
    NOTIFY[api-notify]
  end
  subgraph Agentes
    ASSIST[ai-assistant]
    OPER[ai-operational]
    GEO[ai-geographic]
    VALID[ai-validation]
    ACCESS[ai-accessibility]
    MCP[mcp-database]
  end

  WRK --> WEB
  WEB --> AUTH & CORE & MSG & VALID
  MOB --> AUTH & CORE & MSG
  MOB -->|só QA| GOOG
  SBX --> AUTH & CORE & MSG & REC & EMAIL & GOOG
  SBX --> ASSIST & OPER & GEO & VALID & ACCESS

  AUTH -->|cria o usuário| CORE
  CORE -->|chave pública do JWT| AUTH
  CORE -->|convite| EMAIL
  CORE -->|tradução| GOOG
  CORE -->|desligado| VALID
  MSG -->|quem participa do projeto| CORE
  MSG --> AUTH
  NOTIFY --> AUTH
  GOOG --> AUTH

  ASSIST --> MCP & MSG & CORE
  ASSIST -->|A2A| OPER
  OPER --> MCP & MSG & CORE
  GEO --> GOOG & MSG
  GEO -->|A2A| ASSIST
  MCP --> REC
  ASSIST & OPER & GEO --> AUTH

  AUTH -.->|e-mails da conta| EMAIL
  MSG -.->|aviso de mensagem nova| EMAIL
  MSG -.-> NOTIFY
  CORE -.-> NOTIFY
  MOB -.->|push| NOTIFY
  WEB -.->|chat| ASSIST
  WEB -.->|descrição de imagem| ACCESS
  WEB -.->|feeds| REC
```

## Peso de cada repositório

- `api-auth`, `api-core` e `api-messenger` concentram o tráfego. Uma mudança neles afeta quase toda a plataforma.
- `api-notify`, `ai-accessibility`, `api-recommendation`, `api-email` e `ai-geographic` estão no ar, mas nenhum cliente final chega neles ainda.
- O `web-sandbox` é o portal do QA e chama todas as APIs para teste.

## Dados

| Banco | Dono | Quem também lê |
|---|---|---|
| Postgres de negócio (`coredb`) | `api-core`, com o schema no `database-console` | `mcp-database`, `api-recommendation`, `database-bootstrap`, `database-rpa`, `databricks-sync` |
| Postgres de autenticação (`authdb`) | `api-auth`, com o schema no `database-console` | `databricks-sync` |
| Mongo de conversas | `api-messenger` | |
| Mongo de notificações | `api-notify` | |
| Mongo, Qdrant e Redis dos agentes | `ai-assistant` | `ai-operational`, `ai-geographic` |
| Neo4j de recomendações (`feeddb`) | `api-recommendation` | escrito pelo `database-bootstrap` |
| Firestore | `web-app` (indicador de digitação) | |
| Redis da plataforma | `api-auth` e `api-core` | |
