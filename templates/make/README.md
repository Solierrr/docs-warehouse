# templates/make/

Modelo de `Makefile` único para todos os repositórios de código. O
[`base.mk`](./base.mk) é o Makefile genérico: igual em todo repositório, só o
bloco "específico deste repositório" no topo muda. Cada stack tem um fragmento
com os valores padrão desse bloco, no mesmo estilo de
[`github/gitignore/`](../../github/gitignore/): um arquivo por stack, copiado
manualmente.

| Arquivo | Uso |
|---|---|
| `base.mk` | Makefile genérico: bloco específico vazio e bloco padrão |
| `maven.mk` | Java ou Kotlin com Maven/Spring Boot |
| `python.mk` | Python com venv e Uvicorn |
| `python-uv.mk` | Python gerenciado pelo uv (bibliotecas) |
| `node.mk` | Node/TypeScript/Vite |
| `gradle.mk` | Kotlin/Gradle/Android |
| `terraform.mk` | Terraform |
| `helm.mk` | Helm charts |
| `kustomize.mk` | manifestos Kustomize e Argo CD |
| `shell.mk` | scripts de shell |
| `sql-python.mk` | scripts SQL e Python de banco de dados |

## Como usar

1. Copie o `base.mk` para a raiz do repositório como `Makefile`.
2. Abra o fragmento da stack e substitua, no `Makefile`, o bloco que vai de
   `# ---- especifico deste repositorio ----` até a linha em branco antes de
   `# ---- padrao (nao editar por repositorio) ----` pelo bloco do fragmento.
3. Ajuste os valores do bloco ao repositório (`VAULT_FOLDERS`, comandos,
   caminhos). Não edite o bloco padrão.
4. Alvos que só existem naquele repositório vão no fim do arquivo, numa seção
   própria depois do padrão.

Exemplo no Git Bash, para um serviço Python:

```sh
{ sed -n '1,3p' base.mk; echo; cat python.mk; echo; sed -n '/^# ---- padrao/,$p' base.mk; } > /caminho/do/repositorio/Makefile
```

Um valor vazio desliga o alvo: `make test` num repositório sem `TEST_CMD`
imprime `test: not configured for this repository` em vez de falhar.

Os comandos das variáveis rodam sempre por `sh` (`set -e; <comando>`). Sem
isso, o GNU Make 3.81 do Windows executa comandos simples direto, sem shell, e
falha com scripts como `./mvnw` e `./gradlew` (erro 193) ou com `.venv/Scripts/python`.
Por isso `PY` e os demais caminhos podem usar barras normais.

## Bloco específico

| Variável | O que é |
|---|---|
| `VAULT_FOLDERS` | pastas do Infisical lidas por `make vault`, separadas por espaço (por exemplo `/database /redis`) |
| `INSTALL_CMD` | instala as dependências |
| `DEV_CMD` | sobe o servidor de desenvolvimento |
| `BUILD_CMD` | compila ou empacota |
| `TEST_CMD` | roda os testes |
| `LINT_CMD` | roda o linter |
| `FORMAT_CMD` | formata o código |
| `CLEAN_PATHS` | caminhos apagados por `make clean` |
| `DOCTOR_TOOLS` | ferramentas conferidas por `make doctor` |

Todas usam `?=`, então podem ser sobrescritas na linha de comando
(`make test TEST_CMD="..."`).

## Alvos padrão

| Alvo | O que faz |
|---|---|
| `help` | lista os comandos |
| `verify-vault` | confere se o Infisical CLI está instalado e autenticado |
| `vault` / `env` | grava o `OUT` (padrão `.env`) com os segredos de `VAULT_FOLDERS`; `ENV=local\|qa\|prod` (padrão `local`) |
| `dev`, `install`, `build`, `test`, `lint`, `format` | executam o comando da variável correspondente |
| `clean` | apaga `CLEAN_PATHS` |
| `doctor` | confere as ferramentas de `DOCTOR_TOOLS` e a sessão do Infisical |
| `ci` | `lint`, `test` e `build`, na ordem do pipeline |

`make vault` precisa do Infisical CLI e de `infisical login` (ação sempre
explícita do desenvolvedor). Ele nunca grava um `.env` vazio ou vindo do cache
do CLI: se uma pasta não devolver segredos, o arquivo existente é preservado.

No Windows use o Git Bash. O GNU Make da máquina pode ser o 3.81, então o
arquivo não usa recursos mais novos. `MSYS_NO_PATHCONV=1` é aplicado só às chamadas do
Infisical CLI, para o Git Bash não reescrever caminhos como `/database`. Ele não é exportado
para o resto: com ele o `mvnw` e outras ferramentas deixam de achar seus arquivos.

## Alvos próprios do repositório

O que é específico do domínio (por exemplo `run` e `launch` no `mobile-app`,
`plan` e `apply` no `infra-platform`, `cluster-up` no `infra-gitops` e
`obs-up` no `infra-otel-collector`) fica numa seção "alvos proprios" depois do
bloco padrão, com `##` na mesma linha para aparecer no `make help`. Um alvo
próprio não pode reutilizar o nome de um alvo padrão.

## Limites de responsabilidade

Um Makefile é uma interface local; workflows reutilizáveis do GitHub Actions
são a interface de CI e não chamam o `make`. Scripts que conhecem recursos,
state, credenciais ou efeitos de um repositório de infraestrutura continuam no
próprio repositório.
