<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/neo4j.png" alt="Neo4j" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
</p>

# Carga do banco de recomendações

[![License](https://img.shields.io/github/license/Solierrr/database-bootstrap)](https://github.com/Solierrr/database-bootstrap/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/database-bootstrap)](https://github.com/Solierrr/database-bootstrap/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/database-bootstrap)](https://github.com/Solierrr/database-bootstrap/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/database-bootstrap)](https://github.com/Solierrr/database-bootstrap/releases)

Esta rotina monta e reconstrói o banco de relações usado nas recomendações da plataforma, a partir dos dados do banco principal. Ela não é um serviço que fica no ar: roda sob demanda, faz o trabalho e termina. Como o banco principal é a fonte oficial das informações, o banco de relações pode ser apagado e recriado a qualquer momento, e esta rotina o preenche de novo com os dados atuais. O funcionamento, os códigos de saída e a configuração estão nas seções abaixo.

Não é um serviço. Não expõe HTTP, não tem Service nem Ingress e só consome CPU e memória enquanto roda. Ele depende apenas do PostgreSQL e do Neo4j, nunca de uma API da aplicação.

## Como funciona

A sincronização é descrita em Cypher (`src/graphs/`). O SQL é só a extração, em um único arquivo (`src/extract.sql`). O Python (`src/main.py`) só liga as pontas: lê as linhas do PostgreSQL, entrega cada lote ao Cypher e chama os passos na ordem certa.

1. `src/extract.sql` extrai os dados do `coredb` em uma transação `REPEATABLE READ` somente leitura, uma consulta por dataset.
2. `src/graphs/schema.cypher` garante constraints e índices.
3. `src/graphs/snapshot/acquire_lock.cypher` toma o lock com lease. Outra execução recebe código de saída 2.
4. `src/graphs/nodes/` e depois `src/graphs/relationships/` gravam o snapshot novo, com `MERGE` e `UNWIND $rows`. Cada arquivo declara na primeira linha o dataset que consome (`// dataset: <nome>`) e devolve `count(*) AS merged`; se uma linha lida não foi gravada (por exemplo, uma relação sem ponta), a execução é recusada.
5. `src/graphs/snapshot/validate.cypher` recusa o snapshot se algum label ou relação encolheu abaixo de `SYNC_MIN_DOMAIN_RETENTION_RATIO` em relação à versão ativa.
6. `src/graphs/snapshot/activate_snapshot.cypher` troca `SyncState.active_version`. O `api-recommendation` só lê a versão ativa, então um rebuild nunca serve um grafo pela metade.
7. As versões antigas são removidas, mantendo a ativa e a anterior.

Se qualquer passo antes da ativação falhar, a versão ativa continua intacta e o staging é descartado.

O contrato do grafo (labels, relações e regra de elegibilidade) está documentado na spec do projeto no VersioSpec.

## Códigos de saída

| Código | Significado |
|---|---|
| 0 | snapshot ativado |
| 1 | falha inesperada |
| 2 | outra sincronização em andamento |
| 3 | snapshot recusado por validação |
| 64 | variáveis de ambiente ausentes ou inválidas |

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
