<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/java.png" alt="Java" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/tomcat.png" width="100" hspace="8" alt="Apache Tomcat" title="Apache Tomcat">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
</p>

# Deploy

O repositório traz um `Dockerfile` e nenhum workflow de CI, de release nem de deploy. Ele está fora do padrão de deploy da organização (QA no Render, produção no GKE); o que existe hoje é só a construção da imagem. Onde ela roda, e como, ainda não está definido no repositório. {a confirmar: ambiente, URL e quem publica}

## Imagem Docker

O `Dockerfile` é multi-stage:

1. **Build:** `maven:3.9-eclipse-temurin-25`. Copia o `pom.xml`, baixa as dependências (`mvn dependency:go-offline`), copia `src` e gera o WAR com `mvn clean package -DskipTests`.
2. **Execução:** `tomcat:11.0-jdk25-temurin-jammy`. Remove os aplicativos de exemplo de `webapps/`, copia o WAR como `ROOT.war` (a aplicação responde na raiz), expõe a porta `8080` e inicia com `catalina.sh run`.

Os testes ficam de fora do build (`-DskipTests`), e o repositório não tem testes.

## Segredos

Não há `.dockerignore` e o `Dockerfile` faz `COPY src ./src`. Se existir um `src/main/resources/.env` na máquina que constrói a imagem, ele entra na imagem dentro do WAR. Como a classe `Conexao` carrega o `.env` com `Dotenv.load()`, sem `ignoreIfMissing()`, a aplicação também pode falhar ao iniciar quando o arquivo não existe. {a confirmar: se a imagem sobe com as credenciais vindo só de variáveis de ambiente do container}

Antes de publicar qualquer imagem:

- Crie um `.dockerignore` com `.env`, `.git` e `target`.
- Entregue `DB_URL`, `DB_USUARIO` e `DB_SENHA` pelo ambiente do container, não pela imagem. A forma recomendada na organização está em [segredos e variáveis](https://github.com/Solierrr/docs-warehouse/blob/main/readme/infisical/README.md).

## Para entrar no padrão da organização

Ver os documentos de deploy reutilizáveis: [QA no Render](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md) e [produção no GKE](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PROD_GKE_ARGOCD.md). Isso exigiria, no mínimo, os workflows de CI e de release, a branch `qa` e a leitura das credenciais por variáveis de ambiente.
