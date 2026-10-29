# Release e deploy

Toda mudança entra na `main` por Pull Request. O QA roda a branch `qa` no Render, e a produção roda no GKE pelo Argo CD, com a imagem do release.

```mermaid
flowchart TD
  PR[Pull Request] -->|CI e revisão| MAIN[main]
  MAIN -->|release-please abre a PR de release| REL[PR de release]
  REL -->|comentário /release| TAG[tag vX.Y.Z]
  TAG --> IMG[imagem Docker com a versão]
  MAIN -->|qa-sync abre a PR main para qa| QA[qa]
  QA -->|commit novo| RENDER[Render QA]
  IMG -->|bump no infra-gitops| GITOPS[infra-gitops]
  GITOPS -->|Argo CD sincroniza| GKE[GKE produção]
  INFRA[infra-platform] -->|Terraform: cluster, Kong, Argo CD e segredos| GKE
```

- O sentido é sempre da `main` para a `qa`. Levar algo da `qa` para a `main` é exceção e passa por Pull Request revisada.
- O ambiente aparece no GitHub de cada repositório pelo workflow `environment-status`, que confere o caminho de pronto.
- Os detalhes por plataforma ficam em [`readme/deploy/`](../../readme/deploy/), e a versão em [VERSIONING.md](../standards/VERSIONING.md).
