<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/infisical.png" alt="Infisical" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/render.png" width="100" hspace="8" alt="Render" title="Render">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
</p>

# Segredos e variáveis de ambiente

Explica onde ficam os segredos da plataforma, quem os lê em cada ambiente e como um repositório novo passa a usá-los. A ferramenta é o [Infisical](https://infisical.com), um cofre de segredos com plano gratuito. Como o cluster de produção é efêmero (sobe e desce conforme o custo), os segredos não podem morar dentro dele nem em arquivos versionados: eles ficam num cofre externo e cada ambiente os recebe do seu jeito.

## Como o cofre está organizado

- **Um projeto, três ambientes:** `local`, `qa` e `prod`. A conta pessoal (`infisical login`) só é usada na máquina de quem desenvolve; CI, Render e GKE usam identidades de máquina próprias, nunca um token pessoal.
- **Pastas por tecnologia, não por serviço.** Banco, cache, armazenamento e chaves de terceiros são usados por mais de um serviço, e uma pasta por serviço duplicaria o valor. Configuração de negócio de um serviço só ganha pasta própria, nomeada pelo que ela representa (`recommendation`, `mcp`), nunca pelo nome do repositório.
- **Os nomes das variáveis são os mesmos do `.env.example`** de cada repositório, sem tradução entre um e outro.

| Pasta | O que guarda |
|---|---|
| `/database` | Postgres, Mongo e Neo4j: credenciais da instância compartilhada e o nome do banco de cada consumidor |
| `/redis` | Instâncias de Redis (host, porta, usuário e senha por instância) |
| `/cloudinary` | Conta de imagens |
| `/google` | Chaves de Maps, Translate e Calendar |
| `/llm` | Chaves e parâmetros dos modelos de linguagem |
| `/auth` | Emissor e chaves de JWT, Firebase e segredos entre serviços |
| `/otel` | Destino e amostragem da observabilidade |
| `/databricks` | Acesso ao Databricks |
| `/vite` | Variáveis públicas do front-end |
| `/service-urls` | Endereço de um serviço para o outro, com um valor por ambiente |

A lista completa, com as variáveis de cada pasta, está nos modelos mestres em [`templates/infisical/`](../../templates/infisical/) (um arquivo por ambiente; o de nome `dev` descreve o ambiente local). Todos os valores são vazios de propósito: eles servem para conferir o que existe e popular o cofre, não para rodar.

## Como cada ambiente recebe os segredos

| Ambiente | Entrega | Observação |
|---|---|---|
| Local | `make vault` grava um `.env` ignorado pelo Git | Usa o login pessoal no Infisical |
| QA (Render) | Variáveis do serviço ou do grupo no Render | Exceção transitória: Universal Auth em runtime, descrita abaixo |
| Produção (GKE) | `Secret` do Kubernetes, referenciado pelo `infra-gitops` e criado pelo Terraform do `infra-platform` | O container não conhece o Infisical |

A imagem Docker é a mesma em QA e produção; o que muda é só a configuração injetada no deploy. Por isso o ambiente nunca é escolhido por `ARG` no build.

## Rodando localmente

Pré-requisitos: Infisical CLI instalado e acesso da sua conta ao projeto.

```bash
infisical login
make doctor
make vault
```

- `make doctor` confere as ferramentas e se há uma sessão ativa no Infisical.
- `make vault` lê as pastas listadas em `VAULT_FOLDERS` no `Makefile` do repositório e grava o `.env`. Para outro ambiente, use `make vault ENV=qa`; para outro arquivo, `OUT=.env.qa`.
- Se a leitura falhar ou voltar vazia, o `.env` que já existe **não é alterado**.
- O `Makefile` padrão e o fragmento da stack estão em [`templates/make/`](../../templates/make/README.md).

## Em runtime no Render (exceção transitória)

Enquanto o sync nativo do Infisical com o Render não cobrir as pastas, um serviço pode usar o launcher [`entrypoint.sh`](../../templates/docker/common/entrypoint.sh):

1. Se `INFISICAL_CLIENT_ID` e `INFISICAL_CLIENT_SECRET` existem, o launcher faz login por Universal Auth e executa o comando da aplicação dentro de `infisical run` (ambiente `qa` por padrão, trocável por `INFISICAL_ENV`).
2. Se não existem, executa o comando direto, com as variáveis que a plataforma já injetou.

Essas duas credenciais são as únicas permitidas nessa exceção, e valem **só em runtime**. A imagem precisa ter o Infisical CLI para o caminho 1 funcionar. A correção definitiva é o Render fornecer as variáveis por conta própria; nesse dia o CLI e o launcher saem do serviço. O contexto da decisão está em [`architecture/2026-09-24-runtime-images-and-qa-promotion.md`](../../architecture/2026-09-24-runtime-images-and-qa-promotion.md).

## Regras

- Segredo nunca entra em `ARG`, `ENV`, camada de imagem, Git ou `.dockerignore`. O `.dockerignore` só impede que `.env` e `.git` sigam para o build.
- `.env` e arquivos locais ficam fora do Git; o `.env.example` é versionado, com os nomes e **sem valores**.
- Variáveis `VITE_*` são públicas e vão para o navegador, então nunca recebem chave interna.
- Um repositório só lista no `.env.example` o subconjunto de variáveis que ele de fato lê.
- Serviço novo: crie a pasta no Infisical só se a configuração não couber numa pasta de tecnologia existente, preencha os três ambientes e registre as pastas em `VAULT_FOLDERS`.

## Problemas comuns

- **"Infisical CLI not installed" ou "No active Infisical session":** instale o CLI e rode `infisical login`.
- **"Failed to extract" ou "No secrets returned":** confira se a sua conta tem acesso ao projeto, se o `ENV` existe e se a pasta está preenchida.
- **Aviso de integração "out of date" no Render:** é o estado da sincronização de configuração, não uma falha de build do Docker.

## Veja também

- [Como rodar um serviço localmente](../../helps/TRY-LOCAL.md)
- [Design de segredos e ambientes](../../architecture/2026-09-03-secrets-and-envs-design.md)
- [Deploy em QA no Render](../deploy/QA_RENDER.md) e [deploy em produção no GKE](../deploy/PROD_GKE_ARGOCD.md)
