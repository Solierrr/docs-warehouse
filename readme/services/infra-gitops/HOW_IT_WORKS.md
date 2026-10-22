<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/argocd.png" alt="Argo CD" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gcp.png" width="100" hspace="8" alt="Google Cloud" title="Google Cloud">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/github-actions.png" width="100" hspace="8" alt="GitHub Actions" title="GitHub Actions">
</p>

# Como o repositório funciona

Cada `Application` sob `apps/` (por exemplo `api-core.yaml`, `api-auth.yaml`, `web-app.yaml`) referencia um caminho da pasta `services/` deste mesmo repositório, onde ficam o `Deployment`, o `Service` e (quando exposto externamente) o `Ingress` daquele serviço. O ArgoCD sincroniza automaticamente qualquer divergência entre o que está em `services/<app>` e o estado real do cluster, com `prune` e `selfHeal` habilitados — ou seja, um merge em `main` já é o deploy.
