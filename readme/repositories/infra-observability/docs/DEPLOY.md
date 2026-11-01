<p align="center">
  <img src="../assets/readme/banners/grafana.png" alt="Grafana" width="100%">
</p>

# Estado da implantação

Este repositório não possui uma imagem Grafana própria implementada. O workflow de release ainda chama um publicador Docker genérico, mas o Dockerfile contém somente instruções pendentes.

A instância definida no GitOps tem Ingress em https://grafana.solarianetwork.site, porta 3000, probes em `/api/health` e Secret `infra-observability-secrets`. Painéis são lidos do repositório do coletor. A existência desses manifestos não comprova disponibilidade atual.

O processo comum está em [PROD_GKE_ARGOCD.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PROD_GKE_ARGOCD.md). A decisão sobre manter ou absorver este molde em outro repositório continua pendente. <!-- PENDENTE: 1 -->
