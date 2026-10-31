<p align="center">
  <img src="../assets/readme/banners/grafana.png" alt="grafana" width="100%">
</p>

# Execução local

Use Docker Compose para a stack local e `kubectl` com Kustomize e kubeconform para validar manifestos. O guia comum está em [KUSTOMIZE.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/KUSTOMIZE.md).

`make vault` exporta `/otel`. `make build` renderiza base, dev e prod. `make lint` valida os manifestos renderizados. `make test` não tem comando configurado.

`make obs-up` cria a rede local se necessário e inicia Collector e Grafana LGTM. Os endpoints locais são `localhost:4317`, `localhost:4318` e http://localhost:3000. `make obs-down` para a composição.

O Compose usa LGTM 0.35.0 e Collector 0.115.1. Configure uma aplicação para enviar ao Collector e confira os painéis. Porta ocupada, Docker indisponível e backend não saudável impedem iniciar ou observar a stack.
