<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/html.png" alt="HTML5" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/javascript.png" width="100" hspace="8" alt="JavaScript" title="JavaScript">
</p>

# Rodando o Projeto Localmente

O `elos-frontend` são páginas estáticas: não há `npm install`, build nem servidor próprio. O processo local é abrir a pasta num servidor de arquivos e visitar as páginas no navegador. Antes de iniciar, veja os impedimentos abaixo: as telas que gravam dados dependem do serviço de cadastros.

## Possíveis Impedimentos

- **Branch certa.** A `main` tem só a página inicial. Para ver login, recuperação de senha, sobre nós e gerenciamento de usuários, faça o checkout da branch correspondente (lista em [STATUS.md](./STATUS.md)).
- **Serviço de cadastros no ar.** A tela de gerenciamento (`crudUsuario.html`) chama `/crudUsuario-insert` e `/crudUsuario` com caminhos relativos. Aberta por um servidor estático simples, essas chamadas não chegam ao serviço. É preciso servir a página na mesma origem do `elos-backend` ou colocar um proxy na frente dos dois. Suba o serviço antes, conforme o [RUNNING.md do `elos-backend`](https://github.com/Solierrr/elos-backend/blob/main/docs/RUNNING.md).
- **Imagens e ícones.** As páginas referenciam `assets/icone/` e `assets/img/` por caminho relativo; abra sempre a partir da raiz do repositório.

## Instalação do Projeto

### Clonando o repositório

```bash
git clone https://github.com/Solierrr/elos-frontend.git
cd elos-frontend
```

### Abrindo as páginas

Pela IDE, com a extensão Live Server do VS Code: abra a pasta e use "Open with Live Server". A configuração do repositório (`.vscode/settings.json`) usa a porta `5501`.

Ou por qualquer servidor estático, a partir da raiz:

```bash
python -m http.server 5501
```

Depois abra `http://localhost:5501/` no navegador.

## Veja também

- [Arquitetura](./ARCHITECTURE.md)
- [Estado e pendências](./STATUS.md)
