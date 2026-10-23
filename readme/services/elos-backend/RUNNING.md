<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/java.png" alt="Java" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/tomcat.png" width="100" hspace="8" alt="Apache Tomcat" title="Apache Tomcat">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
</p>

# Rodando o Projeto Localmente

O `elos-backend` roda dentro de um Tomcat 11, empacotado como WAR. O caminho mais curto é abrir o projeto na IDE (a pasta `.idea/` já traz o artefato `Elos:war exploded`), apontar para um Tomcat 11 e subir. Também é possível gerar o WAR com o Maven wrapper e copiá-lo para o Tomcat, ou usar o `Dockerfile`. Antes de iniciar, veja os impedimentos abaixo.

## Possíveis Impedimentos

- **JDK 25.** O `pom.xml` compila com `maven.compiler.source` e `target` em 25, a mesma versão das imagens do `Dockerfile` (`eclipse-temurin-25`).
- **Tomcat 11 (Jakarta EE 10).** A aplicação usa `jakarta.servlet`, então Tomcat 9 e 10 não servem.
- **PostgreSQL com as tabelas criadas.** O repositório não traz script de criação nem de migração. As tabelas esperadas são `usuario`, `fornecedor`, `profissional`, `empresa_demandante`, `endereco` e `telefone`. {a confirmar: de onde sai o schema, por exemplo um script do time ou o `database-console` da organização}
- **Arquivo `.env`.** A classe `Conexao` lê `DB_URL`, `DB_USUARIO` e `DB_SENHA`. O `.gitignore` reserva o caminho `src/main/resources/.env`. Não existe `.env.example`; crie o arquivo à mão e **nunca o versione**.
- **Sem testes automatizados.** Não há pasta `src/test`.

## Instalação do Projeto

### Clonando o repositório

```bash
git clone https://github.com/Solierrr/elos-backend.git
cd elos-backend
```

### Variáveis de ambiente

Crie `src/main/resources/.env` com os valores do seu banco local:

```text
DB_URL=jdbc:postgresql://localhost:5432/<banco>
DB_USUARIO=<usuario>
DB_SENHA=<senha>
```

### Gerando o WAR

Use sempre o wrapper em vez de um Maven global, para manter a versão do projeto (3.9.6):

```bash
./mvnw clean package -DskipTests
```

O arquivo sai em `target/Elos-1.0-SNAPSHOT.war`. Copie para a pasta `webapps/` do Tomcat 11 (renomeie para `ROOT.war` se quiser servir na raiz) e inicie o Tomcat.

### Pela IDE

Abra a pasta no IntelliJ IDEA, configure um servidor Tomcat 11 e use o artefato `Elos:war exploded`. A página inicial (`index.jsp`) tem um link para `/crudUsuario`.

### Pelo Docker

```bash
docker build -t elos-backend .
docker run --rm -p 8080:8080 elos-backend
```

Veja [DEPLOYMENT.md](./DEPLOYMENT.md) antes: a imagem não define como as credenciais chegam ao container.

## Veja também

- [Rotas](./ROUTES.md)
- [Estado e pendências](./STATUS.md)
