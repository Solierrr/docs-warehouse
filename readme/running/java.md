<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/java.png" alt="Java" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/springboot.png" width="100" hspace="8" alt="Spring Boot" title="Spring Boot">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
</p>

# Rodando o Projeto Localmente

Este repositório é Java + Maven. O processo local é sempre o mesmo: clonar, abrir na IDE, baixar as dependências via `mvnw` e subir a aplicação. Antes de iniciar, verifique a seção de impedimentos abaixo — alguns repositórios dependem de credenciais externas mesmo em ambiente local.

## Possíveis Impedimentos

- **JDK 21 instalado localmente**, a mesma versão usada no [`templates/docker/jvm-maven/Dockerfile`](../../templates/docker/jvm-maven/Dockerfile) (`eclipse-temurin:21`) — rodar fora do container exige essa versão instalada e configurada como `JAVA_HOME`.
- **Acesso ao Google Cloud (`gcloud auth login`)**, serviços que integram com GCP em runtime precisam de credenciais válidas na máquina para autenticar localmente, já que em produção isso vem do manifesto do [Infra-gitops](https://github.com/Solierrr/infra-gitops).
- **Secrets locais**, variáveis de ambiente equivalentes às injetadas em runtime pelo [Infisical](https://infisical.com) (credenciais de banco, chaves de API) precisam ser criadas manualmente (`application-local.yml` ou `.env`, conforme o repositório) — sem elas, a aplicação sobe mas falha ao tentar se conectar em dependências externas.

## Instalação do Projeto

### Iniciando o repositório com o Github

Clone o repositório e abra no IntelliJ IDEA.

```Comandos para clonar o repositório
git clone https://github.com/Solierrr/<repo>.git
cd ./<repo>
idea .
```

### Instalando dependências necessárias para rodar o projeto localmente

Use sempre o wrapper (`mvnw`/`mvnw.cmd`) em vez de um Maven instalado globalmente, para garantir a mesma versão usada no CI.

```Comandos para instalação de dependências
./mvnw dependency:go-offline
./mvnw spring-boot:run
```

## Atalho com o Makefile padrão

Se o repositório já tem o `Makefile` padrão, os passos acima se resumem a:

```bash
make doctor   # confere as ferramentas e a sessão do Infisical
make vault    # grava o .env com os segredos do ambiente local
make install  # instala as dependências
make dev      # sobe o servidor de desenvolvimento
```

Os segredos e o `make vault` estão explicados em [segredos e variáveis](../infisical/README.md).
