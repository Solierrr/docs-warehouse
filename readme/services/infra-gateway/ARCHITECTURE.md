<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/kong.png" alt="Kong" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/helm.png" width="100" hspace="8" alt="Helm" title="Helm">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/render.png" width="100" hspace="8" alt="Render" title="Render">
</p>

# Arquitetura do Repositório

O `infra-gateway` guarda a configuração do Kong, o gateway que recebe as requisições destinadas às APIs da plataforma. A configuração existe em dois formatos, um por ambiente: em produção, o Kong é o ingress do cluster GKE, instalado pelo `infra-platform` com o Helm chart oficial e os valores deste repositório; em QA, onde não há cluster, o Kong roda sem banco de dados, como serviço Docker no Render, com as rotas declaradas num arquivo único.

- **Produção (`helm/`):** valores do Helm chart do Kong, com uma base comum e as diferenças de cada ambiente.
- **QA (`kong/` e `Dockerfile`):** configuração declarativa das rotas e imagem que a carrega no Render.
- **Inicialização (`docker-cmd.sh`):** comando de partida do container de QA.
- **Mesmo formato de rotas:** os caminhos expostos em QA seguem os de produção, para que os clientes não dependam do ambiente.
- **Sem código de aplicação:** o repositório só contém configuração.

## Estrutura do repositório

```text
├── .github/
├── docs/
├── helm/
│   ├── values-base.yaml
│   ├── values-dev.yaml
│   └── values-prod.yaml
├── kong/
│   └── kong.qa.yml
├── docker-cmd.sh
├── Dockerfile
├── Makefile
└── README.md
```
