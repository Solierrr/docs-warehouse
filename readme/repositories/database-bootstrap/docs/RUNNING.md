<p align="center">
  <img src="../assets/readme/banners/neo4j.png" alt="Neo4j" width="100%">
</p>

# Execução local

Requer Python 3.14, acesso a PostgreSQL e Neo4j compatíveis com as queries, make e shell. O guia comum está em [Python](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/PYTHON.md).

## Preparar

Executar no checkout do job.

```bash
make doctor
make vault
make install
```

`make vault` lê `/database` e `/recommendation`, conforme o Makefile. O orquestrador não carrega `.env` por si só. Exportar as variáveis no shell ou fornecê-las ao container antes de executar. O texto antigo que apenas indicava um `.env` era insuficiente.

```bash
set -a
. ./.env
set +a
make dev
```

`make dev` executa uma carga real que escreve no Neo4j. Não é servidor de desenvolvimento. Usar destinos descartáveis ou autorizados para essa finalidade.

| Nome | Uso |
|---|---|
| `DB_POSTGRES_HOST`, `DB_POSTGRES_CORE`, `DB_POSTGRES_USER`, `DB_POSTGRES_PASSWORD` | Origem |
| `DB_POSTGRES_PORT`, `DB_POSTGRES_SSLMODE` | Porta e TLS da origem |
| `DB_NEO4J_URI`, `DB_NEO4J_USER`, `DB_NEO4J_PASSWORD`, `DB_NEO4J_FEED` | Destino |
| `SYNC_BATCH_SIZE` | Lote, padrão 500 |
| `SYNC_LOCK_LEASE_SECONDS` | Lease, padrão 900 segundos |
| `SYNC_MIN_DOMAIN_RETENTION_RATIO` | Mínimo relativo por domínio, padrão 0.5 |
| `NEO4J_WAIT_SECONDS` | Espera inicial de conectividade, padrão 300 segundos |

O ratio deve ficar entre zero e um. Configuração numérica inválida impede início. Conexão PostgreSQL usa timeout de 15 segundos e TLS require por padrão. Neo4j usa timeout de 10 segundos e pool de até cinco conexões.

## Verificações

`make lint` verifica Ruff e `make build` compila `src`. `make test` não tem comando configurado. A árvore desta main não contém a suíte `tests/` descrita nos textos antigos. O CI constrói o container, importa o módulo e confirma saída 64 sem configuração. Isso não é teste integrado do grafo.

Não há `make openapi`, Swagger ou API própria.

| Saída | Significado |
|---|---|
| 0 | Snapshot ativado |
| 1 | Falha inesperada |
| 2 | Outra execução possui o lock |
| 3 | Snapshot inseguro, contagem divergente ou posse perdida |
| 64 | Configuração ausente ou inválida |

Confirmar o schema de origem antes de qualquer execução. A rotina auxiliar de schema é externa ao carregamento normal e não deve ser tratada como correção automática de incompatibilidade. <!-- PENDENTE: 1 -->

Fontes em [Makefile](https://github.com/Solierrr/database-bootstrap/blob/main/Makefile), [CI](https://github.com/Solierrr/database-bootstrap/blob/main/.github/workflows/ci.yml) e [configuração](https://github.com/Solierrr/database-bootstrap/blob/main/src/config.json).
