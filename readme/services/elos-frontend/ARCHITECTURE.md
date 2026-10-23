<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/html.png" alt="HTML5" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/javascript.png" width="100" hspace="8" alt="JavaScript" title="JavaScript">
</p>

# Arquitetura do Repositório

O `elos-frontend` é um conjunto de páginas HTML estáticas, com CSS próprio e JavaScript puro, sem framework, sem gerenciador de pacotes e sem etapa de construção. Cada tela é um arquivo `.html` na raiz que carrega as folhas de estilo da pasta `style/` e, quando precisa de comportamento, os scripts da pasta `js/`. Como não há servidor próprio, as telas que gravam dados chamam rotas do serviço de cadastros (`elos-backend`) com `fetch`. Este documento descreve a branch `main`, que hoje tem só a página inicial; as demais telas estão em branches de trabalho (ver [STATUS.md](./STATUS.md)).

- **Estilos em camadas:** `variables.css` guarda os valores base (cores e medidas), `style.css` e `text.css` trazem a base e a tipografia, e cada tela tem a sua folha (`landing.css`, `login.css`, `crud.css`, `aboutus.css`...). As páginas carregam, em geral, `variables.css`, `style.css` e `text.css`, nessa ordem, e depois a folha da própria tela.
- **Uma tela, um arquivo:** `index.html` (página inicial), `tela_login.html`, `telaEsqueceuSenha.html`, `paginaAboutUs.html` e `crudUsuario.html`. Os nomes variam entre as branches, e a navegação entre as telas ainda é feita por links simples.
- **Página inicial:** cabeçalho com logo, navegação (Início e Sobre nós), caixa de pesquisa e os botões Entrar e Cadastrar; uma faixa de destaque com a proposta ("Um elo entre comprador e fornecedor"); um arco em SVG de transição; e a seção "Explore nossos objetivos", com os três objetivos: busca geográfica, divulgação e comunicação.
- **Tela de gerenciamento de usuários (branch `crudUsuario`):** uma página com barra lateral recolhível, tabela, filtros e pop-ups de inserir e alterar. O JavaScript é dividido por responsabilidade: `crud.js` (chamadas ao serviço), `formularioInsertUsuario.js` (formulário), `mensagensSpans.js` (mensagens de erro), `popUps.js`, `variacoesFiltros.js` (filtros) e `abrirSidebar.js`. Um campo oculto (`nome-do-arquivo`) indica qual cadastro a página mostra, o que sugere que o mesmo script foi pensado para outros cadastros.
- **Conversa com o serviço:** o `crud.js` usa `fetch` com caminhos relativos (`/crudUsuario-insert` e `/crudUsuario`), então a página precisa ser servida na mesma origem do serviço de cadastros (por exemplo, atrás de um proxy) ou o caminho precisa ser ajustado. O formulário de login usa `fetch(formulario.action)`. As rotas estão em [ROUTES.md do `elos-backend`](https://github.com/Solierrr/elos-backend/blob/main/docs/ROUTES.md).
- **Tela de entrada:** `login.js` alterna a visibilidade da senha, valida o formulário durante a digitação e envia por `fetch`.

## Estrutura da branch `main`

```text
├── assets/
│   ├── icone/            logo e ícones em SVG
│   └── img/              imagens da página inicial
├── style/
│   ├── landing.css
│   ├── style.css
│   ├── text.css
│   └── variables.css
├── DOCUMENTO_ENTREGAS.md   (vazio)
├── LICENSE
├── README.md
└── index.html
```

Nas outras branches aparecem as pastas `js/` e arquivos como `crud.css`, `login.css` e `aboutus.css`. A pasta `.vscode/` define a porta `5501` do Live Server.

## Veja também

- [Como rodar](./RUNNING.md)
- [Estado e pendências](./STATUS.md)
