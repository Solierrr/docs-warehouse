# Deployment de Serviços

O deploy é **padronizado para todos os repositórios da organização** e acontece **automaticamente** a partir das duas principais branches `main` e `qa`, sem passos manuais. O fluxo segue sempre a mesma ordem: CI valida a mudança, o workflow de release publica a imagem no Docker Hub de [solarianetwork](https://hub.docker.com/u/solarianetwork?_gl=1*tqq1lx*_gcl_au*MjAzODE4OTYxMi4xNzg4MDU0MjEyLjE4NDMxOTAzMDUuMTc4ODA1NDIzOS4xNzg4MDU0MjcwLjc2ODUzNjYyLjE3ODgwNTQyMzkuMTc4ODA1NDI3MA..*_ga*MTI0NTI4MjE1My4xNzg4MDU0MjEz*_ga_XJWPQMJYHQ*czE3ODg1MTU1OTUkbzQkZzEkdDE3ODg1MTU2MzIkajIzJGwwJGgw) e o [ArgoCD]() sincroniza o cluster GKE com a nova versão automaticamente.

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=docker,kubernetes,githubactions,github,render,argocd,gcp" height="48" alt="Deployment">
  </a>
</p>

## Repositórios de Infraestrutura IaC

A organização utiliza o [ArgoCD](https://argoproj.github.io/cd/) como principal ferramenta IaC, e para controle de custos com Cloud, foi decidido o uso de Terraform para facilitar a implementação do cluster (assim, podemos subir e derrubar o cluster a todo momento, incluindo um [script](https://github.com/Solierrr/infra-platform/blob/main/scripts/toggle-nodes.ps1) para zerar os nodes do GKE).

- [Infra-platform](https://github.com/Solierrr/infra-platform), Repositório de IaC de definição do cluster. Voltado exclusivamente para o Google Cloud.
- [Infra-gitops](https://github.com/Solierrr/infra-gitops), Repositório de IaC de configuração do Kubernetes.
- [Infra-gateway](https://github.com/Solierrr/infra-gateway), Repositório de IaC de configuração do Kong.

## Pipeline de Deploy

1. [Docker Publish](docker-publish.yml) **(`docker-publish.yml`)**, workflow global definido no [repositório compartilhado](https://github.com/Solierrr/.github), roda após toda Pull Request com alvo na `main`.
2. **Release (`release.yml`)**, disparado por push em `main`, builda a imagem a partir do `Dockerfile` do repositório e publica no registry da organização.
3. **ArgoCD**, detecta a nova tag da imagem e sincroniza o manifesto do repositório de infraestrutura, aplicando o deploy no cluster sem intervenção manual.

## Deploy PROD

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=terraform,gcp,argocd" height="48" alt="Deployment">
  </a>
</p>

Para o deploy em **Produção** funcionar, é necessário que o **cluster GKE** esteja em pé. Caso o mesmo não esteja, prossiga com `terraform apply` no [repositório de plataforma](https://github.com/Solierrr/infra-platform).

```
git clone https://github.com/Solierrr/infra-platform.git
cd infra-platform

terraform init
terraform plan
terraform apply
```

Caso o cluster estejano ar, apenas o merge na branch `main` é o suficiente para acionar o **ArgoCD** e sincronizar os pods.

## Deploy QA

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=render,github" height="48" alt="Deployment">
  </a>
</p>

Para o deploy em **Ambiente de Teste** funcionar, é necessário apenas subir um commit na branch `qa`. O deploy é automático via **last commit** no [Render](https://render.com).

## Publicação Automática de Releases

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=github,githubactions" height="48" alt="Deployment">
  </a>
</p>

As releases são alteradas automáticamente via pipeline, então após todo commit `fix:`, `feat´:` e `feat!:`, o workflow é acionado e ao ser disparado, influencia na versão do release do repositório..

## Verificação do Dockerfile

Todo `Dockerfile` da organização segue **build multi-stage**: um estágio `build` com o toolchain completo da stack (Maven, npm, pip) gera o artefato, e a imagem final parte de uma base enxuta contendo só o runtime, reduzindo tamanho e superfície de ataque da imagem publicada. Use o template correspondente à stack como base em vez de escrever um `Dockerfile` do zero

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=maven,apache,node,python" height="48" alt="Deployment">
  </a>
</p>

- **Maven** [`templates/docker/jvm-maven/Dockerfile`](../docker/jvm-maven/Dockerfile), `eclipse-temurin:21-jdk` compila com `./mvnw package -DskipTests`, a imagem final roda em `eclipse-temurin:21-jre` só com o `app.jar`.
- **Node** [`templates/docker/typescript/Dockerfile`](../docker/typescript/Dockerfile), `node:22-alpine` builda com `npm ci && npm run build`, a imagem final serve o `dist/` estático em `nginx:alpine`.
- **Python** [`templates/docker/python/Dockerfile`](../docker/python/Dockerfile), instala `requirements.txt` e roda direto sobre `python:latest` (sem estágio de build separado, já que não há artefato compilado).

Nenhum segredo é embutido na imagem em build-time e variáveis de ambiente e credenciais são injetadas em runtime pelo manifesto do Kubernetes (repositório [Infra-gitops](https://github.com/Solierrr/infra-gitops)).

## Secrets

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=kubernetes,docker,googlecloud" height="48" alt="Deployment">
  </a>
</p>

Considerando o nosso cenário de **cluster efêmero**, decidimos utilizar um vault para centralizar as secrets e facilitar a distribuição nos serviços. O vault em questão utilizado foi o [Infisical](https://infisical.com), pois possui um limite gratuito, assim não houve necessidade da abordagem de mais um cluster fora do escopo efêmero.

## Rollback

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=github,git,argocd" height="48" alt="Deployment">
  </a>
</p>

- **Revert do código**, abra um Pull Request revertendo o commit problemático em `main`. Isso dispara o fluxo de pipeline normal, publicando uma versão corrigida.
- **Rollback via ArgoCD**, se a imagem já publicada é o problema (e não o código-fonte), o rollback pode ser feito direto no manifesto do [Infra-gitops](https://github.com/Solierrr/infra-gitops), apontando a tag da imagem para a versão anterior, assim o ArgoCD detecta a divergência e resincroniza o cluster automaticamente.
- **Impacto esperado**, como o deploy é automático a partir de `main` / `qa`, o tempo de rollback é o tempo do pipeline (build + sync do ArgoCD), portanto não é instantâneo, trate incidentes críticos priorizando o revert mais rápido possível.

## 
