<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Deploy

O [workflow de ambiente](https://github.com/Solierrr/ai-geographic/blob/main/.github/workflows/environment-status.yml) aponta o QA em https://ai-geographic.onrender.com. O container usa Python 3.14 e escuta na porta 8000. A existência da configuração não comprova o estado atual do ambiente.

O processo comum está em [QA_RENDER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md). Os workflows de release e promoção ficam em `.github/workflows/`. O Dockerfile inicia Uvicorn diretamente, portanto não extrai segredos por um entrypoint próprio.

Não há confirmação no repositório de uma URL de produção para este serviço. O escopo de publicação precisa de confirmação operacional. <!-- PENDENTE: 1 -->
