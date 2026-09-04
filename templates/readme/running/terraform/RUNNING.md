# Rodando o Projeto Localmente

Este repositório é Terraform (IaC). Não há "servidor de desenvolvimento" — rodar localmente significa validar/planejar mudanças de infraestrutura antes de aplicá-las no Google Cloud. O fluxo local é sempre o mesmo: clonar, autenticar no GCP, rodar `terraform plan` para revisar o diff, e só então `terraform apply`.

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=terraform,gcp,github" height="48" alt="Rodando o Projeto — Terraform">
  </a>
</p>

## Possíveis Impedimentos

- **Terraform CLI instalado**, na versão travada em `.terraform.lock.hcl` — versões diferentes podem gerar diffs de provider inesperados.
- **Acesso ao Google Cloud (`gcloud auth application-default login`)**, o provider Google do Terraform usa Application Default Credentials — sem isso, `terraform plan` falha na autenticação.
- **Permissão de owner/editor no projeto GCP**, criar/alterar recursos de cluster (GKE, IAM, redes) exige permissões elevadas, normalmente restritas a poucas pessoas na organização.
- **`terraform apply` é uma ação real e cobrada**, ao contrário de rodar uma aplicação localmente, aplicar este Terraform sobe recursos de verdade no Google Cloud — nunca rode `apply` sem antes revisar o `plan` com atenção.

## Instalação do Projeto

### Iniciando o repositório com o Github

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=github,vscode" height="48" alt="Frameworks">
  </a>
</p>

Clone o repositório e abra no VS Code (com a extensão HashiCorp Terraform para syntax highlighting e validação).

```Comandos para clonar o repositório
git clone https://github.com/Solierrr/<repo>.git
cd ./<repo>
code . -r
```

### Validando e aplicando as mudanças

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=terraform" height="48" alt="Frameworks">
  </a>
</p>

`terraform init` baixa os providers e configura o backend remoto do state — rode sempre que clonar o repositório ou trocar de branch com mudanças no backend.

```Comandos para validar e aplicar mudanças
terraform init
terraform plan
terraform apply
```
