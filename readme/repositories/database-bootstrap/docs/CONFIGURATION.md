<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/neo4j.png" alt="Neo4j" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
</p>

# Configuração e estrutura

## Configuração

Todas as variáveis estão em [`.env.example`](https://github.com/Solierrr/database-bootstrap/blob/main/.env.example). Os defaults, limites e timeouts de conexão ficam em [`src/config.json`](https://github.com/Solierrr/database-bootstrap/blob/main/src/config.json). Em desenvolvimento use um `.env` local (ignorado pelo Git). No GKE elas vêm de um Secret criado a partir do Infisical, pastas `/feeddb` e `/database`.

## Estrutura

```text
src/
  main.py               liga PostgreSQL, Cypher e Neo4j; códigos de saída
  extract.sql           extração do PostgreSQL: um dataset por seção
  config.json           nome da fonte, variáveis obrigatórias, defaults e limites, timeouts
  graphs/
    schema.cypher       constraints e índices
    nodes/              um arquivo por label
    relationships/      um arquivo por tipo de relação
    snapshot/           lock, validação, ativação e limpeza
tests/
  unit/
  integration/          exigem Neo4j e PostgreSQL descartáveis
scripts/                utilitários locais e de CI
docs/                   arquitetura, execução e plano
```

Documentação: [ARCHITECTURE.md](https://github.com/Solierrr/database-bootstrap/blob/main/docs/ARCHITECTURE.md), [RUNNING.md](https://github.com/Solierrr/database-bootstrap/blob/main/docs/RUNNING.md) e [PLAN.md](https://github.com/Solierrr/database-bootstrap/blob/main/docs/PLAN.md).
