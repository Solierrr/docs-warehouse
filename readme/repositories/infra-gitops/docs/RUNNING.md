<p align="center">
  <img src="../assets/readme/banners/argocd.png" alt="Argo CD" width="100%">
</p>

# Validação local

Use `make`, `kubectl`, `kubeconform` e Docker para validar e executar o cluster local. O script usa k3d 5.8.3 e Argo CD 3.5.2 por padrão. Os guias comuns estão em [ARGOCD.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/ARGOCD.md) e [TRY-LOCAL.md](https://github.com/Solierrr/docs-warehouse/blob/main/helps/TRY-LOCAL.md).

O `make lint` executa o kubeconform ignorando os schemas ausentes, e o CI usa o kubeconform 0.7.0 em container, enquanto `make test`, `make build` e `make dev` não têm comando próprio configurado.

| Comando | Efeito |
|---|---|
| `make cluster-up` | Cria k3d e instala Argo CD |
| `make cluster-apps APPS="api-core api-auth"` | Aplica Applications selecionadas |
| `make cluster-secrets SERVICES="api-core"` | Exporta configuração autorizada do Infisical para o cluster local |
| `make cluster-status` | Mostra Applications |
| `make cluster-ui` | Abre port-forward em https://localhost:8085 |
| `make cluster-down` | Remove o cluster local |

O script usa um kubeconfig próprio e o contexto `k3d-local`, e como o `make vault` não tem pastas configuradas, os segredos locais vêm do `cluster-secrets`, com o `SECRETS_ENV` selecionando o ambiente. Sem acesso ao Infisical essa etapa falha.