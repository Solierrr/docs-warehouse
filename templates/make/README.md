# templates/make/

Contrato para o `Makefile` de repositórios da organização. Copie o
[`Makefile`](./Makefile) para a raiz de um repositório novo e mantenha nele
apenas os atalhos locais do projeto. Ferramentas reutilizáveis de terminal
ficam em [`Solierrr/infra-scripts`](https://github.com/Solierrr/infra-scripts),
instalado uma vez por estação de trabalho.

## Instalação da ferramenta compartilhada

No Windows, clone o repositório em um local estável fora de qualquer projeto:

```powershell
git clone https://github.com/Solierrr/infra-scripts.git "$env:USERPROFILE/.local/share/solierrr-infra-scripts"
```

Em ambientes Unix, o diretório equivalente é `~/.local/share/solierrr-infra-scripts`.
Quem já instalou atualiza deliberadamente, quando desejar receber uma nova
versão dos scripts:

```powershell
git -C "$env:USERPROFILE/.local/share/solierrr-infra-scripts" pull --ff-only
```

É possível sobrescrever o caminho por invocação, sem editar o Makefile:

```powershell
make tools-check ORG_SCRIPTS_DIR=C:/ferramentas/infra-scripts
```

## Alvos organizacionais obrigatórios

- `make help`: lista os comandos disponíveis.
- `make tools-check`: confirma que `infra-scripts` está instalado e contém o
  script chamado pelo repositório.
- `make env ENV=local`: gera o arquivo de ambiente por meio de
  `infra-scripts`. O projeto deve informar seu `SERVICE` padrão; `OUT` é
  opcional e não deve apontar para arquivo versionado.

O alvo `env` nunca executa login, instala CLIs ou atualiza `infra-scripts`
automaticamente. Credenciais e atualização de ferramenta são ações explícitas
do desenvolvedor.

## Alvos por stack

Além do contrato acima, cada repositório expõe somente o que faz sentido para
sua stack. Prefira `setup`, `dev`, `build`, `test`, `lint`, `check`, `run` e
`clean`, com descrições no `help`.

- **Python:** `setup` cria/atualiza a virtualenv e instala requirements;
  `run` inicia o servidor/processo com a virtualenv, sem depender de ativação
  manual no shell.
- **Node/TypeScript:** `setup` instala dependências usando o lockfile; `dev`,
  `test`, `lint` e `build` delegam ao gerenciador de pacotes do projeto.
- **Maven/Gradle:** use sempre `mvnw`/`gradlew`; não crie instalação global
  de Maven ou Gradle. Se o wrapper já resolve dependências no primeiro build,
  `setup` pode ser omitido.
- **Android:** exponha atalhos para build, testes, lint, dispositivo/emulador
  e execução, preservando o wrapper Gradle.
- **Terraform/GitOps:** exponha apenas validações e operações conscientemente
  aplicáveis. `apply`, alterações de capacidade e sincronização do cluster
  não pertencem ao template genérico.

## Limites de responsabilidade

`infra-scripts` é a fonte única para utilitários que atendem vários repositórios,
como `extract-env`. Scripts que conhecem recursos, state, credenciais ou
efeitos de um repositório de infraestrutura continuam nele: por exemplo,
`toggle-nodes.ps1` permanece em `infra-platform`.

Um Makefile é uma interface local; workflows reutilizáveis do GitHub Actions
são a interface de CI. Nenhum substitui o outro.
