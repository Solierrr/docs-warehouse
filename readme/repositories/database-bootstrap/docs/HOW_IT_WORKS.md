<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/neo4j.png" alt="Neo4j" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
</p>

# Como a rotina funciona

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
