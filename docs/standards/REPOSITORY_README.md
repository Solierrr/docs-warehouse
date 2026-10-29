# README dos repositórios

O `README.md` é a central do repositório. Ele abre com o contexto e só roteia para os outros documentos. O exemplo completo é o do [`api-notify`](../../readme/repositories/api-notify/README.md).

## Ordem

1. Banner da stack principal.
2. Linha de ícones da stack, sem repetir a stack do banner.
3. Título.
4. Badges.
5. Dois parágrafos de contexto.
6. `## Aprofunde-se no Projeto!`
7. `## Contribuindo`

Nada além dessas seções. O que for específico do repositório vira um documento em `docs/` e entra no "Aprofunde-se".

## Banner

- Um por repositório, pela stack principal. É o framework quando existe banner dele (Spring Boot, FastAPI, React, Storybook), senão a linguagem ou a plataforma (Kotlin, Terraform, Argo CD, Cloudflare Workers, Databricks).
- Só arquivos do [catálogo de assets](../../assets/readme/README.md). Nada de nome inventado nem `.jpg`.
- O arquivo é copiado para `assets/readme/banners/<nome>.png` dentro da pasta do repositório e referenciado pelo caminho relativo.

```html
<p align="center">
  <img src="./assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>
```

- O `alt` é o nome da stack, nunca o do projeto.

## Ícones da stack

- Um `<img>` por tecnologia, num único `<p align="center">`, sempre com `width="100" hspace="8"` e `alt` e `title` com o nome da tecnologia. Sem texto visível e sem tabela.
- Os arquivos são copiados de `assets/readme/stacks/` para `assets/readme/stacks/` da pasta do repositório, com o mesmo nome, e referenciados como `./assets/readme/stacks/<nome>.png`.
- A ordem é linguagem, framework, dados, API e testes, observabilidade e entrega. No máximo 7 ícones. Se passar disso, cortar o menos relevante.
- A linha nunca repete a stack do banner. Se só sobra a stack do banner, a linha sai.
- Só entra tecnologia confirmada no código (`pom.xml`, `requirements.txt`, `pyproject.toml`, `package.json`, `Dockerfile`, workflows). Se não houver ícone no catálogo, a tecnologia fica de fora, sem substituto parecido.
- Repositório `api-` sempre leva `swagger` e `bruno`, nessa ordem, depois da linguagem, do framework e dos dados.
- `docker`, `github-actions` e `opentelemetry` só entram em repositório `infra-`.

## Título

Frase curta em português, com no máximo 5 palavras, dizendo o que o repositório é. Não repete o nome do repositório. O `api-messenger` vira "Central de mensagens".

## Badges

Quatro, nesta ordem, logo abaixo do título: License, Last Commit, Pull Requests e Release.

```markdown
[![License](https://img.shields.io/github/license/Solierrr/<repo>)](https://github.com/Solierrr/<repo>/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/<repo>)](https://github.com/Solierrr/<repo>/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/<repo>)](https://github.com/Solierrr/<repo>/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/<repo>)](https://github.com/Solierrr/<repo>/releases)
```

## Contexto

- Dois parágrafos com 60 palavras ou mais no total.
- O primeiro é para quem não é da área técnica e explica por que o repositório existe, para quem e que problema resolve.
- O segundo é um pouco mais técnico e explica onde ele se encaixa, com as integrações e as tecnologias conhecidas que explicam o funcionamento (Firebase, JWT, PostgreSQL, Redis).
- Nenhum nome do sistema no contexto, como nome de rota, tabela, classe, fila, variável ou feature interna.
- O texto não menciona o "Aprofunde-se", que já aparece logo abaixo.

## Aprofunde-se no Projeto!

Um item por documento, com link relativo e uma frase do que a pessoa encontra nele.

```markdown
- [OVERVIEW.md](./docs/OVERVIEW.md), o que o serviço oferece e as regras de negócio.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md), organização do código, integrações e decisões técnicas.
- [RUNNING.md](./docs/RUNNING.md), como executar e testar localmente.
```

Os fluxos e o banco entram como um item cada, apontando a pasta (`./flows/`, `./database/`).

## Contribuindo

Aponta para os arquivos do repositório `.github` da organização.

```markdown
- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar uma vulnerabilidade.
```

## Escrita

O README segue o [padrão de escrita](./WRITING.md).
