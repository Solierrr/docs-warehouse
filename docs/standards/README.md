# Padrões de serviço

Padrões que valem para todos os repositórios de código da organização. Cada repositório adota o padrão na própria tarefa de padronização; em caso de divergência entre um repositório e este documento, vale este documento.

| Padrão | Documento | Arquivos reutilizáveis |
|---|---|---|
| OpenAPI e Swagger | [OPENAPI.md](./OPENAPI.md) | [`github/openapi/spectral.yaml`](../../github/openapi/spectral.yaml), [`openapi-lint.yml`](../../.github/workflows/openapi-lint.yml) |
| Storybook | [STORYBOOK.md](./STORYBOOK.md) | [`preview-storybook.yml`](../../github/workflow/typescript/preview-storybook.yml) |
| Ambientes de preview | [PREVIEW.md](./PREVIEW.md) | [`preview-gallery.yml`](../../github/workflow/common/preview-gallery.yml), [`preview-storybook.yml`](../../github/workflow/typescript/preview-storybook.yml) |
| Contrato de erro | [ERRORS.md](./ERRORS.md) | [catálogo de erros](./ERROR_CODES.md) |
| Versão e release | [VERSIONING.md](./VERSIONING.md) | templates `release-please-config.*.json` em [`github/workflow/common/`](../../github/workflow/common/) |
| Autenticação entre serviços | [SERVICE_AUTH.md](./SERVICE_AUTH.md) | |
| Health checks | [HEALTH.md](./HEALTH.md) | |

## Documentação

| Padrão | Documento |
|---|---|
| Estrutura e conteúdo da documentação de cada repositório | [DOCUMENTATION.md](./DOCUMENTATION.md) |
| README dos repositórios | [REPOSITORY_README.md](./REPOSITORY_README.md) |
| Escrita | [WRITING.md](./WRITING.md) |
| Diagramas | [DIAGRAMS.md](./DIAGRAMS.md) |
| Assets | [ASSETS.md](./ASSETS.md) |
