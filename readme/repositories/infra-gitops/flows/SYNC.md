<p align="center">
  <img src="../assets/readme/banners/argocd.png" alt="argocd" width="100%">
</p>

# Sincronização

A sincronização faz o estado do cluster convergir para os manifestos da main.

```mermaid
flowchart TD
 A[Argo CD lê main] --> B[Raiz descobre Applications]
 B --> C[Filhas leem services]
 C --> D{Há diferença?}
 D -->|não| E[Mantém estado]
 D -->|sim| F[Aplica e remove recursos]
 F --> G{Recursos saudáveis?}
 G -->|sim| H[Sincronizado]
 G -->|não| I[Exibe erro ou degradação]
```

Falha ao ler Git, manifesto inválido e permissões insuficientes impedem sincronizar. `prune` permite remover recursos e `selfHeal` permite reverter alterações manuais no cluster.
