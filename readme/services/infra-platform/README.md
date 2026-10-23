<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/terraform.png" alt="Terraform" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gcp.png" width="100" hspace="8" alt="Google Cloud" title="Google Cloud">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
</p>

# Infraestrutura base na nuvem

[![License](https://img.shields.io/github/license/Solierrr/infra-platform)](https://github.com/Solierrr/infra-platform/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/infra-platform)](https://github.com/Solierrr/infra-platform/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/infra-platform)](https://github.com/Solierrr/infra-platform/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/infra-platform)](https://github.com/Solierrr/infra-platform/releases)

Este repositório define em código a infraestrutura básica da plataforma na nuvem: a rede, o cluster onde os serviços são executados e as ferramentas instaladas nele para publicar e proteger os serviços. Como a nuvem cobra pelo tempo em que o cluster permanece ligado, a infraestrutura foi planejada para ser desligada quando não está em uso e religada sob demanda, sem perda de configuração. Alterações neste repositório têm custo e afetam todos os serviços.

## Ficha técnica

- **Tipo:** infraestrutura como código.
- **Stack:** Terraform no Google Cloud (GKE).
- **Segredos:** criados no cluster a partir do Terraform.
- **Operação:** script para zerar os nodes do cluster sem destruí-lo.
- **Ambientes:** produção; as mudanças são aplicadas manualmente.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/infra-platform/blob/main/docs/ARCHITECTURE.md), estrutura do repositório e explicação dos recursos definidos em cada arquivo `.tf`.
- [RUNNING.md](https://github.com/Solierrr/infra-platform/blob/main/docs/RUNNING.md), como rodar `terraform plan`/`apply` localmente e usar os scripts PowerShell auxiliares.
- [DEPLOYMENT.md](https://github.com/Solierrr/docs-warehouse/blob/main/.github/DEPLOYMENT.md), papel deste repositório no fluxo de deploy da organização.

## Contribuindo

- [.github/CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- CODE_OF_CONDUCT.md, código de conduta do projeto ({a confirmar}, ainda não existe neste repositório).
- SECURITY.md, como reportar vulnerabilidades de segurança ({a confirmar}, ainda não existe neste repositório).
