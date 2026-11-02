<p align="center">
  <img src="./assets/readme/banners/databricks.png" alt="Databricks" width="100%">
</p>

# Pendências

## 1. Catálogo e contrato de exportação

- Onde aparece em `docs/ARCHITECTURE.md, docs/DEPLOY.md, docs/STATUS.md, database/DATABRICKS.md e flows/NOTEBOOK_PIPELINE.md`.
- O que o código mostra é que módulo usa workspace e schema gold. Job usa analytics. Painéis usam workspace.gold. O exportador exige workspace.gold_core com nomes diferentes.
- Hipótese usada no texto é descrever os contratos como distintos. Confirmar catálogo canônico, migração ou compatibilidade e ordem de atualização.
- Resposta do dono: Respondido em 2026-11-01: "OK". O contrato Gold de referência é o do `databricks-stocker`, o bootstrap e as consultas acompanham o schema atual do `api-core`, e o backup é diário. As demais hipóteses do texto ficam como estado documentado.


## 2. Instalação, cutover e painéis

- Onde aparece em `docs/OVERVIEW.md, docs/DEPLOY.md, docs/STATUS.md e database/DATABRICKS.md`.
- O que o código mostra é que há job de duas tasks e duas definições de painéis. O README ainda diz que não há painéis. Não foi conferido o workspace instalado e os caminhos do job são específicos de ambiente.
- Hipótese usada no texto é tratar arquivos como definições versionadas. Confirmar runtime, compute, caminhos autorizados, cutover das pipelines antigas e publicação dos painéis.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.


## 3. Qualidade e personas profissionais

- Onde aparece em `docs/OVERVIEW.md, docs/STATUS.md e database/DATABRICKS.md`.
- O que o código mostra é que rejeições são contadas no terminal, sem tabela persistente. Tipos de vínculo profissional não têm correspondência fechada com personas.
- Hipótese usada no texto é descrever filtros implementados sem criar política de auditoria ou equivalência de personas. Confirmar retenção de rejeitados e significado esperado dos recortes.
- Resposta do dono: Respondido em 2026-11-01: "OK". O contrato Gold de referência é o do `databricks-stocker`, o bootstrap e as consultas acompanham o schema atual do `api-core`, e o backup é diário. As demais hipóteses do texto ficam como estado documentado.


## 4. Isolamento no consumo final

- Onde aparece em `docs/OVERVIEW.md, docs/ARCHITECTURE.md, docs/DEPLOY.md, docs/STATUS.md, database/DATABRICKS.md e flows/SUPPLIER_ACCESS.md`.
- O que o código mostra é que dez tabelas recebem filtro de fornecedor por session_user. As demais não recebem esse filtro e o executor local não aplica a política.
- Hipótese usada no texto é documentar alcance exato do controle. Confirmar grants por persona, mapa de principais, identidade do job e exportador e execução dos painéis.
- Resposta do dono: Respondido em 2026-11-01: "OK". O contrato Gold de referência é o do `databricks-stocker`, o bootstrap e as consultas acompanham o schema atual do `api-core`, e o backup é diário. As demais hipóteses do texto ficam como estado documentado.
