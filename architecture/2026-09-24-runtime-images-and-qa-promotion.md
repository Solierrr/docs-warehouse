# Design: imagem única por serviço e promoção QA → main

Status: aprovado para adoção gradual — piloto: `api-messenger`.

## Decisões

1. Cada serviço terá **um Dockerfile de aplicação** e uma `.dockerignore`
   independentes de ambiente. A imagem é o mesmo artefato em QA (Render) e
   produção (GKE); só valores de configuração e a plataforma de execução
   variam.
2. Secrets nunca entram em `ARG`, `ENV`, camadas de imagem, Git ou
   `.dockerignore`. A `.dockerignore` continua só reduzindo contexto e
   impedindo arquivos locais, como `.env` e `.git`, de seguirem para o build.
3. No Render, enquanto a limitação de folders do sync nativo do Infisical
   existir, o serviço pode usar Universal Auth **apenas em runtime**, nunca
   durante o build. Isso é uma exceção transitória por serviço, documentada
   e limitada a `INFISICAL_CLIENT_ID` e `INFISICAL_CLIENT_SECRET` no Render.
4. No GKE, secrets são entregues ao pod como `Secret`/`envFrom` pelo
   repositório GitOps. O container não precisa conhecer Terraform, Argo CD,
   Render ou credenciais de máquina do Infisical.
5. A correção definitiva da exceção Render é fornecer as variáveis de
   runtime pelo próprio Render (grupo/variáveis por serviço) ou por uma
   integração que caiba no plano contratado. Nesse momento o CLI e o
   entrypoint de Infisical saem do serviço.

## Por que não manter Dockerfiles por ambiente

Dois Dockerfiles fariam QA e produção compilarem artefatos potencialmente
diferentes. Isso enfraquece a promoção: um deploy aprovado no Render não
seria a mesma imagem que chega ao GKE. Quando há uma necessidade transitória
de bootstrap de secret, ela fica isolada no entrypoint de runtime e é ativada
somente se as credenciais correspondentes existirem; a aplicação continua com
o mesmo JAR, porta, usuário e health check.

Não usar `ARG` para selecionar ambiente. No Render, variáveis de ambiente
podem se tornar build arguments; secret em build argument pode ficar na
imagem. O ambiente deve ser decidido no deploy, por variáveis de runtime e
manifests.

## Padrão de secrets por ambiente

| Ambiente | Entrega de configuração | Imagem |
| --- | --- | --- |
| Local | `make env ENV=local` / `extract-env`; arquivo local ignorado pelo Git | imagem opcional para teste |
| QA (Render) | variáveis do serviço/grupo Render; excepcionalmente Universal Auth no runtime | mesma imagem publicada/validada |
| Produção (GKE) | `Secret` referenciado por `infra-gitops`; sincronização de provider fica fora do app | mesma imagem, tag imutável |

O aviso de uma integração de secrets estar "out of date" é estado da
sincronização de configuração, não um diagnóstico do Docker build. Ele não
deve ser mascarado por uma imagem que busca secrets em build.

## Incidente: api-messenger em 23/09/2026

O deploy `dep-daq74o0jo6nc73dc3jl0` falhou na construção, antes de executar o
JAR ou o entrypoint:

```text
E: Unable to locate package infisical
```

O Dockerfile da branch `qa` ainda usa
`dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh`. O repositório
Cloudsmith do CLI foi descontinuado pelo Infisical em 16/09/2026. Se a ponte
transitória continuar, ela deve trocar para
`https://artifacts-cli.infisical.com/setup.deb.sh`, fixar a versão do CLI e
ter fallback explícito para executar a aplicação diretamente quando não houver
credenciais Infisical. A migração para variáveis de runtime Render elimina
essa dependência do Dockerfile.

## Promoção de branches

O fluxo atual possui commits de produto em `qa` e atualizações de plataforma
em `main`. Portanto, uma sincronização em massa não pode fazer merge cego:
ela pode promover código de debug ou reintroduzir configuração obsoleta.

Fluxo alvo:

1. PR de feature/fix entra em `main` após CI.
2. O workflow `qa-sync` abre uma PR de `main` para `qa`; o merge faz o Render
   testar exatamente o commit promovido.
3. Depois de aprovação em QA, o release/tag de `main` é a promoção para GKE;
   o deploy de produção usa tag imutável, não `latest`.

Para o estado já divergente, tratar serviço a serviço:

1. revisar alterações exclusivas de `qa`;
2. abrir PR `qa` → `main` somente para mudanças aprovadas;
3. resolver conflitos, especialmente arquivos de CI, release e Docker;
4. após o merge, deixar `qa-sync` levar `main` de volta para `qa`.

`ai-assistant` exige uma recuperação específica: suas branches `main` e `qa`
não têm ancestral comum. Ele não pode entrar em PR automático até escolhermos
a branch canônica e reconstruirmos a outra a partir dela com revisão humana.

## Critérios de aceite

- O mesmo hash/tag de imagem é elegível para Render e GKE.
- Nenhum segredo aparece em `docker history`, logs de build, Git ou
  manifests versionados.
- Um serviço sem credenciais de Universal Auth inicia normalmente com as
  variáveis injetadas pela plataforma.
- `qa-sync` permanece unidirecional (`main` → `qa`); promoção excepcional de
  `qa` → `main` sempre é uma PR revisada.
