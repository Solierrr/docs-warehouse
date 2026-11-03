# Testes

A equipe utilizou TDD no desenvolvimento, escrevendo o teste junto da mudança e refatorando com ele passando. Os repositórios de código têm testes unitários, que rodam no CI a cada Pull Request e a cada push na `main`. As contagens abaixo são de 2 de novembro de 2026.

## Ferramentas por camada

| Camada | Repositórios | Ferramentas |
|---|---|---|
| Serviços Java | `api-core`, `api-messenger`, `api-notify` | JUnit 5, Mockito, `MockMvc`, JaCoCo |
| Serviço Kotlin | `api-auth` | JUnit 5, Mockito, `MockMvc`, Spring Security Test, JaCoCo |
| Serviços e agentes Python | `api-recommendation`, `ai-assistant`, `ai-operational` | `pytest`, `pytest-asyncio`, `pytest-cov` |
| Scripts de banco | `database-console` | `unittest` |
| Aplicação web | `web-app`, `web-sandbox` | Vitest, Testing Library, jsdom |
| Biblioteca de componentes | `lib-web` | Vitest, `node:test`, testes de stories do Storybook |
| Worker de contingência | `worker-failover` | `node:test` |
| Aplicativo Android | `mobile-app` | JUnit 4, MockK, Turbine |

## Onde ficam os testes

| Repositório | Pasta | Arquivos de teste |
|---|---|---|
| `api-core` | `src/test/java` | 48 |
| `api-auth` | `src/test/kotlin` | 11 |
| `api-messenger` | `src/test/java` | 46 |
| `api-notify` | `src/test/java` | 18 |
| `api-recommendation` | `tests/unit` e `tests/integration` | 12 |
| `ai-assistant` | `tests/` | 51 |
| `ai-operational` | `tests/` | 54 |
| `database-console` | `tests/` | 3 |
| `web-app` | ao lado do código, `*.test.ts(x)` | 165 |
| `web-sandbox` | ao lado do código, `*.test.ts(x)` | 28 |
| `lib-web` | ao lado do código, `*.test.ts(x)` | 12 |
| `worker-failover` | ao lado do código, `*.test.ts` | 5 |
| `mobile-app` | `app/src/test` | 60 |

## CI e SonarQube

O workflow `ci.yml` de cada repositório executa os testes, e os serviços que usam banco sobem o banco como serviço do workflow. O CI publica a cobertura (JaCoCo, `coverage.xml` ou `lcov`), e o `api-recommendation` define cobertura mínima de 65% sobre `app/`. O workflow `sonarqube.yml` roda depois do CI com sucesso e envia o relatório ao SonarQube.

## Como rodar

O `Makefile` dos repositórios tem o alvo `make test`, e os repositórios TypeScript usam `npm test`. O ambiente local está descrito no `docs/RUNNING.md` de cada repositório.
