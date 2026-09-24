# templates/make/

Fragmentos combináveis de `Makefile`. Todo repositório começa com
[`base.mk`](./base.mk) e acrescenta exatamente um fragmento da sua stack. A
composição resultante é copiada para a raiz como `Makefile`. Ferramentas
reutilizáveis de terminal ficam em
[`Solierrr/infra-scripts`](https://github.com/Solierrr/infra-scripts),
instalado uma vez por estação de trabalho.

| Fragmento | Uso |
|---|---|
| `base.mk` | obrigatório: ajuda, `tools-check` e `env` |
| `node.mk` | Node/TypeScript/Vite |
| `python.mk` | Python/venv/Uvicorn |
| `maven.mk` | Java ou Kotlin com Maven/Spring Boot |
| `android.mk` | Kotlin/Gradle/Jetpack Compose |
| `terraform.mk` | Terraform |
| `argocd.mk` | manifestos GitOps/ArgoCD |
| `helm.mk` | Helm charts |
| `kustomize.mk` | manifestos Kustomize |

Exemplo para um serviço Python:

```powershell
Get-Content base.mk, python.mk | Set-Content Makefile
```

O fragmento de stack pode ser ajustado somente nos valores de configuração
explicitamente marcados. Alvos específicos do domínio do repositório ficam no
fim do Makefile resultante.

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

## Alvos organizacionais obrigatórios (`base.mk`)

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

Os fragmentos padronizam `setup`, `dev`, `build`, `test`, `lint`, `check`,
`run` e `clean` apenas quando eles fazem sentido. Maven e Gradle sempre usam
seus wrappers. Terraform, ArgoCD, Helm e Kustomize expõem validação/renderização
e deixam operações reais, como `apply` e sync, intencionalmente explícitas.

## Limites de responsabilidade

`infra-scripts` é a fonte única para utilitários que atendem vários repositórios,
como `extract-env`. Scripts que conhecem recursos, state, credenciais ou
efeitos de um repositório de infraestrutura continuam nele: por exemplo,
`toggle-nodes.ps1` permanece em `infra-platform`.

Um Makefile é uma interface local; workflows reutilizáveis do GitHub Actions
são a interface de CI. Nenhum substitui o outro.
