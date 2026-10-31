<p align="center">
  <img src="../assets/readme/banners/kong.png" alt="Kong" width="100%">
</p>

# Publicação de configuração

A configuração passa por revisão e validação antes de chegar ao runtime.

```mermaid
flowchart TD
 A[Edita configuração] --> B[Parse de QA e render Helm]
 B --> C[Revisão e main]
 C --> D{Destino}
 D -->|QA| E[Reconstrói container no Render]
 D -->|Cluster| F[infra-platform consome valores]
```

YAML inválido e chart incompatível impedem a entrega. O [fluxo central de deploy](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RELEASE_AND_DEPLOY.md) descreve os demais componentes.
