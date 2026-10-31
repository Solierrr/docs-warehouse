<p align="center">
  <img src="../assets/readme/banners/argocd.png" alt="Argo CD" width="100%">
</p>

# Validação local

Use `make`, `kubectl`, `kubeconform` e Docker para validar e executar o cluster local. O script usa k3d 5.8.3 e Argo CD 3.5.2 por padrão. Os guias comuns estão em [ARGOCD.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/ARGOCD.md) e [TRY-LOCAL.md](https://github.com/Solierrr/docs-warehouse/blob/main/helps/TRY-LOCAL.md).

`make lint` executa kubeconform com schemas ausentes ignorados. `make test`, `make build` e `make dev` não têm comando próprio configurado. O CI usa kubeconform 0.7.0 em container.

| Comando | Efeito |
|---|---|
| `make cluster-up` | Cria k3d e instala Argo CD |
| `make cluster-apps APPS="api-core api-auth"` | Aplica Applications selecionadas |
| `make cluster-secrets SERVICES="api-core"` | Exporta configuração autorizada do Infisical para o cluster local |
| `make cluster-status` | Mostra Applications |
| `make cluster-ui` | Abre port-forward em https://localhost:8085 |
| `make cluster-down` | Remove o cluster local |

O script usa kubeconfig próprio e contexto `k3d-local`. `make vault` não tem pastas configuradas. A obtenção de segredos locais ocorre por `cluster-secrets`, com `SECRETS_ENV` selecionando o ambiente. Sem acesso ao Infisical, essa etapa falha.
