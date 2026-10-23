<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/java.png" alt="Java" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/tomcat.png" width="100" hspace="8" alt="Apache Tomcat" title="Apache Tomcat">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
</p>

# Arquitetura do Repositório

O `elos-backend` é uma aplicação web Java empacotada como WAR e executada em um Tomcat 11 (Jakarta EE 10). Não usa Spring: cada operação é um servlet anotado com `@WebServlet`, que recebe o formulário, chama uma classe de serviço para validar e aplicar a regra, e esta chama um DAO que fala com o PostgreSQL por JDBC. A tela de gerenciamento é uma página JSP com JSTL, que recebe do servlet as listas e as mensagens de erro. O fluxo é o de um MVC clássico, e cada cadastro (usuário, profissional, fornecedor e empresa demandante) segue o mesmo desenho, o que torna fácil acrescentar um novo. Este documento descreve a branch `main`; o trabalho mais recente está em outras branches (ver [STATUS.md](./STATUS.md)).

- **Camadas por cadastro:** `servlet/<cadastro>` (um servlet por operação: Insert, Read, Update e Delete), `service/<cadastro>` (validação, DTOs e regra), `dao` (SQL) e `model` (entidades). O `GenericDAO<T>` define o contrato comum: `insert`, `readById`, `readAll`, `updateById` e `deleteById`.
- **Validação centralizada no serviço:** cada serviço devolve uma lista de erros em vez de lançar exceção. Os erros são enums que implementam `GenericExceptionEnum` e têm código numérico e mensagem (por exemplo, `ErrosDadosUsuario`, de 101 a 117). O servlet só guarda a lista na sessão e redireciona. Na `main`, só o serviço de usuário está no pacote que os servlets importam (ver [STATUS.md](./STATUS.md)).
- **Feedback por sessão (Post/Redirect/Get):** depois de um `POST` o servlet grava na sessão as mensagens e os valores digitados (`mensagensInsert`, `emailInsert`...), redireciona para a rota de leitura e a página lê e mostra. Um atributo (`abrirInsert`) diz ao JavaScript da página para reabrir o pop-up com os erros. Os atributos são limpos no início das operações de escrita e quando a leitura recebe `sairPressionado=true`.
- **Acesso a dados:** os seis DAOs usam `PreparedStatement` com parâmetros, e a classe `Conexao` abre a conexão JDBC com as credenciais lidas do `.env` (`DB_URL`, `DB_USUARIO` e `DB_SENHA`), validando que cada uma existe e não está vazia.
- **Rotas por anotação:** o `web.xml` está vazio; as rotas vêm das anotações dos servlets (ver [ROUTES.md](./ROUTES.md)).
- **Domínio:** `Usuario` (tipo `FORNECEDOR`, `EMPRESA_DEMANDANTE` ou `PROFISSIONAL`, raio de procura em km), `Profissional` (profissão, CPF e fornecedor), `Fornecedor` (tipo `FABRICANTE`, `DISTRIBUIDOR`, `REVENDEDOR` ou `INTEGRADOR`, CNPJ e razão social), `EmpresaDemandante` (CNPJ, razão social e se é mandante), `Endereco` (estado, cidade, bairro, CEP, logradouro, número e complemento) e `Telefone` (número, tipo `PESSOAL` ou `EMPRESARIAL` e se é o principal). As tabelas são `usuario`, `fornecedor`, `profissional`, `empresa_demandante`, `endereco` e `telefone`.

## Estrutura do repositório

```text
├── .mvn/wrapper/
├── src/main/
│   ├── java/
│   │   ├── conexao/            Conexao (JDBC + .env)
│   │   ├── dao/                GenericDAO e um DAO por entidade
│   │   ├── exception/          enums de erro com código e mensagem
│   │   ├── model/              entidades e enums de tipos
│   │   ├── service/            usuario, profissional e fornecedor (a empresaDemandante está em outra branch)
│   │   └── servlet/            empresaDemandante, fornecedor, profissional e usuario
│   └── webapp/
│       ├── WEB-INF/
│       │   ├── view/usuario/crudUsuario.jsp
│       │   └── web.xml
│       └── index.jsp
├── Dockerfile
├── mvnw
├── mvnw.cmd
├── pom.xml
├── LICENSE
└── README.md
```

O repositório também traz a pasta `.idea/` e o arquivo `src/main/main.zip` (uma cópia compactada de uma versão antiga das fontes, de agosto); ver [STATUS.md](./STATUS.md).

## Veja também

- [Rotas](./ROUTES.md)
- [Como rodar](./RUNNING.md)
