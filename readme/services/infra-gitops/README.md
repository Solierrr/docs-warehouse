<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/argocd.png" alt="Argo CD" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes-deployment.png" width="100" hspace="8" alt="Kubernetes Deployment" title="Kubernetes Deployment">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes-service.png" width="100" hspace="8" alt="Kubernetes Service" title="Kubernetes Service">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes-ingress.png" width="100" hspace="8" alt="Kubernetes Ingress" title="Kubernetes Ingress">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gcp.png" width="100" hspace="8" alt="Google Cloud" title="Google Cloud">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/github-actions.png" width="100" hspace="8" alt="GitHub Actions" title="GitHub Actions">
</p>

# Entrega contínua dos serviços

[![License](https://img.shields.io/github/license/Solierrr/infra-gitops)](https://github.com/Solierrr/infra-gitops/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/infra-gitops)](https://github.com/Solierrr/infra-gitops/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/infra-gitops)](https://github.com/Solierrr/infra-gitops/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/infra-gitops)](https://github.com/Solierrr/infra-gitops/releases)

Este repositório descreve como cada serviço da plataforma deve estar em execução no cluster na nuvem. Em vez de aplicar mudanças manualmente, o estado desejado fica registrado aqui, e uma ferramenta de entrega contínua mantém o cluster igual ao que está descrito. Publicar um serviço novo ou alterar um existente consiste em adicionar ou modificar um arquivo neste repositório. Todo o histórico de mudanças fica registrado no próprio repositório.

## Ficha técnica

- **Tipo:** infraestrutura declarativa (GitOps).
- **Ferramenta:** Argo CD, com sincronização automática, remoção do que sai do repositório e correção de divergências.
- **Por serviço:** Application do Argo CD, Deployment, Service e, quando exposto, Ingress.
- **Ambientes:** produção no GKE.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/infra-gitops/blob/main/docs/ARCHITECTURE.md), estrutura de pastas e o padrão app-of-apps em detalhe.
- [RUNNING.md](https://github.com/Solierrr/infra-gitops/blob/main/docs/RUNNING.md), como validar um manifesto localmente antes de abrir Pull Request.
- [DEPLOYMENT.md]({a confirmar}), pipeline de deploy da organização (ver [docs-warehouse/.github/DEPLOYMENT.md](https://github.com/Solierrr/docs-warehouse/blob/main/.github/DEPLOYMENT.md)).
- [HOW_IT_WORKS.md](https://github.com/Solierrr/infra-gitops/blob/main/docs/HOW_IT_WORKS.md), como as aplicações do ArgoCD apontam para os serviços.

## Contribuindo

- [.github/CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md]({a confirmar}), código de conduta do projeto.
- [SECURITY.md]({a confirmar}), como reportar vulnerabilidades de segurança.
