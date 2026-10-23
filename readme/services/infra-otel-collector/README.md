<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/grafana.png" alt="Grafana" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/opentelemetry.png" width="100" hspace="8" alt="OpenTelemetry" title="OpenTelemetry">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gcp.png" width="100" hspace="8" alt="Google Cloud" title="Google Cloud">
</p>

# Central de telemetria

[![License](https://img.shields.io/github/license/Solierrr/infra-otel-collector)](https://github.com/Solierrr/infra-otel-collector/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/infra-otel-collector)](https://github.com/Solierrr/infra-otel-collector/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/infra-otel-collector)](https://github.com/Solierrr/infra-otel-collector/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/infra-otel-collector)](https://github.com/Solierrr/infra-otel-collector/releases)

Este repositório define o ponto único que recebe os dados de funcionamento de todos os serviços, como tempo de resposta, erros e registros do que aconteceu. Em vez de cada serviço enviar essas informações direto para uma ferramenta externa, todos mandam para este ponto, que protege dados sensíveis, reduz o volume e repassa o resultado para a plataforma de monitoramento. Assim a configuração de monitoramento fica em um só lugar e pode ser ajustada para cada ambiente.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/infra-otel-collector/blob/main/docs/ARCHITECTURE.md), estrutura do repositório e detalhamento dos receivers/processors/exporters configurados no pipeline.
- [RUNNING.md](https://github.com/Solierrr/infra-otel-collector/blob/main/docs/RUNNING.md), como renderizar e validar os manifestos localmente com Kustomize.
- [TELEMETRY_FLOW.md](https://github.com/Solierrr/infra-otel-collector/blob/main/docs/TELEMETRY_FLOW.md), caminho dos logs, métricas e traces até o destino.

## Contribuindo

- [.github/CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [.github/CODEOWNERS](https://github.com/Solierrr/infra-otel-collector/blob/main/.github/CODEOWNERS), donos responsáveis por revisar mudanças no repositório.
