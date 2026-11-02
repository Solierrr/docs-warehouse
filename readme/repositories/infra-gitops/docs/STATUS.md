<p align="center">
  <img src="../assets/readme/banners/argocd.png" alt="Argo CD" width="100%">
</p>

# Situação

Leitura da main em 2026-10-31.

- O catálogo já inclui `api-email`, `ai-geographic`, `ai-operational` e `otel-collector`, que o checklist antigo apontava como ausentes.
- Existem imagens com `latest`, como no Deployment do `api-core`, em desacordo com o padrão de versão imutável.
- Há probes TCP, como no `api-core`, que não verificam o readiness HTTP da aplicação.
- O CI ignora schemas Kubernetes ausentes. Portanto a aprovação não valida integralmente CRDs do Argo CD.
- O estado de sincronização e a saúde do cluster são acompanhados no Argo CD, fora deste repositório.
