<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/template.png" alt="Template" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/helm.png" width="100" hspace="8" alt="Helm" title="Helm">
</p>

# Rodando o Projeto Localmente

Este repositório é um Helm chart (configuração de infraestrutura) — não tem código de aplicação nem "servidor de desenvolvimento". Testar uma mudança aqui significa renderizar o chart com `helm template` e revisar o manifesto resultante antes do merge em `main`.

## Possíveis Impedimentos

- **Helm CLI instalado**, necessário para renderizar (`helm template`) e, se aplicável, instalar (`helm install`/`helm upgrade`) o chart.
- **Acesso ao cluster GKE para aplicar de fato**, renderizar o chart localmente não exige cluster, mas testar o efeito real exige `kubectl`/`helm` apontando para um cluster ativo.
- **Múltiplos arquivos de values (`values-dev.yaml`, `values-prod.yaml`)**, sempre combine o `values-base.yaml` com o arquivo do ambiente correspondente — usar só o base sem o overlay de ambiente gera uma configuração incompleta.

## Instalação do Projeto

### Iniciando o repositório com o Github

Clone o repositório e abra no VS Code (com a extensão YAML para validação de schema).

```Comandos para clonar o repositório
git clone https://github.com/Solierrr/<repo>.git
cd ./<repo>
code . -r
```

### Renderizando e validando o chart

`helm template` renderiza o manifesto final combinando o chart com os `values` do ambiente, sem tocar no cluster — revise a saída antes de aplicar de verdade.

```Comandos para renderizar e validar
helm template <release> <chart> -f values-base.yaml -f values-dev.yaml
```
