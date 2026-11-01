<p align="center">
  <img src="../assets/readme/banners/databricks.png" alt="Databricks" width="100%">
</p>

# Situação

Levantamento da main `c3c1c251`, em 2026-10-30.

- Bronze copia somente CoreDB. O risco específico de copiar authdb inteiro do checklist não representa esta implementação (2026-10-30).
- Há API, consulta de jobs, health, readiness, OpenAPI e exportação de 19 indicadores Gold (2026-10-30).
- O manifesto exige `workspace.gold_core` e nomes `kpi_fornecedor_*`, enquanto o produtor atual usa schema `gold`, nomes `kpi_supplier_*` e job com catálogo `analytics`. Não considerar a integração pronta só porque ambos listam 19 indicadores (2026-10-30). <!-- PENDENTE: 1 -->
- Token fixo Bearer difere do padrão de `X-Service-Key` por chamador. Hospedagem também tem descrições conflitantes (2026-10-30). <!-- PENDENTE: 2 -->
- Bronze substitui tabelas individualmente, sem snapshot único ou rollback global. Seleciona todas as tabelas públicas, sem lista revisada ou filtro de campos. Retenção e recarga após falha precisam de política (2026-10-30). <!-- PENDENTE: 3 -->
- Jobs e trava da API são locais ao processo. Reinício perde histórico e execução em thread daemon pode ser interrompida (2026-10-30).
- Gold usa uma transação PostgreSQL e staging, mas não uma transação única entre as fontes Databricks. Não atualizar as fontes durante a exportação (2026-10-30).
- RLS forçado depende de função e principais provisionados externamente. Prontidão não verifica o contrato completo de autorização (2026-10-30). <!-- PENDENTE: 4 -->
