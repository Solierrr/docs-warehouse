<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/java.png" alt="Java" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/tomcat.png" width="100" hspace="8" alt="Apache Tomcat" title="Apache Tomcat">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
</p>

# Estado e pendências

Levantamento feito em 2026-10-23 a partir do código no GitHub, sem compilar nem executar. O que o código não confirma está marcado como `{a confirmar}`.

## Branches

| Branch | Situação em relação à `main` | Último commit |
|---|---|---|
| `main` | base deste documento | 2026-10-05, ajuste no `Dockerfile` |
| `backend` | 15 commits atrás, sem commits próprios | 2026-09-06 |
| `backendArthur` | divergiu: 12 commits próprios e 15 atrás | 2026-10-03, ajuste da arquitetura |
| `backendEduardo` | divergiu: 29 commits próprios e 15 atrás | 2026-10-22, refatoração do JavaScript do CRUD e mais um CRUD |
| `Eduard0VI-patch-1` | ajuste do `Dockerfile` | 2026-10-02 |

O trabalho mais recente está na `backendEduardo` e na `backendArthur`, que ainda não voltaram para a `main`. A `EmpresaDemandanteService` existe nessas duas branches, em `service/empresaDemandante/`.

## O que funciona hoje

- Cadastro de usuário completo (inserir, ler, alterar e excluir), com validação e tela JSP.
- DAOs para os seis cadastros, todos com `PreparedStatement`.
- Serviços de usuário, profissional e fornecedor.

## Pendências conhecidas

- **A `main` provavelmente não compila.** Os servlets de fornecedor, profissional e empresa demandante importam `service.FornecedorService`, `service.ProfissionalService` e `service.EmpresaDemandanteService`, mas na `main` as classes estão em `service.fornecedor` e `service.profissional`, e a de empresa demandante não existe. {a confirmar: compilando com JDK 25}
- **Faltam três telas.** Os servlets de profissional, fornecedor e empresa demandante encaminham para `crudProfissional.jsp`, `crudFornecedor.jsp` e `crudEmpresaDemandante.jsp`, e só `crudUsuario.jsp` existe na `main`.
- **Rota com erro de digitação.** A leitura de profissional está em `/crudProfissionl`; o servlet de inserir redireciona para `/crudProfissional`.
- **Senha sem hash.** O serviço valida a senha (mínimo de 8 caracteres, com maiúscula, minúscula, número e caractere especial), mas o DAO grava o valor recebido, e não há hash no código lido.
- **Sem `.env.example` e sem `.dockerignore`.** O risco de a imagem levar o `.env` está descrito em [DEPLOYMENT.md](./DEPLOYMENT.md).
- **Sem script de banco.** O schema não está no repositório.
- **Sem testes e sem CI.** Não há `src/test` nem workflows em `.github/`.
- **Sem endereço e telefone na API.** Há DAOs, mas nenhum servlet ou serviço.
- **Arquivos que não deveriam estar versionados:** a pasta `.idea/` e `src/main/main.zip` (cópia compactada de uma versão antiga das fontes, de agosto).
- **Documentação do repositório.** O `README.md` tem só um título (`solaria-interdisciplinar`), e o `index.jsp` é o modelo "Hello World" da IDE.
- **Padrão da organização.** O repositório não segue os padrões de CI, release, rulesets e templates da organização.

## Contribuidores

Segundo o GitHub: `Eduard0VI` (34 commits) e `Arthur-Ferraz123` (5 commits).
