<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/{stack-principal}.png" alt="{Stack principal}" width="100%">
</p>

<!-- Ícones da stack: centralizados, sem texto, um <img> por tecnologia (width="100"), na ordem linguagem, framework, dados, API e testes, observabilidade, entrega. Todo repositório `api-` leva os ícones swagger e bruno. Docker, GitHub Actions e OpenTelemetry só em repositório `infra-`. Nomes de arquivo em assets/readme/README.md. -->
<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/{stack-1}.png" width="100" alt="{Stack 1}" title="{Stack 1}">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/{stack-2}.png" width="100" alt="{Stack 2}" title="{Stack 2}">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/{stack-3}.png" width="100" alt="{Stack 3}" title="{Stack 3}">
</p>

# {Significado do serviço, no máximo 5 palavras, sem repetir o nome do repositório}

[![License](https://img.shields.io/github/license/Solierrr/{repositorio})](https://github.com/Solierrr/{repositorio}/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/{repositorio})](https://github.com/Solierrr/{repositorio}/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/{repositorio})](https://github.com/Solierrr/{repositorio}/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/{repositorio})](https://github.com/Solierrr/{repositorio}/releases)

Texto de contexto do serviço em português, legível por quem não é da área técnica: o que o serviço faz, para quem e por que existe. Evite termos técnicos, siglas e nomes de rotas ou tabelas, e nunca escreva o nome do projeto nem da organização (use "o projeto", "a plataforma", "a organização" ou "o repositório"); esses detalhes ficam no `ARCHITECTURE.md`. Mínimo de 60 palavras.

## Aprofunde-se no Projeto!

- {link do arquivo de arquitetura}
- {link do arquivo de como rodar}
- {link do arquivo de deployment}
- Se o serviço usa container, documente a imagem em `Dockerfile` e mantenha `.dockerignore` alinhado à stack. O launcher `entrypoint.sh` é opcional e pode iniciar o comando sob Infisical em runtime quando Universal Auth estiver configurado.
- Se o repositório tiver uma coleção de chamadas locais, consulte [`http/README.md`](./http/README.md) para executar e manter o cliente HTTP da API.

## Contribuindo

- [CONTRIBUTING.md](./CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](./SECURITY.md), como reportar vulnerabilidades de segurança.
