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

`make vault-config` (chamado automaticamente por `extract-env`) já clona o
`infra-scripts` no primeiro uso e atualiza (`git pull --ff-only`) nas
execuções seguintes — não é preciso clonar manualmente. O repositório é
público, então nenhuma credencial é necessária para esse passo.

```powershell
make vault-config
```

Continua sendo possível instalar manualmente ou sobrescrever o caminho por
invocação, sem editar o Makefile:

```powershell
git clone https://github.com/Solierrr/infra-scripts.git "$env:USERPROFILE/.local/share/solierrr-infra-scripts"
make vault-config ORG_SCRIPTS_DIR=C:/ferramentas/infra-scripts
```

Se `git pull --ff-only` falhar (histórico local divergiu), `vault-config`
para com um erro explicando o que fazer — ele nunca reescreve histórico
sozinho.

## Alvos organizacionais obrigatórios (`base.mk`)

- `make help`: lista os comandos disponíveis.
- `make vault-config`: garante que `infra-scripts` está clonado e atualizado
  no path esperado (clona se não existir, `pull --ff-only` se já existir).
- `make vault-auth`: depende de `vault-config`; confirma que o Infisical CLI
  está instalado e a sessão (`infisical login`) está ativa — se não estiver,
  imprime exatamente o comando a rodar e para, sem tentar logar sozinho.
- `make extract-env ENV=local`: depende de `vault-auth`; gera o arquivo de
  ambiente por meio de `infra-scripts`. O projeto deve informar seu `SERVICE`
  padrão; `OUT` é opcional e não deve apontar para arquivo versionado. Falha
  com mensagem clara se `SERVICE` não estiver definido ou `ENV` for inválido.
- `make tools-check` / `make env`: aliases mantidos por compatibilidade para
  `vault-config` / `extract-env`, respectivamente.

Rodar só `make extract-env` já encadeia `vault-config` → `vault-auth` →
`extract-env` sozinho; os três alvos continuam chamáveis individualmente para
depurar cada etapa. Login no Infisical (`infisical login`) continua sendo uma
ação explícita do desenvolvedor — `vault-auth` nunca tenta logar sozinho, só
avisa qual comando rodar.

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
