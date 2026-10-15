# TRY-LOCAL: rodar um serviço da Solaria na sua máquina

Este guia explica como rodar um serviço localmente com o `Makefile` padrão do repositório (ver [`templates/make/`](../templates/make/README.md)). Os segredos vêm do Infisical com a sua conta e o serviço roda com a ferramenta da própria stack (Maven, Python, Node e assim por diante). Nada é clonado além do próprio repositório.

## O que você precisa

| Ferramenta | Para quê | Como conferir |
|---|---|---|
| `make` e `git` | Rodar os comandos | `make --version` |
| Infisical CLI | Ler os segredos | `infisical --version` |
| Acesso ao projeto no Infisical | Ler os segredos do ambiente | `infisical login` |
| As ferramentas da stack do repositório | Rodar o serviço (por exemplo JDK 21, Python 3.14, Node) | `make doctor` |
| Docker Desktop (com Compose v2) | Só para o Grafana local e o cluster local | `docker compose version` |

No Windows, rode os comandos pelo Git Bash.

## Primeiro uso

1. Faça login no Infisical com a sua conta: `infisical login`.
2. Na pasta do repositório do serviço, rode `make doctor` para conferir as ferramentas.
3. Rode `make install` para instalar as dependências.
4. Rode `make vault` para gravar o `.env` com os segredos.
5. Rode `make dev` para subir o serviço.

## Comandos

| Comando | O que faz |
|---|---|
| `make help` | Lista os comandos do repositório |
| `make doctor` | Confere as ferramentas necessárias e a sessão do Infisical |
| `make vault` | Grava o `.env` com os segredos das pastas do Infisical que o repositório usa (ambiente `local` por padrão) |
| `make vault ENV=qa` | Lê os segredos do ambiente `qa` (aceita `local`, `qa` e `prod`) |
| `make vault OUT=caminho` | Grava em outro arquivo em vez de `.env` |
| `make install` | Instala as dependências |
| `make dev` | Sobe o serviço com a ferramenta da stack |
| `make lint`, `make test`, `make build` | Rodam o linter, os testes e o build |
| `make ci` | Roda `lint`, `test` e `build` na ordem do pipeline |

Alguns repositórios têm alvos próprios, listados no `make help`. Um alvo sem comando para o repositório avisa `not configured for this repository` em vez de falhar.

## Grafana local

No `infra-otel-collector`:

- `make obs-up` cria a rede `local` se ela não existir e sobe o Grafana (`grafana/otel-lgtm`) e o OpenTelemetry Collector.
- `make obs-down` derruba os dois.

Abra `http://localhost:3000` (usuário `admin`, senha `admin`) e veja logs, traces e métricas em **Explore** e nos dashboards da pasta **Solaria**. O Collector recebe OTLP em `localhost:4317` (gRPC) e `localhost:4318` (HTTP): aponte a telemetria do serviço para lá com as variáveis OTLP que ele já usa. Os dados ficam só na memória do container e se perdem quando ele para.

## Cluster local

No `infra-gitops`:

- `make cluster-up` cria um cluster Kubernetes local (k3d) com o Argo CD.
- `make cluster-apps APPS="api-core"` aplica a `Application` do `infra-gitops` (`APPS=root` aplica o app of apps).
- `make cluster-secrets SERVICES="api-core"` cria o secret `<serviço>-secrets` a partir do Infisical (`ENV=qa` por padrão).
- `make cluster-status` mostra as aplicações, `make cluster-password` imprime a senha do admin e `make cluster-ui` abre o Argo CD em `https://localhost:8085` (usuário `admin`).
- `make cluster-down` apaga o cluster.

O cluster usa um kubeconfig próprio e o contexto `k3d-local`: o contexto padrão do `kubectl` (por exemplo o do GKE) nunca é usado nem alterado. O Argo CD do cluster local sincroniza a `main` do `infra-gitops` no GitHub, ou seja, o que está no repositório e não o que está no seu disco.

## Memória do Docker

Os "8 GB" são o limite da máquina virtual do Docker Desktop (WSL2), não a memória do computador. Para ver o valor atual, rode `docker info --format '{{.MemTotal}}'`. Subir o Grafana local e um cluster ao mesmo tempo pode passar disso. Para aumentar, crie ou edite `%UserProfile%\.wslconfig` com:

```ini
[wsl2]
memory=12GB
```

e rode `wsl --shutdown`, depois reabra o Docker Desktop. Deixe pelo menos 4 GB para o Windows.

## Problemas comuns

**"Infisical CLI not installed" ou "No active Infisical session".**
- Instale o CLI (<https://infisical.com/docs/cli/overview>).
- Rode `infisical login` e tente de novo.

**"Failed to extract" ou "No secrets returned" no `make vault`.** Confirme que a sua conta tem acesso ao projeto da Solaria no Infisical, que o `ENV` existe e que a pasta está preenchida. O `.env` existente não é alterado quando a extração falha.

**"VAULT_FOLDERS is not configured for this repository".** O repositório ainda não declara quais pastas do Infisical usa. Preencha `VAULT_FOLDERS` no bloco específico do `Makefile`.

**`docker: command not found` ou o daemon não responde.** Abra o Docker Desktop e espere ele ficar pronto (só vale para `make obs-up` e `make cluster-up`).

**`make: *** No rule to make target`.** O alvo não existe naquele repositório. Rode `make help` para ver os que existem.

## Como funciona

- O `Makefile` de cada repositório é o [`templates/make/base.mk`](../templates/make/base.mk) com o bloco específico da stack. Não há ferramenta compartilhada para clonar.
- `make vault` chama o Infisical CLI direto, para cada pasta de `VAULT_FOLDERS`, e só troca o `.env` se todas devolverem segredos.
- O Grafana local é do `infra-otel-collector` (`local/compose.yaml`) e o cluster local é do `infra-gitops` (`scripts/cluster.sh`).
