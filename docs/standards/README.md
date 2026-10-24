# Padrões de serviço

Padrões que valem para todos os repositórios de código da organização. Cada repositório adota o padrão na própria tarefa de padronização; em caso de divergência entre um repositório e este documento, vale este documento.

| Padrão | Documento | Arquivos reutilizáveis |
|---|---|---|
| OpenAPI e Swagger | [OPENAPI.md](./OPENAPI.md) | [`github/openapi/spectral.yaml`](../../github/openapi/spectral.yaml), [`openapi-lint.yml`](../../.github/workflows/openapi-lint.yml) |
| Storybook | [STORYBOOK.md](./STORYBOOK.md) | [`storybook.yml`](../../.github/workflows/storybook.yml) |
| Contrato de erro | [ERRORS.md](./ERRORS.md) | [catálogo de erros](./ERROR_CODES.md) |
| Versão e release | [VERSIONING.md](./VERSIONING.md) | templates `release-please-config.*.json` em [`github/workflow/common/`](../../github/workflow/common/) |
| Autenticação entre serviços | [SERVICE_AUTH.md](./SERVICE_AUTH.md) | |
| Health checks | [HEALTH.md](./HEALTH.md) | |
