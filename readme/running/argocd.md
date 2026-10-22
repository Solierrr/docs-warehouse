<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/argocd.png" alt="Argo CD" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gcp.png" width="100" hspace="8" alt="Google Cloud" title="Google Cloud">
</p>

# Rodando o Projeto Localmente

Este repositório é um repositório de manifestos GitOps (ArgoCD) — não tem código de aplicação nem "servidor de desenvolvimento". Testar uma mudança aqui significa validar o manifesto YAML e, se possível, conferir o diff contra o cluster antes do merge em `main` (o que dispara o sync automático do ArgoCD).

## Possíveis Impedimentos

- **ArgoCD CLI instalado**, necessário para rodar `argocd app diff` contra o cluster antes de abrir a Pull Request.
- **`kubectl` configurado com acesso ao cluster GKE**, sem isso não é possível validar o manifesto contra o estado real do cluster, só a sintaxe YAML.
- **Cluster GKE em pé**, como o cluster é efêmero (ver [Infra-platform](https://github.com/Solierrr/infra-platform)), validar contra um cluster real só é possível quando ele está ativo.
- **Mudanças aqui afetam produção diretamente**, ao contrário de um serviço rodando localmente, qualquer merge em `main` neste repositório é sincronizado automaticamente pelo ArgoCD — revise o diff com atenção antes de abrir a Pull Request.

## Instalação do Projeto

### Iniciando o repositório com o Github

Clone o repositório e abra no VS Code (com a extensão YAML para validação de schema).

```Comandos para clonar o repositório
git clone https://github.com/Solierrr/<repo>.git
cd ./<repo>
code . -r
```

### Validando os manifestos

`kubectl apply --dry-run` valida a sintaxe e o schema do manifesto sem aplicar nada no cluster. `argocd app diff` mostra exatamente o que mudaria no cluster real, aplicação por aplicação.

```Comandos para validar os manifestos
kubectl apply --dry-run=client -f apps/<app>.yaml
argocd app diff <app>
```
