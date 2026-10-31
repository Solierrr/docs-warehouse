# Checklist: `api-recommendation`

Tipo `api`. Repositório de origem em https://github.com/Solierrr/api-recommendation (só leitura). A documentação é escrita em `readme/repositories/api-recommendation/` deste repositório, numa branch `docs/api-recommendation`.

## O que já existe aqui

- `README.md`, no padrão antigo. Revisar contra o padrão novo, sem descartar o que estiver certo.
- `docs/ARCHITECTURE.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/FEEDS.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: feeds de profissionais, ofertas e fornecedores.
- Dados: Neo4j `feeddb` (`DB_NEO4J_URI`) e `coredb` somente leitura como fallback.
- Chama: nenhum serviço.
- Chamado por: `mcp-database` (`RECOMMENDATION_API_URL`, `RECOMMENDATION_API_KEY`; com a [mcp-database#34](https://github.com/Solierrr/mcp-database/pull/34), também `X-Service-Key` lido de `SERVICE_KEY`, aceito pelo destino com `SERVICE_KEY_MCP_DATABASE` na [api-recommendation#52](https://github.com/Solierrr/api-recommendation/pull/52)) e `web-sandbox`.
- Saúde: `/health` e `/ready` na [api-recommendation#52](https://github.com/Solierrr/api-recommendation/pull/52) (antes `/health/live` e `/health/ready`).
- Ambientes: QA ✅; PROD ✅ (Neo4j no `statefulset` do `feeddb`).
- Lacunas: nem o `web-app` nem o `mobile-app` consomem os feeds; `qa` e `main` divergentes (main +28, qa +9, 131 arquivos).

## Checklist

- [ ] Branch `docs/api-recommendation` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `fastapi` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/API.md`, apontando o `openapi.yaml` e o Swagger, sem copiar o contrato.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `OFFER_FEED.md`, `PROFESSIONAL_FEED.md`, `SUPPLIER_FEED.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` montado a partir do schema real, com um arquivo para cada banco do repositório. Esperado pelo levantamento NEO4J (feeddb).
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the api-recommendation repository` aberta para a `main`, sem merge, e o link enviado ao dono.
