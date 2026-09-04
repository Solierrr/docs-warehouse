<!--
  Template de README padrão da org Solierrr.
  Como usar: copie este arquivo pra raiz do repo como README.md e troque
  todo texto entre <> (inclusive os comentários HTML, que não aparecem
  renderizados). Ícones de stack vêm do skill-icons
  (https://github.com/tandpfun/skill-icons) via https://skillicons.dev -
  troque a lista depois de "?i=" pelos icons reais usados no projeto (ver
  https://github.com/tandpfun/skill-icons#icons-list para os slugs
  disponíveis, ex: java, spring, postgres, mongodb, redis, docker, kotlin,
  python, react, ts...).
-->

<div align="center">

# <nome-do-repo>

<subtítulo curto de uma linha — o que esse serviço faz>

<p>
  <a href="https://github.com/Solierrr/<nome-do-repo>/releases">
    <img alt="Release" src="https://img.shields.io/github/v/release/Solierrr/<nome-do-repo>?style=flat-square">
  </a>
  <a href="https://github.com/Solierrr/<nome-do-repo>/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
  </a>
  <a href="https://github.com/Solierrr/<nome-do-repo>/actions/workflows/release.yml">
    <img alt="Build" src="https://img.shields.io/github/actions/workflow/status/Solierrr/<nome-do-repo>/release.yml?branch=main&style=flat-square">
  </a>
</p>

<p>
  <img src="https://skillicons.dev/icons?i=<icon1>,<icon2>,<icon3>,<icon4>,docker" alt="Stack" />
</p>

</div>

## Índice

- [Sobre](#sobre)
- [Stack](#stack)
- [Como rodar local](#como-rodar-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Testes](#testes)
- [Ambientes e deploy](#ambientes-e-deploy)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Sobre

<2-4 frases: o que o serviço faz, que problema resolve, quem consome ele
(outros serviços internos? o web-app? um cron?). Se fizer parte de um fluxo
maior, linkar o serviço consumidor/consumido.>

## Stack

| Camada | Tecnologia |
|---|---|
| <ex: Linguagem> | <ex: Java 21 / Kotlin / Python 3.14 / TypeScript> |
| <ex: Framework> | <ex: Spring Boot / FastAPI / Vite> |
| <ex: Banco> | <ex: PostgreSQL / MongoDB / Neo4j> |
| <ex: Cache> | <ex: Redis (Upstash)> |
| <ex: Deploy> | Docker + GKE (prod) / Render (QA) |

## Como rodar local

Pré-requisitos: <ex: JDK 21 + Maven>, [Infisical CLI](https://infisical.com/docs/cli/overview).

1. Instale o Infisical CLI e rode `infisical login`.
2. Na raiz do repo, rode `infisical init` (uma vez só) e escolha o projeto do time.
3. Suba o serviço com:

   ```bash
   infisical run --env=dev --path=/ --recursive -- <comando de start, ex: ./mvnw spring-boot:run>
   ```

Não é preciso copiar `.env.example` pra `.env` manualmente — o Infisical injeta as variáveis em runtime.

## Variáveis de ambiente

Fonte de verdade é o [Infisical](https://infisical.com) (ambientes `dev`/`qa`/`prod`). O [`.env.example`](.env.example) deste repo documenta quais variáveis existem, agrupadas pelas mesmas pastas do Infisical.

## Testes

```bash
<comando de teste, ex: ./mvnw test>
```

## Ambientes e deploy

| Ambiente | Onde roda | Branch |
|---|---|---|
| Local | máquina do dev | qualquer |
| QA | Render | `qa` |
| Produção | GKE (GCP) | `main` |

Merge sempre pra `qa` primeiro — nunca direto pra `main` (ver
[orientações de Git da org](https://github.com/Solierrr/docs-warehouse)).

## Estrutura do projeto

```
<árvore resumida das pastas principais, ex:>
src/
  main/
    java/...     # código da aplicação
    resources/   # application.properties, migrations
  test/
```

## Contribuindo

1. Crie uma branch a partir de `qa`: `tipo/descricao-curta` (ex: `feat/nome-da-feature`).
2. Commits no padrão `tipo: mensagem` (inglês, minúsculo, sem escopo).
3. Abra PR pra `qa` preenchendo o [template de PR](.github/pull_request_template.md).

## Licença

Distribuído sob a licença MIT. Ver [`LICENSE`](LICENSE) pra mais detalhes.
