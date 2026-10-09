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
| `stack.mk` | opcional: sobe vários serviços de uma vez (`make up-stack`) e um cluster Kubernetes local com Argo CD (`make cluster-up`), para quem mantém o `infra-gitops` |
| `local.mk` | opcional: roda o serviço localmente a partir da imagem do Docker Hub (`make up`) |

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
- `make extract-env`: depende de `vault-auth`; sem `SERVICE` ou `ENV`, exibe menus numerados para selecionar serviço e ambiente. Também aceita `SERVICE=... ENV=...`; `OUT` é opcional e não deve apontar para arquivo versionado. Uma pasta sem segredos causa erro e preserva o `.env` existente.
- `make tools-check` / `make env`: aliases mantidos por compatibilidade para
  `vault-config` / `extract-env`, respectivamente.

Rodar só `make extract-env` já encadeia `vault-config` → `vault-auth` →
`extract-env`; se faltarem serviço ou ambiente, o extrator pergunta em menus.
No Windows, o helper prioriza `infisical.exe` e passa `SERVICE`, `ENV` e `OUT`
como parâmetros nomeados ao script compartilhado.
Os três alvos continuam chamáveis individualmente para
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

## Rodar o serviço localmente (`local.mk`)

Fragmento opcional, composto depois do `base.mk` e do fragmento da stack. Todo
o comportamento está em `infra-scripts/scripts/local.sh`; o repositório do
serviço só ganha o `include` e, se o nome da pasta não for o nome do serviço,
`LOCAL_SERVICE`.

| Comando | O que faz |
|---|---|
| `make up` | Baixa a imagem `solarianetwork/<serviço>:latest`, lê os segredos do Infisical (`ENV=qa` por padrão) e sobe o serviço |
| `make up SECRETS_ENV=prod` | Lê os segredos de outro ambiente do Infisical (`qa` por padrão; não usa `ENV`, que o `extract-env` já usa) |
| `make up DB=local` | Usa PostgreSQL (e Neo4j) em containers locais, com o schema e o seed do `database-console` |
| `make up OBS=1` | Sobe também o Grafana local e o Collector e liga a telemetria do serviço |
| `make up BUILD=1` | Constrói a imagem do `Dockerfile` do repositório em vez de baixar |
| `make down` | Para o serviço (`ALL=1` para também os bancos e o Grafana) |
| `make logs` | Segue os logs |
| `make docker-build` | Constrói a imagem local; só existe se há `Dockerfile` |
| `make docker-push TAG=dev-nome` | Publica uma imagem de desenvolvimento; recusa `latest` e tags de release |
| `make compose` | Roda o compose do próprio repositório; só existe se ele tiver um |

Os segredos vêm do login pessoal (`infisical login`), sem credencial de máquina.
Se algo falhar, o comando explica o que verificar e aponta para
[`helps/TRY-LOCAL.md`](../../helps/TRY-LOCAL.md).

## Vários serviços e cluster local (`stack.mk`)

Fragmento opcional, pensado para o `infra-gitops`. Os comandos usam `infra-scripts/scripts/local.sh` (`stack`) e `infra-scripts/scripts/cluster.sh`.

| Comando | O que faz |
|---|---|
| `make up-stack PROFILE=core` | Sobe um grupo de serviços: `core` (api-auth, api-core, api-messenger), `rec` (api-recommendation), `ai` (os cinco serviços de IA) ou `all`. Aceita `DB=local` e `OBS=1` |
| `make down-stack PROFILE=core` | Para o grupo (`ALL=1` também para os bancos e o Grafana) |
| `make cluster-up` | Cria um cluster k3d chamado `local` e instala o Argo CD na mesma versão do `infra-platform` |
| `make cluster-apps APPS="api-core api-auth"` | Aplica as `Application` do `infra-gitops` (`APPS=root` aplica o app of apps) |
| `make cluster-secrets SERVICES="api-core"` | Cria o secret `<serviço>-secrets` no cluster local a partir do Infisical |
| `make cluster-status`, `cluster-password`, `cluster-ui`, `cluster-down` | Mostra as aplicações, imprime a senha do admin, abre a interface em `https://localhost:8085` e apaga o cluster |

O cluster usa um kubeconfig próprio e o contexto `k3d-local`: o contexto padrão do `kubectl` (por exemplo o do GKE) nunca é usado nem alterado.
