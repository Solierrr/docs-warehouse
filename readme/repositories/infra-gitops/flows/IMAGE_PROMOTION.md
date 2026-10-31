<p align="center">
  <img src="../assets/readme/banners/argocd.png" alt="argocd" width="100%">
</p>

# Promoção de imagem

A versão publicada de um serviço é referenciada no manifesto para chegar ao cluster. O processo entre repositórios está em [RELEASE_AND_DEPLOY.md](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RELEASE_AND_DEPLOY.md).

```mermaid
sequenceDiagram
 participant P as Publicador de imagem
 participant G as Git de configuração
 participant A as Argo CD
 participant K as Kubernetes
 P->>G: PR com referência da imagem
 G-->>A: Manifesto aprovado na main
 A->>K: Sincroniza recursos
 alt Recursos prontos
 K-->>A: Saudável
 else Erro de imagem ou configuração
 K-->>A: Falha de rollout
 end
```

Imagem inexistente, secret ausente e probes em falha impedem a disponibilidade. O manifesto precisa referenciar uma tag existente e compatível.
