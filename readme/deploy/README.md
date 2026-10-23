<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/template.png" alt="Template" width="100%">
</p>

# Deploy

README reutilizável. O deploy da organização é automático a partir de duas branches, sem passos manuais: `qa` publica no Render e `main` leva a mesma versão para o cluster de produção. Cada repositório usa o documento do seu tipo de deploy; o que muda de um tipo para o outro é só o destino e o arquivo de entrega.

## Escolha o documento do seu repositório

| Tipo | Documento | Repositórios |
|---|---|---|
| Serviço de aplicação, QA no Render e produção no GKE | [QA no Render](./QA_RENDER.md) e [produção no GKE](./PROD_GKE_ARGOCD.md) | `api-auth`, `api-core`, `api-messenger`, `api-recommendation`, `ai-assistant`, `ai-validation`, `mcp-database`, `web-app`, `google-registry` |
| Serviço de aplicação só com QA por enquanto | [QA no Render](./QA_RENDER.md) | `ai-accessibility`, `ai-geographic`, `ai-operational`, `api-email` |
| Serviço independente no Render (`main`) | [QA no Render](./QA_RENDER.md), seção de serviços independentes | `infra-gateway`, `databricks-sync`, `web-sandbox` |
| Worker da Cloudflare | [Worker na Cloudflare](./CLOUDFLARE_WORKER.md) | `web-worker` |
| Biblioteca publicada em registro de pacotes | [Pacotes](./PACKAGE_RELEASE.md) | `lib-web`, `lib-ai` |
| Infraestrutura declarativa | [Produção no GKE](./PROD_GKE_ARGOCD.md) | `infra-platform`, `infra-gitops`, `infra-otel-collector` |
| Sem deploy | nenhum | `docs-warehouse`, `docs-reports`, `mocks-warehouse`, `database-console`, `database-rpa`, `infra-stress`, `mobile-app` (APK distribuído à mão) |

## O que é igual para todos

1. **A mudança entra por Pull Request.** O CI valida o código antes do merge, e todo Pull Request usa o template do repositório.
2. **Versão automática.** Um commit `feat:`, `fix:` ou `!` abre a Pull Request de release (release-please), que atualiza a versão e o `CHANGELOG.md`.
3. **A imagem é única.** Quando há container, o mesmo artefato roda em QA e em produção; só a configuração injetada muda. Os segredos vêm do [Infisical](../infisical/README.md), nunca da imagem.
4. **O ambiente aparece no GitHub.** Cada repositório com deploy mostra um ambiente de deployment (`QA`, `PROD` ou `ALIVE`) na página inicial e nos commits, verificado por um workflow reutilizável da organização.
5. **Rollback é um revert.** Reverter o commit em `main` dispara o mesmo fluxo e publica a versão corrigida; os detalhes ficam em cada documento.

## Arquivos de deploy por tipo

| Arquivo | Serviço de aplicação | Worker | Biblioteca | Infra e dados |
|---|---|---|---|---|
| `Dockerfile` e `.dockerignore` | sim | não | não | não |
| `entrypoint.sh` | só se o Render lê o Infisical na partida | não | não | não |
| `http/` (Bruno) | só em API HTTP | não | não | não |
| `.env.example` | sim, se lê variáveis | `.dev.vars.example` | só se lê variáveis | só se lê variáveis |
| Workflow de imagem (`release.yml`) | sim | não | não (publica pacote) | não |
| `qa-sync.yml` | sim, se tem branch `qa` | não | não | não |

A matriz completa, com os achados da revisão, está na spec de tipos de repositório. O pipeline padrão da organização também está resumido em [`.github/DEPLOYMENT.md`](../../.github/DEPLOYMENT.md).
