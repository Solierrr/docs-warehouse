<p align="center">
  <img src="../assets/readme/banners/grafana.png" alt="Grafana" width="100%">
</p>

# Estado da implantação

A instância do Grafana definida no GitOps tem Ingress em https://grafana.solarianetwork.site, porta 3000, probes em `/api/health` e Secret `infra-grafana-secrets`. Os painéis e os alertas deste repositório são provisionados nessa instância.

Não há workflow que aplique os arquivos de `dashboards/` e `alerting/` automaticamente, por isso a atualização no Grafana acompanha o processo da instância. O workflow de release ainda chama um publicador Docker genérico, sem uma imagem de aplicação.

O processo comum está em [PROD_GKE_ARGOCD.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PROD_GKE_ARGOCD.md).
