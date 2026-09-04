# Rodando o Projeto Localmente

Este repositório é Java + Maven. O processo local é sempre o mesmo: clonar, abrir na IDE, baixar as dependências via `mvnw` e subir a aplicação. Antes de iniciar, verifique a seção de impedimentos abaixo — alguns repositórios dependem de credenciais externas mesmo em ambiente local.

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=java,springboot,spring,github,gcp" height="48" alt="Rodando o Projeto — Java">
  </a>
</p>

## Possíveis Impedimentos

- **JDK 21 instalado localmente**, a mesma versão usada no [`templates/docker/jvm-maven/Dockerfile`](../../../docker/jvm-maven/Dockerfile) (`eclipse-temurin:21`) — rodar fora do container exige essa versão instalada e configurada como `JAVA_HOME`.
- **Acesso ao Google Cloud (`gcloud auth login`)**, serviços que integram com GCP em runtime precisam de credenciais válidas na máquina para autenticar localmente, já que em produção isso vem do manifesto do [Infra-gitops](https://github.com/Solierrr/infra-gitops).
- **Secrets locais**, variáveis de ambiente equivalentes às injetadas em runtime pelo [Infisical](https://infisical.com) (credenciais de banco, chaves de API) precisam ser criadas manualmente (`application-local.yml` ou `.env`, conforme o repositório) — sem elas, a aplicação sobe mas falha ao tentar se conectar em dependências externas.

## Instalação do Projeto

### Iniciando o repositório com o Github

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=github,intellij" height="48" alt="Frameworks">
  </a>
</p>

Clone o repositório e abra no IntelliJ IDEA.

```Comandos para clonar o repositório
git clone https://github.com/Solierrr/<repo>.git
cd ./<repo>
idea .
```

### Instalando dependências necessárias para rodar o projeto localmente

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=maven,apache" height="48" alt="Frameworks">
  </a>
</p>

Use sempre o wrapper (`mvnw`/`mvnw.cmd`) em vez de um Maven instalado globalmente, para garantir a mesma versão usada no CI.

```Comandos para instalação de dependências
./mvnw dependency:go-offline
./mvnw spring-boot:run
```
