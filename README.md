# docs-warehouse

Repositório central de documentação e arquivos reutilizáveis da Solaria. Os diretórios `github/` e `templates/` guardam convenções, workflows e modelos que podem ser aplicados aos demais repositórios da organização.

## Padrões de serviço

Padrões normativos para todos os repositórios de código, em [`docs/standards/`](./docs/standards/README.md):

- [OpenAPI e Swagger](./docs/standards/OPENAPI.md): contrato gerado do código, `/docs` e `/openapi.json`, segurança, erros e lint com o [ruleset do Spectral](./github/openapi/spectral.yaml).
- [Storybook](./docs/standards/STORYBOOK.md): versão, addons, convenções de história e publicação. Storybooks publicados: [`lib-web`](https://solierrr.github.io/lib-web/) e [`web-app`](https://solierrr.github.io/web-app/).
- [Contrato de erro](./docs/standards/ERRORS.md) e [catálogo de erros](./docs/standards/ERROR_CODES.md): `ProblemDetail` com `errorCode` e a lista única de códigos.
- [Versão e release](./docs/standards/VERSIONING.md): versão do release visível em todo lugar, imagens com tag de versão e aviso na PR de release.
- [Autenticação entre serviços](./docs/standards/SERVICE_AUTH.md): `X-Service-Key`, nomes das chaves e ordem segura de troca.
- [Health checks](./docs/standards/HEALTH.md): vivo e pronto, o que entra no pronto e onde cada caminho é usado.

## Galeria de diagramas

A pasta [`gallery/`](./gallery/) gera o site publicado no GitHub Pages (ambiente `PREVIEW`) com a organização do repositório (React Flow, gerada a partir das pastas), a relação entre os serviços (Sigma.js, a partir de `gallery/data/services.json`, com os repositórios, os bancos, os ambientes de execução e os serviços gerenciados de que dependem) e os diagramas de arquitetura, sequência, fluxos de negócio e casos de uso (React Flow, a partir de `gallery/data/diagrams.json`). Esses diagramas vieram do board do Miro e foram atualizados para o que o código faz hoje. Cada um registra o que mudou em relação ao original. Cada serviço aparece com o ícone da sua stack, e o detalhe mostra as tecnologias na ordem da linha de ícones do README em `readme/services`. Os ícones da página são os SVGs do pacote `thesvg`, mapeados em `gallery/stackIcons.ts`. As imagens de `assets/readme` ficam só para os documentos Markdown. Para rodar localmente: `cd gallery && npm ci && npm run dev`. Ao criar ou remover um serviço, atualize `services.json`, incluindo o campo `icon` com um nome que exista em `stackIcons.ts`.

## Templates

- [`templates/README.md`](./templates/README.md#matriz-por-tipo): matriz de arquivos por tipo de repositório e orientação para adaptar o `generic-template` completo.
- [`templates/http/`](./templates/http/): cliente HTTP local para documentar e executar chamadas contra APIs em desenvolvimento.
- [`templates/readme/`](./templates/readme/): modelos de README e arquitetura dos repositórios.
- [`templates/docker/`](./templates/docker/README.md): Dockerfiles e `.dockerignore` por stack, mais launcher de runtime opcional do Infisical.
- [`github/workflow/`](./github/workflow/): workflows reutilizáveis organizados por stack, incluindo os templates do release-please por stack e os callers do lint do contrato OpenAPI e do Storybook.
- [`github/repository-settings.md`](./github/repository-settings.md): padrão de configuração, rulesets, checks e metadados dos repositórios.
- [`readme/repositories/`](./readme/repositories/): a documentação de cada repositório (`README.md`, `docs/`, `flows/`, `database/` e `assets/`), escrita aqui e revisada por Pull Request antes de ir para o repositório. O padrão está em [`docs/standards/DOCUMENTATION.md`](./docs/standards/DOCUMENTATION.md) e as convenções deste repositório em [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md).
- [`readme/services/`](./readme/services/): os repositórios que ficaram fora do padrão novo (`elos-*` e `generic-template`).
- [`docs/flows/`](./docs/flows/): os fluxos que passam por vários repositórios.
- [`readme/bruno/`](./readme/bruno/), [`readme/infisical/`](./readme/infisical/), [`readme/running/`](./readme/running/) e [`readme/deploy/`](./readme/deploy/): um documento por stack ou por tipo de deploy, para copiar direto para o repositório. A arquitetura é documentada por repositório, em `readme/repositories/<repositório>/docs/ARCHITECTURE.md`.
- [`assets/readme/`](./assets/readme/README.md): banners e ícones de stack usados nos READMEs.

Ao copiar um template, adapte exemplos à implementação real do serviço e não versione credenciais ou dados sensíveis.
