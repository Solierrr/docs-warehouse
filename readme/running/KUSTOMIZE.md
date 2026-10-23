<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/argocd.png" alt="Argo CD" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
</p>

# Rodando o Projeto Localmente

Este repositório é um conjunto de manifestos Kubernetes gerenciados com Kustomize — não tem código de aplicação nem "servidor de desenvolvimento". Testar uma mudança aqui significa renderizar o manifesto final com `kustomize build` e revisar o diff antes do merge em `main`.

## Possíveis Impedimentos

- **`kubectl` instalado** (já inclui `kustomize` embutido desde a v1.14), necessário para renderizar e validar os manifestos.
- **Acesso ao cluster GKE para aplicar de fato**, renderizar o manifesto localmente não exige cluster, mas testar o efeito real exige `kubectl apply` contra um cluster ativo.
- **Secrets de exemplo não são os reais**, arquivos como `secret.example.yaml` são apenas referência de formato — os valores reais são injetados via [Infisical](https://infisical.com) ou pelo ArgoCD, nunca commitados neste repositório.

## Instalação do Projeto

### Iniciando o repositório com o Github

Clone o repositório e abra no VS Code (com a extensão YAML para validação de schema).

```Comandos para clonar o repositório
git clone https://github.com/Solierrr/<repo>.git
cd ./<repo>
code . -r
```

### Renderizando e validando os manifestos

`kubectl kustomize` renderiza o manifesto final (todas as overlays aplicadas) sem tocar no cluster — revise a saída antes de aplicar de verdade.

```Comandos para renderizar e validar
kubectl kustomize . 
kubectl apply --dry-run=client -k .
```
