<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/argocd.png" alt="Argo CD" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/github-actions.png" width="100" hspace="8" alt="GitHub Actions" title="GitHub Actions">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gke.png" width="100" hspace="8" alt="Google Kubernetes Engine" title="Google Kubernetes Engine">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gcp.png" width="100" hspace="8" alt="Google Cloud" title="Google Cloud">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/infisical.png" width="100" hspace="8" alt="Infisical" title="Infisical">
</p>

# Deploy de produção no GKE com ArgoCD

A produção roda num cluster Kubernetes no Google Cloud (GKE) e é atualizada pelo [ArgoCD](https://argoproj.github.io/cd/): o merge na `main` publica a imagem e o ArgoCD sincroniza o cluster com a versão nova, sem intervenção manual. O cluster é efêmero para controlar custo, então o primeiro passo é saber se ele está no ar.

## Pipeline

1. **CI e imagem.** O workflow global `docker-publish.yml`, definido no repositório compartilhado da organização, roda nas Pull Requests com alvo na `main`.
2. **Release.** O push em `main` dispara o `release.yml`, que constrói a imagem a partir do `Dockerfile` do repositório e publica no Docker Hub da organização.
3. **ArgoCD.** A tag nova chega ao manifesto do `infra-gitops` e o ArgoCD sincroniza o cluster. A produção usa **tag imutável**, nunca `latest`.

A imagem publicada é a mesma que passou pela [QA no Render](./QA_RENDER.md); só a configuração muda.

## O cluster precisa estar no ar

Se o cluster estiver desligado, o merge na `main` publica a imagem, mas nada sobe até o cluster voltar. Para subir:

```bash
git clone https://github.com/Solierrr/infra-platform.git
cd infra-platform
terraform init
terraform plan
terraform apply
```

O `infra-platform` também tem um script (`scripts/toggle-nodes.ps1`) para zerar os nodes do GKE sem destruir o cluster. Quando o cluster está desligado de propósito, o ambiente `PROD` do GitHub aparece como `inactive` e o workflow de verificação não falha.

## Repositórios envolvidos

- `infra-platform`: define o cluster (Terraform, só Google Cloud).
- `infra-gitops`: manifestos do Kubernetes e aplicações do ArgoCD. Hoje cobre `ai-assistant`, `ai-validation`, `api-auth`, `api-core`, `api-messenger`, `api-recommendation`, `mcp-database`, `web-app`, `google-registry` e o `feeddb`.
- `infra-gateway`: configuração do Kong, a porta de entrada das APIs.
- `infra-otel-collector`: coletor de observabilidade, aplicado com Kustomize.

Para colocar um serviço novo em produção, adicione `apps/<servico>.yaml` e `services/<servico>/` (Deployment e Service) ao `infra-gitops`, e o segredo do serviço ao `infra-platform`.

## Segredos

O container não conhece o Infisical. Os segredos chegam ao pod como `Secret` e são referenciados pelo manifesto do `infra-gitops` (`envFrom`). O `Secret` é criado pelo Terraform do `infra-platform`, a partir do ambiente `prod` do [Infisical](../infisical/README.md). Nenhum segredo entra na imagem, no build ou no Git.

## Rollback

- **Reverter o código:** Pull Request revertendo o commit em `main`. Dispara o pipeline normal e publica uma versão corrigida.
- **Reverter só a imagem:** quando o problema é a imagem e não o código, aponte a tag no manifesto do `infra-gitops` para a versão anterior; o ArgoCD detecta a divergência e resincroniza.
- **Tempo:** o rollback leva o tempo do pipeline mais o da sincronização, então não é instantâneo. Em incidente crítico, priorize o revert mais rápido.
