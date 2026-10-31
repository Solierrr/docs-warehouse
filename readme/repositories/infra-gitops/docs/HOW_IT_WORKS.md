<p align="center">
  <img src="../assets/readme/banners/argocd.png" alt="argocd" width="100%">
</p>

# Catálogo de aplicações

As Applications versionadas na main consultada estão listadas abaixo. Cada uma aponta para uma pasta em `services/`.

- `ai-accessibility`.
- `ai-assistant`.
- `ai-geographic`.
- `ai-operational`.
- `ai-validation`.
- `mcp-database`.
- `api-auth`.
- `api-core`.
- `api-email`.
- `api-google`.
- `api-messenger`.
- `api-notify`.
- `api-recommendation`.
- `feeddb`.
- `grafana`.
- `otel-collector`.
- `rabbitmq`.
- `web-app`.

O banco `feeddb` usa Neo4j 5.26.31 Community, StatefulSet com uma réplica e volume de dados de 5 GiB. A credencial vem de `feeddb-secrets`. O schema e a reconstrução da projeção pertencem ao `database-bootstrap`, conforme o [fluxo de recomendações](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RECOMMENDATION_FEED.md).
