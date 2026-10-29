<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/grafana.png" alt="Grafana" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/opentelemetry.png" width="100" hspace="8" alt="OpenTelemetry" title="OpenTelemetry">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gcp.png" width="100" hspace="8" alt="Google Cloud" title="Google Cloud">
</p>

# Fluxo de Telemetria

```
API --OTLP--> otel-collector --OTLP/HTTP--> Grafana Cloud
```

Localmente, o mesmo Collector envia para um Grafana self-hosted (`grafana/otel-lgtm`), subido por `local/compose.yaml` ou pelo `make obs-up`. Veja `docs/RUNNING.md`.

O Collector expõe as portas `4317` (OTLP/gRPC) e `4318` (OTLP/HTTP) para receber dados das aplicações, e usa o endpoint e o token de autenticação do Grafana Cloud (injetados via Secret `grafana-cloud-otlp`) para autenticar o envio. Roda obrigatoriamente com **1 réplica**, já que o processor de `tail_sampling` precisa enxergar todos os spans de um mesmo trace na mesma instância para decidir corretamente se ele deve ser amostrado.
