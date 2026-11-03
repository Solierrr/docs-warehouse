# Testes

Os repositórios de código da organização têm testes automatizados que rodam no CI a cada Pull Request e a cada push na `main`, e cada stack usa a ferramenta própria da sua linguagem. Este documento registra o que existe hoje na `main` de cada repositório, com as contagens de 2 de novembro de 2026.

## Visão geral

O padrão de testes da organização tem quatro partes.

- Os testes ficam no mesmo repositório do código e mudam junto com ele, normalmente no mesmo commit da funcionalidade ou da correção.
- O CI roda a suíte inteira em toda Pull Request, e os repositórios com dependência de banco sobem o banco como serviço do workflow em vez de simulá-lo.
- A cobertura é medida com JaCoCo (Java e Kotlin), `pytest-cov` (Python) e V8 (Vitest), e o relatório segue para o SonarQube em um workflow separado, que só roda depois que o CI termina com sucesso.
- O único limite mínimo de cobertura que quebra o CI é o do `api-recommendation`, de 65% sobre `app/`. Nos demais repositórios a cobertura é medida e publicada, mas não reprova a Pull Request por si só.

## Ferramentas por camada

| Camada | Repositórios | Ferramentas |
|---|---|---|
| Serviços Spring em Java | `api-core`, `api-messenger`, `api-notify` | JUnit 5, Mockito, Spring Boot Test (`MockMvc`), JaCoCo |
| Serviço Spring em Kotlin | `api-auth` | `kotlin-test-junit5`, JUnit 5, Mockito, `MockMvc`, Spring Security Test, JaCoCo |
| Serviços e agentes em Python | `api-recommendation`, `ai-assistant`, `ai-operational` | `pytest`, `pytest-asyncio` (modo automático), `pytest-cov` |
| Scripts de banco em Python | `database-console` | `unittest` da biblioteca padrão |
| Aplicação web | `web-app`, `web-sandbox` | Vitest, Testing Library (React), `jest-dom`, jsdom |
| Biblioteca de componentes | `lib-web` | Vitest com jsdom, `node:test` para a observabilidade, testes de stories do Storybook |
| Worker de contingência | `worker-failover` | `node:test` |
| Aplicativo Android | `mobile-app` | JUnit 4, MockK, Turbine, `kotlinx-coroutines-test` |

No `web-app` e no `lib-web`, as stories do Storybook também rodam como teste. O addon `@storybook/addon-vitest` executa cada story em um Chromium controlado pelo Playwright, de modo que a interação descrita na story vira uma verificação automática. O Playwright aparece só nesse papel, e nenhum repositório tem suíte de ponta a ponta separada.

## Onde ficam os testes

| Repositório | Pasta | Arquivos de teste | Observação |
|---|---|---|---|
| `api-core` | `src/test/java`, espelhando os pacotes de `src/main/java` | 48 | `ProjectPostgresIntegrationTest` valida as entidades contra um Postgres real |
| `api-auth` | `src/test/kotlin` | 11 | |
| `api-messenger` | `src/test/java` | 46 | usa MongoDB e Redis no CI |
| `api-notify` | `src/test/java` | 18 | usa MongoDB no CI |
| `api-recommendation` | `tests/unit` e `tests/integration` | 9 unitários e 3 de integração | a integração usa Neo4j e Postgres |
| `ai-assistant` | `tests/`, uma pasta por módulo de `src/` | 51 | |
| `ai-operational` | `tests/`, uma pasta por módulo de `src/` | 54 | |
| `database-console` | `tests/` | 3 | |
| `web-app` | ao lado do código, em `*.test.ts` e `*.test.tsx` | 165 | mais 86 arquivos de stories |
| `web-sandbox` | ao lado do código, em `*.test.ts` e `*.test.tsx` | 28 | |
| `lib-web` | ao lado do código, em `*.test.ts` e `*.test.tsx` | 12 | mais 18 arquivos de stories |
| `worker-failover` | ao lado do código, em `*.test.ts` | 5 | |
| `mobile-app` | `app/src/test` | 60 | `app/src/androidTest` tem 2 testes instrumentados, que o CI não executa |

