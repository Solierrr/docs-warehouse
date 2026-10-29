# Checklist: `api-google`

Tipo `api`. Repositório de origem em https://github.com/Solierrr/api-google (só leitura). A documentação é escrita em `readme/repositories/api-google/` deste repositório, numa branch `docs/api-google`.

## O que já existe aqui

- `README.md`, no padrão antigo. Revisar contra o padrão novo, sem descartar o que estiver certo.
- `docs/ARCHITECTURE.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/STATUS.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: concentra credenciais e chamadas às APIs Google.
- Externos: Maps, Translation, Calendar e Solar; deixou de entregar chaves de LLM em 2026-10-18.
- Chama: `api-auth` (JWKS; `auth_base_url` para o token do Calendar, rota ainda inexistente).
- Chamado por: `api-core` (tradução), `ai-geographic` (`REGISTRY_URL`; envia `X-Service-Key` desde a [ai-geographic#29](https://github.com/Solierrr/ai-geographic/pull/29), aguardando revisão, e ainda o Bearer do `REGISTRY_CONSUMER_TOKEN` enquanto ele existir), `mobile-app` no flavor `qa` e `web-sandbox`.
- Ambientes: QA ✅; PROD ✅ nos manifestos, interno (ClusterIP); segredos incompletos no `prod`.
- Padronização ([api-google#30](https://github.com/Solierrr/api-google/pull/30), aguardando revisão): rotas de serviço em `/internal` com `X-Service-Key` (`POST /internal/i18n/translate` para o `api-core`, `GET /internal/solar/roof-viability` para o `ai-geographic`), `/v1/address` e `/v1/geo` com o JWT do usuário, Swagger em `/docs`, contrato em `/openapi.json`, `/health` e `/ready`. As rotas `/v1/i18n/translate` e `/v1/solar/roof-viability` ficam abertas até os chamadores trocarem.
- Lacunas: o flavor `prod` do `mobile-app` tem `GOOGLE_REGISTRY_BASE_URL` vazio e, em PROD, o serviço nem é exposto, então o app precisa passar por outro serviço ou o serviço precisa de Ingress (decisão); cadeia de PRs de rotas, clima e Calendar aberta (#24, #25 e #26); o nome diverge entre repositório (`api-google`), Render, imagem, `infra-gitops` e Terraform (`google-registry`).

## Checklist

- [ ] Branch `docs/api-google` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `google` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/API.md`, apontando o `openapi.yaml` e o Swagger, sem copiar o contrato.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `ADDRESS_LOOKUP.md`, `TRANSLATION.md`, `ROOF_VIABILITY.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` não se aplica, a menos que o código mostre um banco próprio. Nesse caso, documentar e registrar no `PENDENCIAS.md`.
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the api-google repository` aberta para a `main`, sem merge, e o link enviado ao dono.
