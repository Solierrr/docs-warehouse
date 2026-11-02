<p align="center">
  <img src="../assets/readme/banners/kong.png" alt="Kong" width="100%">
</p>

# Deploy

O workflow declara a instância Render em https://infra-gateway.onrender.com. A main contém Dockerfile e configuração DB-less. A finalidade de entrada comum de QA agora está registrada no README de origem, resolvendo a dúvida antiga do checklist.

A instalação no cluster é feita pelo `infra-platform`, que consome os valores Helm deste repositório, enquanto os Ingresses pertencem ao `infra-gitops`. Os processos comuns estão em [QA_RENDER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md) e [PROD_GKE_ARGOCD.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PROD_GKE_ARGOCD.md).

Os valores de produção usam um agrupamento diferente do arquivo base, e as opções de LoadBalancer, réplicas e limites são aplicadas pelo chart e pelo Terraform que as consomem.