Nos serviços Java e Kotlin, a classe de teste tem o nome da classe testada com o sufixo `Test` ou `Tests`. Nos serviços Python, o arquivo se chama `test_<módulo>.py`. Nos repositórios TypeScript, o teste fica na mesma pasta do arquivo testado, com a extensão `.test.ts` ou `.test.tsx`.

Dois repositórios ficam fora do padrão por enquanto. O `api-email` não tem teste automatizado na `main`, e o `databricks-stocker` tem 8 arquivos de teste com `unittest` mas nenhum workflow que os execute.

## Como os testes acompanham a mudança

A prática que o histórico da `main` comprova é a de entregar o teste junto com a mudança de comportamento. No `api-notify`, no `ai-operational` e no `ai-assistant`, a maior parte dos commits de `feat` traz arquivos de teste no mesmo commit. Os exemplos abaixo são correções cujo teste de regressão entrou na mesma alteração, cada um conferido com `git log` na `main` do repositório.

| Repositório | Commit | Data | Correção | Teste que acompanha |
|---|---|---|---|---|
| `ai-assistant` | `8da6920` | 2026-10-29 | uma conversa passa a pertencer ao usuário que a criou, e outro usuário recebe 403 | quatro casos novos em `tests/workflow/test_runner.py`, entre eles o da conversa de outro usuário recusada antes de rodar o grafo |
| `api-notify` | `bc5d416` | 2026-10-25 | o health check do MongoDB passa a consultar só o banco do serviço | `MongoPingHealthIndicatorTests`, criado no mesmo commit |
| `api-messenger` | `e87540f` | 2026-11-01 | a consulta ao LangSmith passa a acontecer uma vez, só para o `ai-assistant` | `LangSmithClientTests` novo e `GetLangSmithSummaryUseCaseTests` ajustado |

Nesses três casos o teste e a correção chegam no mesmo commit, e o repositório não registra um commit anterior só com o teste que falha. Em todos os repositórios levantados, nenhum commit de `test` precede o commit de `feat` ou `fix` da mesma área dentro da mesma Pull Request, e nenhuma Pull Request começa por um commit que só adiciona o teste. Por isso este documento não descreve o ciclo vermelho, verde e refatoração como prática comprovada pelo histórico, apenas a regra de que a mudança e o teste dela andam juntos.

Quando o teste chega depois, ele entra como commit `test:` separado, como em `c0ddb30` (2026-10-29, `api-core`), que cobre o fallback em SQL das recomendações, e em `38b547c` (2026-10-23, `api-notify`), que cobre o fluxo de notificação.

## Gates no CI

O workflow `ci.yml` de cada repositório roda em Pull Request e em push na `main`. O workflow `sonarqube.yml` reage ao término do CI e só executa se ele terminou com sucesso, baixando o artefato de cobertura que o CI publicou.

| Repositório | Execução dos testes no CI | Cobertura | SonarQube |
|---|---|---|---|
| `api-core` | `./mvnw test` com JaCoCo, e um segundo job com Postgres 16 para o teste de integração das entidades | JaCoCo em XML, sem mínimo | sim |
| `api-auth` | `./mvnw test` com JaCoCo | JaCoCo em XML, sem mínimo | sim |
| `api-messenger` | `./mvnw test` com JaCoCo, com MongoDB 7.0 e Redis 7.4 como serviços | JaCoCo em XML, sem mínimo | sim |
| `api-notify` | `./mvnw test` com JaCoCo, com MongoDB 7.0 como serviço | JaCoCo em XML, sem mínimo | sim |
| `api-recommendation` | `pytest` com Neo4j 5.26 e Postgres 16 como serviços, mais a compilação de `app` e `tests` | `--cov-fail-under=65` sobre `app/` | sim |
| `ai-assistant` | `pytest tests` com relatório JUnit | `coverage.xml`, sem mínimo | sim |
| `ai-operational` | `pytest tests` com relatório JUnit | `coverage.xml`, sem mínimo | sim |
| `web-app` | `npm run test -- --coverage` depois do build, com o Chromium do Playwright instalado | V8 em `lcov`, sem mínimo | sim |
| `lib-web` | `npm test`, build e `npm pack --dry-run` | não medida | não |
| `web-sandbox` | `npm test` e build | não medida | não |
| `worker-failover` | `npm test` | não medida | não |
| `mobile-app` | `testQaDebugUnitTest` e `testProdDebugUnitTest` | só o relatório JUnit vai ao SonarQube | sim |
| `database-console` | `python -m unittest` com Postgres 16, mais a compilação dos scripts | não medida | sim |

