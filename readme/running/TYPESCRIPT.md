<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/vite.png" alt="Vite" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# Rodando o Projeto Localmente

Este repositório é TypeScript (Vite). O processo local é sempre o mesmo: clonar, abrir na IDE, instalar as dependências via `npm` e subir o servidor de desenvolvimento. Antes de iniciar, verifique a seção de impedimentos abaixo — alguns repositórios dependem de credenciais externas mesmo em ambiente local.

## Possíveis Impedimentos

- **Node.js na versão usada no `Dockerfile`** (`node:22-alpine` ou equivalente), rodar com uma versão diferente pode gerar builds inconsistentes com o que roda em produção.
- **Firebase configurado**, repositórios com `firebase.json` dependem de um projeto Firebase válido (Auth, Firestore) para funcionar localmente além do build estático — sem credenciais, telas que dependem de dados reais ficam quebradas.
- **Secrets locais**, variáveis `VITE_*` equivalentes às injetadas em runtime pelo [Infisical](https://infisical.com) (URLs de API, chaves públicas) precisam ser criadas manualmente em um `.env.local` — sem elas, o app builda mas falha ao tentar se conectar no backend.

## Instalação do Projeto

### Iniciando o repositório com o Github

Clone o repositório e abra no VS Code.

```Comandos para clonar o repositório
git clone https://github.com/Solierrr/<repo>.git
cd ./<repo>
code . -r
```

### Instalando dependências necessárias para rodar o projeto localmente

```Comandos para instalação de dependências
npm install
npm run dev
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
