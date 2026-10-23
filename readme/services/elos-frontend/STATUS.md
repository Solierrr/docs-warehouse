<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/html.png" alt="HTML5" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/javascript.png" width="100" hspace="8" alt="JavaScript" title="JavaScript">
</p>

# Estado e pendências

Levantamento feito em 2026-10-23 a partir do código no GitHub, sem abrir as páginas no navegador. O que o código não confirma está marcado como `{a confirmar}`.

## O que cada branch contém

| Branch | Conteúdo | Relação com a `main` |
|---|---|---|
| `main` | `index.html` (página inicial) e os estilos | base deste documento |
| `landingpage` | versão mais completa da página inicial (`index.html` maior e `landing.css` ampliado) | divergiu: 10 commits próprios e 6 atrás |
| `crudUsuario` | `crudUsuario.html`, `crud.css` e seis scripts em `js/` | divergiu: 3 commits próprios e 2 atrás |
| `paginaAboutUs` | `paginaAboutUs.html`, `aboutus.css` e `aboutusScript.js` | 4 commits à frente, sem divergência |
| `telalogin` | `tela_login.html`, `login.css` e `login.js` | sem ancestral comum com a `main` |
| `telaEsqueceuSenha` | telas de esqueci a senha, código por e-mail e redefinição | sem ancestral comum com a `main` |
| `atualizacoes_arquitetura` | só `.gitignore` e `DOCUMENTO_ENTREGAS.md`, vazios | 5 commits atrás |

As branches `telalogin` e `telaEsqueceuSenha` não têm ancestral comum com a `main`: têm um histórico independente e não podem ser mescladas diretamente; seria preciso trazer os arquivos à mão ou unir os históricos.

## Pendências conhecidas

- **A `main` só tem a página inicial.** As outras telas estão em branches e ainda não foram reunidas.
- **Navegação sem destino.** Na página inicial, os links "Início" e "Sobre nós" têm `href=""`, e os botões Entrar, Cadastrar e "Saiba mais!" não têm ação definida.
- **Dependência do serviço por caminho relativo.** A tela de gerenciamento só funciona na mesma origem do `elos-backend`; ver [RUNNING.md](./RUNNING.md). {a confirmar: como as duas partes serão servidas juntas}
- **Nomes de arquivo inconsistentes.** Há `tela_login.html`, `telaEsqueceuSenha.html` e `paginaAboutUs.html` (e um `Index.html` com maiúscula na branch `telaEsqueceuSenha`), o que quebra links em sistemas de arquivos que diferenciam maiúsculas.
- **Sem testes, sem build e sem CI.** Não há `.github/` nem `package.json`.
- **Sem deploy definido.** Nenhuma configuração de hospedagem no repositório. {a confirmar: onde as páginas serão publicadas}
- **Documentação.** O `README.md` tem só o nome e uma linha, e o `DOCUMENTO_ENTREGAS.md` está vazio.
- **Padrão da organização.** O repositório não segue os padrões de CI, release, rulesets e templates da organização.

## Contribuidores

Segundo o GitHub: `CamilySabate` (9 commits) e `Arthur-Ferraz123` (3 commits).