O limite de qualidade (quality gate) do SonarQube é configurado no próprio SonarQube e não aparece nos arquivos dos repositórios, então este documento não afirma quais condições ele aplica.

As regras de Pull Request que se relacionam com os testes estão no `CONTRIBUTING.md` e nos templates de cada repositório.

- O título da Pull Request é validado pelo workflow `pr-title-lint.yml`, e o `CONTRIBUTING.md` lista `test:` entre os prefixos de commit.
- A Pull Request só é aberta com o CI passando, e o CI precisa estar verde antes do merge.
- O template do `web-app` tem a seção "Como testar", e o deste repositório tem a seção "Como validar", ambas obrigatórias no preenchimento.
- Os caminhos cobertos pelo `CODEOWNERS` exigem a aprovação do dono antes do merge.

## Como rodar

O `Makefile` padrão dos repositórios tem o alvo `make test`, que chama o comando da stack. O ambiente local, incluindo as variáveis, está descrito no `docs/RUNNING.md` de cada repositório.

| Repositório | Comando | Pré-requisito |
|---|---|---|
| `api-core`, `api-auth`, `api-messenger`, `api-notify` | `make test` (`./mvnw test`) | JDK 21 |
| `api-recommendation` | `make test` (`python -m pytest --cov=app --cov-report=term-missing`) | Python 3.12 e, para `tests/integration`, os bancos que o CI sobe como serviço (Neo4j e Postgres) |
| `ai-assistant`, `ai-operational` | `make test` (`python -m pytest tests --cov=src --cov-report=term-missing`) | Python 3.14 |
| `database-console` | `make test` (`python -m unittest discover -s tests -v`) | Python e um Postgres local |
| `web-app`, `lib-web`, `web-sandbox`, `worker-failover` | `npm test` | Node.js e `npx playwright install chromium` para as stories |
| `mobile-app` | `make test` (`./gradlew testQaDebugUnitTest testProdDebugUnitTest`) | JDK e Android SDK |

Para rodar só as stories no `web-app` ou no `lib-web`, o script é `npm run test:storybook`. Para ver a cobertura de um serviço Java, o comando do CI funciona localmente.

```bash
./mvnw org.jacoco:jacoco-maven-plugin:0.8.12:prepare-agent test org.jacoco:jacoco-maven-plugin:0.8.12:report
```

O relatório sai em `target/site/jacoco/`.

## Arquivos de referência

| Arquivo | Para que serve |
|---|---|
| [`ci.yml` do `api-core`](https://github.com/Solierrr/api-core/blob/main/.github/workflows/ci.yml) | testes com JaCoCo e job de integração com Postgres |
| [`ci.yml` do `api-recommendation`](https://github.com/Solierrr/api-recommendation/blob/main/.github/workflows/ci.yml) | testes com serviços de banco e limite mínimo de cobertura |
| [`ci.yml` do `ai-assistant`](https://github.com/Solierrr/ai-assistant/blob/main/.github/workflows/ci.yml) | testes Python com relatório de cobertura e JUnit |
| [`vite.config.ts` do `web-app`](https://github.com/Solierrr/web-app/blob/main/vite.config.ts) | dois projetos Vitest, o de unidade em jsdom e o das stories no Chromium |
| [`sonarqube.yml` do `api-core`](https://github.com/Solierrr/api-core/blob/main/.github/workflows/sonarqube.yml) | envio da cobertura ao SonarQube depois do CI |
| [`CONTRIBUTING.md` do `web-app`](https://github.com/Solierrr/web-app/blob/main/.github/CONTRIBUTING.md) | regras de commit, branch e Pull Request |
