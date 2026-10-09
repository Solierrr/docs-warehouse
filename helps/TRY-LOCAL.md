# TRY-LOCAL: rodar um serviço da Solaria na sua máquina

Este guia explica como subir um serviço localmente com `make up`, sem clonar nada além do próprio repositório. O serviço roda a partir da imagem publicada no Docker Hub (`solarianetwork/<serviço>`), e os segredos vêm do Infisical com a sua conta.

## O que você precisa

| Ferramenta | Para quê | Como conferir |
|---|---|---|
| Docker Desktop (com Compose v2) | Rodar a imagem e os bancos locais | `docker compose version` |
| Infisical CLI | Ler os segredos | `infisical --version` |
| `make` e `git` | Rodar os comandos e atualizar o `infra-scripts` | `make --version` |
| Acesso ao projeto no Infisical | Ler os segredos do ambiente `qa` | `infisical login` |

No Windows, rode os comandos pelo Git Bash.

## Primeiro uso

1. Faça login no Infisical com a sua conta: `infisical login`.
2. Na pasta do repositório do serviço, rode `make up`.

O `make up` baixa a imagem, lê os segredos do ambiente `qa`, sobe o container e mostra o endereço (por exemplo, `http://localhost:8080`). Os segredos ficam num arquivo temporário com permissão restrita, apagado ao final do comando.

## Comandos

| Comando | O que faz |
|---|---|
| `make up` | Sobe o serviço apontando para os bancos remotos de `qa` |
| `make up DB=local` | Sobe PostgreSQL (e Neo4j para o `api-recommendation`) em containers locais, com o schema e o seed do `database-console` |
| `make up OBS=1` | Sobe também o Grafana local e o Collector e liga a telemetria do serviço |
| `make up BUILD=1` | Constrói a imagem a partir do `Dockerfile` do repositório, útil para testar uma mudança antes do release |
| `make up ENV_FILE=caminho` | Usa um arquivo de variáveis em vez do Infisical (para testar sem login) |
| `make down` | Para o serviço. `make down ALL=1` também para os bancos e o Grafana |
| `make logs` | Segue os logs |
| `make docker-build` | Constrói a imagem local (só em repositórios com `Dockerfile`) |
| `make docker-push TAG=dev-seunome` | Publica uma imagem de desenvolvimento. `latest` e tags de release são recusadas: produção só recebe imagem pelo CI |
| `make compose` | Roda o compose do próprio repositório (só se ele tiver um) |

## Grafana local (`OBS=1`)

Com `OBS=1`, o `make up` sobe o Grafana (`grafana/otel-lgtm`) e o OpenTelemetry Collector do `infra-otel-collector` na rede `solaria-local`, e liga a telemetria do serviço. Abra `http://localhost:3000` (usuário `admin`, senha `admin`) e veja logs, traces e métricas em **Explore** e nos dashboards da pasta **Solaria**. Os dados ficam só na memória do container e se perdem quando ele para.

## Vários serviços e cluster local

No `infra-gitops` (que inclui o `stack.mk`):

- `make up-stack PROFILE=core` sobe um grupo de serviços (`core`, `rec`, `ai` ou `all`) a partir das imagens do Docker Hub, cada um em uma porta do host (api-core 8080, api-auth 8081, api-messenger 8082, api-recommendation 8000, ai-assistant 8010, ai-validation 8011, ai-geographic 8012, ai-operational 8013, ai-accessibility 8014). Aceita `DB=local` e `OBS=1`. Pare com `make down-stack PROFILE=core`.
- `make cluster-up` cria um cluster Kubernetes local (k3d) com o Argo CD. Depois, `make cluster-apps APPS="api-core"` aplica a `Application` do `infra-gitops`, `make cluster-secrets SERVICES="api-core"` cria o secret do serviço a partir do Infisical e `make cluster-ui` abre o Argo CD em `https://localhost:8085` (usuário `admin`, senha de `make cluster-password`). O cluster usa um kubeconfig próprio: o contexto padrão do `kubectl` não é alterado.

O Argo CD do cluster local sincroniza a `main` do `infra-gitops` no GitHub, ou seja, o que está no repositório e não o que está no seu disco.

## Memória do Docker

Os "8 GB" são o limite da máquina virtual do Docker Desktop (WSL2), não a memória do computador. Para ver o valor atual, rode `docker info --format '{{.MemTotal}}'`. Subir vários serviços Java, o Grafana local e um cluster ao mesmo tempo pode passar disso. Para aumentar, crie ou edite `%UserProfile%\.wslconfig` com:

```ini
[wsl2]
memory=12GB
```

e rode `wsl --shutdown`, depois reabra o Docker Desktop. Deixe pelo menos 4 GB para o Windows. Sem aumentar o limite, suba por perfil (`PROFILE=core`, depois `PROFILE=ai`) em vez de `all`.

## Problemas comuns

**"Não foi possível obter os segredos do Infisical."**
- Rode `infisical login` e tente de novo.
- Rode `infisical --version` e atualize o CLI se estiver desatualizado.
- Confirme que a sua conta tem acesso ao projeto da Solaria no Infisical.

**`docker: command not found` ou o daemon não responde.** Abra o Docker Desktop e espere ele ficar pronto.

**A porta já está em uso.** Escolha outra com `HOST_PORT=8090 make up`, ou pare o que está usando a porta.

**O serviço sobe, mas não conecta no banco.** Em `DB=remote`, o banco é o de `qa` (Aiven), e o seu IP precisa estar liberado. Use `DB=local` para não depender da rede.

**`exec ./entrypoint.sh: no such file or directory` ao usar `BUILD=1` no Windows.** O Git converteu o `entrypoint.sh` para fins de linha CRLF e o container não consegue executá-lo. A correção definitiva é incluir `*.sh text eol=lf` (ou `* text=auto eol=lf`, como no `api-recommendation`) no `.gitattributes` do repositório. Para destravar agora, rode `sed -i 's/$//' entrypoint.sh` e tente de novo.

**`make: *** No rule to make target 'up'`.** O Makefile do repositório ainda não inclui o fragmento `local.mk`. Veja [`templates/make/`](../templates/make/README.md).

## Como funciona

- O fragmento `templates/make/local.mk` define os comandos. A lógica está em `infra-scripts/scripts/local.sh`, que o `make` clona e atualiza sozinho (`make vault-config`).
- Os arquivos Compose ficam em `infra-scripts/compose/`.
- A rede `local` liga o serviço, os bancos e o Grafana.
