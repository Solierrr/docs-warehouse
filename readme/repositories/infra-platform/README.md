<p align="center">
  <img src="./assets/readme/banners/terraform.png" alt="terraform" width="100%">
</p>

<p align="center">
  <img src="./assets/readme/stacks/gke.png" width="100" hspace="8" alt="gke" title="gke">
  <img src="./assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="kubernetes" title="kubernetes">
  <img src="./assets/readme/stacks/helm.png" width="100" hspace="8" alt="helm" title="helm">
  <img src="./assets/readme/stacks/argocd.png" width="100" hspace="8" alt="argocd" title="argocd">
  <img src="./assets/readme/stacks/infisical.png" width="100" hspace="8" alt="infisical" title="infisical">
  <img src="./assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="cloudflare" title="cloudflare">
</p>

# Infraestrutura base da plataforma

[![License](https://img.shields.io/github/license/Solierrr/infra-platform)](https://github.com/Solierrr/infra-platform/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/infra-platform)](https://github.com/Solierrr/infra-platform/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/infra-platform)](https://github.com/Solierrr/infra-platform/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/infra-platform)](https://github.com/Solierrr/infra-platform/releases)

Este repositório define a base de nuvem necessária para executar a plataforma. Ele organiza rede, cluster, entrada de tráfego, certificados, controle de acesso e distribuição de configuração. A equipe usa uma definição versionada para conhecer o que deve existir e planejar alterações antes de aplicá-las no ambiente.

O Terraform combina recursos do Google Cloud, Kubernetes, Helm, Infisical e Cloudflare. A instalação inicial prepara os controladores, enquanto o GitOps mantém as aplicações. Scripts de operação apoiam a criação e a redução do conjunto de máquinas e o registro do estado esperado, sem que esse registro substitua a observação do ambiente real.

## Aprofunde-se no Projeto!

- [OVERVIEW.md](./docs/OVERVIEW.md), finalidade e regras de produto.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md), componentes, dados e integrações.
- [RUNNING.md](./docs/RUNNING.md), preparação e execução local.
- [DEPLOY.md](./docs/DEPLOY.md), ambientes e publicação.
- [SECRETS.md](./docs/SECRETS.md), detalhes do fluxo ou modelo de dados.
- [STATUS.md](./docs/STATUS.md), limites observados.
- [CLUSTER_UP.md](./flows/CLUSTER_UP.md), detalhes do fluxo ou modelo de dados.
- [CLUSTER_DOWN.md](./flows/CLUSTER_DOWN.md), detalhes do fluxo ou modelo de dados.
- [SECRETS_SYNC.md](./flows/SECRETS_SYNC.md), detalhes do fluxo ou modelo de dados.
- [PENDENCIAS.md](./PENDENCIAS.md), questões para revisão.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de contribuição.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), relato de vulnerabilidades.
