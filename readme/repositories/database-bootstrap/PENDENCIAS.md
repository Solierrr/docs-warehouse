<p align="center">
  <img src="./assets/readme/banners/neo4j.png" alt="Neo4j" width="100%">
</p>

# Pendências

## 1. Compatibilidade do schema de origem

- Onde aparece em `docs/OVERVIEW.md, docs/ARCHITECTURE.md, docs/RUNNING.md, docs/STATUS.md e database/NEO4J.md`.
- O que o código mostra é que a extração usa users e nomes fk_*. A main atual do cadastro usa outras tabelas e referências. O job não adapta o schema.
- Hipótese usada no texto é descrever critérios atuais e marcar compatibilidade pendente. Confirmar versão da origem e migração do extrator.
- Resposta do dono: Respondido em 2026-11-01: "OK". O contrato Gold de referência é o do `databricks-stocker`, o bootstrap e as consultas acompanham o schema atual do `api-core`, e o backup é diário. As demais hipóteses do texto ficam como estado documentado.


## 2. Política de retenção por domínio

- Onde aparece em `docs/OVERVIEW.md, docs/ARCHITECTURE.md, docs/STATUS.md e flows/SNAPSHOT_RECOVERY.md`.
- O que o código mostra é que o padrão admite até metade do volume anterior e não define mínimo absoluto inicial.
- Hipótese usada no texto é descrever a proteção relativa sem tratar como validação completa. Confirmar queda legítima, primeira carga vazia e procedimento de liberação.
- Resposta do dono: Respondido em 2026-11-01: "OK". O contrato Gold de referência é o do `databricks-stocker`, o bootstrap e as consultas acompanham o schema atual do `api-core`, e o backup é diário. As demais hipóteses do texto ficam como estado documentado.


## 3. Contrato e configuração da implantação

- Onde aparece em `docs/ARCHITECTURE.md, docs/DEPLOY.md, docs/STATUS.md e database/NEO4J.md`.
- O que o código mostra é que manifestos declaram Job e CronJob com secret e imagem por SHA. A rotina pressupõe leitor que usa active_version.
- Hipótese usada no texto é apresentar os recursos como declarados. Confirmar permissões dos bancos, reader implantado, memória e acompanhamento de falhas e limpeza.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.
