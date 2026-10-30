<p align="center">
  <img src="../assets/readme/banners/google.png" alt="Google" width="100%">
</p>

# Publicação

## Ambientes

| Ambiente | Endereço | Observação |
|---|---|---|
| Local | `http://localhost:8000` | Iniciado por `make dev`. |
| QA | [Render](https://google-registry.onrender.com) | URL declarada no contrato OpenAPI. |
| PROD | Acesso interno no GKE | O checklist registra `ClusterIP`, sem URL pública confirmada. <!-- PENDENTE: 3 --> |

Os procedimentos comuns estão em [QA no Render](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md) e [PROD no GKE](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PROD_GKE_ARGOCD.md). O [Dockerfile](https://github.com/Solierrr/api-google/blob/main/Dockerfile) instala o pacote e inicia Uvicorn na porta 8000.

## Configuração específica

O ambiente fornece credenciais do Google, OAuth do Calendar, endereço do serviço de autenticação e chaves dos chamadores. `DOCS_ENABLED=false` desliga Swagger e contrato servido. A prontidão é `/ready`, e o processo é verificado por `/health`. Os nomes do repositório, da imagem e do serviço publicado divergem no levantamento de implantação. <!-- PENDENTE: 4 -->
