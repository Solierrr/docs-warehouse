# docs-warehouse

Repositório central de documentação e arquivos reutilizáveis da Solaria. Os diretórios `github/` e `templates/` guardam convenções, workflows e modelos que podem ser aplicados aos demais repositórios da organização.

## Templates

- [`templates/README.md`](./templates/README.md#matriz-por-tipo): matriz de arquivos por tipo de repositório e orientação para adaptar o `generic-template` completo.
- [`templates/http/`](./templates/http/): cliente HTTP local para documentar e executar chamadas contra APIs em desenvolvimento.
- [`templates/readme/`](./templates/readme/): modelos de README e arquitetura dos repositórios.
- [`templates/docker/`](./templates/docker/README.md): Dockerfiles e `.dockerignore` por stack, mais launcher de runtime opcional do Infisical.
- [`github/workflow/`](./github/workflow/): workflows reutilizáveis organizados por stack.
- [`github/repository-settings.md`](./github/repository-settings.md): padrão de configuração, rulesets, checks e metadados dos repositórios.
- [`readme/services/`](./readme/services/): um README por serviço, no padrão com banner e ícones da stack, em `readme/services/<nome-do-servico>.md`, para validar antes de ir para o repositório.
- [`readme/bruno/`](./readme/bruno/), [`readme/architecture/`](./readme/architecture/), [`readme/running/`](./readme/running/) e [`readme/deploy/`](./readme/deploy/): READMEs reutilizáveis por tipo de documento, ainda em construção.
- [`assets/readme/`](./assets/readme/README.md): banners e ícones de stack usados nos READMEs.

Ao copiar um template, adapte exemplos à implementação real do serviço e não versione credenciais ou dados sensíveis.
