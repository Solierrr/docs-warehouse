<p align="center">
  <img src="../assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

# Operação por ambiente

Estes utilitários não são um serviço publicado com URL própria. As operações são iniciadas manualmente contra o ambiente selecionado. O ambiente das credenciais é escolhido em `make vault ENV=local`, `ENV=qa` ou `ENV=prod`.

Para preparar analytics, `make create TARGET=analytics ENVIRONMENT=prod` cria o banco se não existir e `make schema TARGET=analytics ENVIRONMENT=prod` aplica seu schema. QA usa o sufixo de banco correspondente. Nenhum desses passos é automático.

`reset` apaga e recria o banco selecionado. `reset-mongo` trata o banco de conversas separadamente. A documentação dos serviços e o [processo de produção](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PROD_GKE_ARGOCD.md) descrevem as aplicações que usam esses dados.
