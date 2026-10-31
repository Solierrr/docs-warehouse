<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Deploy

O workflow declara QA em https://ai-assistant-5ljd.onrender.com, readiness em `/ready` e verificação do cluster de produção. O processo comum está em [QA_RENDER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md) e [PROD_GKE_ARGOCD.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PROD_GKE_ARGOCD.md).

O Dockerfile inicia Uvicorn na porta 8000. Não há entrypoint de Render versionado nesta main. A disponibilidade e a configuração efetivas precisam de confirmação. <!-- PENDENTE: 1 --> Configure Mongo, serviços, modelos e índice de FAQ antes de validar o atendimento.
