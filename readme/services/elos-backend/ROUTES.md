<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/java.png" alt="Java" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/tomcat.png" width="100" hspace="8" alt="Apache Tomcat" title="Apache Tomcat">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
</p>

# Rotas

Cada cadastro tem quatro rotas, uma por operação, declaradas com `@WebServlet`. O serviço devolve páginas (JSP), não JSON: os formulários enviam `POST` e a resposta é um redirecionamento de volta para a rota de leitura, com o resultado na sessão. Os caminhos abaixo são os da branch `main`.

| Cadastro | Leitura | Inserir | Alterar | Excluir |
|---|---|---|---|---|
| Usuário | `/crudUsuario` | `/crudUsuario-insert` | `/crudUsuario-update` | `/crudUsuario-delete` |
| Profissional | `/crudProfissionl` (sem o "a", ver abaixo) | `/crudProfissional-insert` | `/crudProfissional-update` | `/crudProfissional-delete` |
| Fornecedor | `/crudFornecedor` | `/crudFornecedor-insert` | `/crudFornecedor-update` | `/crudFornecedor-delete` |
| Empresa demandante | `/crudEmpresaDemandante` | `/crudEmpresaDemandante-insert` | `/crudEmpresaDemandante-update` | `/crudEmpresaDemandante-delete` |

Não há rotas para endereço e telefone: existem os DAOs (`EnderecoDAO` e `TelefoneDAO`), mas nenhum servlet.

## Comportamento

- **Leitura (`GET` ou `POST`):** monta a lista e abre a página do cadastro (`/WEB-INF/view/<cadastro>/crud<Cadastro>.jsp`). Aceita os parâmetros `clausulaWhereNome`, `clausulaWhereValor`, `clausulaWhereValor2`, `orderBy` e `sentidoOrderBy` para filtrar e ordenar. Com `sairPressionado=true`, limpa os atributos da sessão.
- **Inserir, alterar e excluir (`POST`):** um `GET` nessas rotas só redireciona para a leitura. No sucesso, grava uma mensagem na sessão; na falha, grava a lista de erros e os valores digitados, e marca o pop-up para reabrir.
- **Parâmetros de usuário:** inserir recebe `tipoUsuarioInsert`, `emailInsert`, `senhaInsert`, `nomeInsert` e `raioProcuraKmInsert`; alterar recebe `idUpdate`, `tipoUsuarioUpdate`, `emailUpdate`, `senhaUpdate`, `nomeUpdate` e `raioProcuraKmUpdate`; excluir recebe `idDelete`.
- **Parâmetros dos demais cadastros:** os formulários de inserir seguem o padrão `<campo>Insert`; alterar e excluir seguem o de usuário (`<campo>Update` e `idDelete`). {a confirmar: alterar e excluir de profissional, fornecedor e empresa demandante}. Profissional usa `idUsuario`, `tipoUsuario`, `profissao`, `cpf` e `idFornecedor`; fornecedor usa `idUsuario`, `tipoUsuario`, `tipoFornecedor`, `cnpj` e `razaoSocial`; empresa demandante usa `idUsuario`, `tipoUsuario`, `cnpj`, `razaoSocial` e `ehMandante`.
- **Erros:** as mensagens vêm dos enums de erro (por exemplo, `ErrosDadosUsuario`, códigos 101 a 117) e aparecem na página.
- **Página inicial:** `index.jsp` é o modelo gerado pela IDE ("Hello World") com um link para `/crudUsuario`.

## Observação sobre a rota de leitura de profissional

O servlet de leitura de profissional está registrado como `/crudProfissionl`, mas o servlet de inserir profissional redireciona para `/crudProfissional`. {a confirmar: alterar e excluir}. Enquanto a rota não for corrigida, esse redirecionamento não encontra a página. Detalhes em [STATUS.md](./STATUS.md).
