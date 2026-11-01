<p align="center">
  <img src="./assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

<p align="center">
  <img src="./assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="./assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="Cloudflare" title="Cloudflare">
</p>

# Central de alertas operacionais

[![License](https://img.shields.io/github/license/Solierrr/worker-alerts)](https://github.com/Solierrr/worker-alerts/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/worker-alerts)](https://github.com/Solierrr/worker-alerts/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/worker-alerts)](https://github.com/Solierrr/worker-alerts/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/worker-alerts)](https://github.com/Solierrr/worker-alerts/releases)

Este serviço transforma sinais de falha em registros de atendimento para a equipe que opera a plataforma. Ele reúne o problema, a prioridade, o impacto informado e os caminhos de investigação em um ticket. Controla a repetição dos avisos e registra quando a condição volta ao normal. A confirmação do atendimento e o encerramento do ticket continuam sob responsabilidade humana.

O serviço roda na Cloudflare, fora do cluster das aplicações, para continuar recebendo alertas quando o cluster fica indisponível. O código TypeScript usa Hono e Zod para receber mensagens do Grafana Cloud, Durable Objects para coordenar incidentes e guardar o estado das verificações, e a API do Jira para registrar o atendimento. O envio opcional de e-mail passa pelo serviço de mensagens transacionais.

## Aprofunde-se no Projeto!

- [OVERVIEW.md](./docs/OVERVIEW.md), capacidades, prioridades e regras de atendimento.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md), componentes, integrações e decisões técnicas.
- [RUNNING.md](./docs/RUNNING.md), configuração local, comandos e verificações.
- [API.md](./docs/API.md), autenticação, webhook, prévia e monitoramento.
- [DEPLOY.md](./docs/DEPLOY.md), publicação, domínio e configuração de produção.
- [STATUS.md](./docs/STATUS.md), limites e diferenças em relação aos padrões comuns.
- [Fluxos](./flows/), recebimento, recuperação e monitoramento dos incidentes.
- [Dados](./database/), persistência dos monitores e coordenação por incidente.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar uma vulnerabilidade.
