# Rodando o Projeto Localmente

Este repositório é TypeScript (Vite). O processo local é sempre o mesmo: clonar, abrir na IDE, instalar as dependências via `npm` e subir o servidor de desenvolvimento. Antes de iniciar, verifique a seção de impedimentos abaixo — alguns repositórios dependem de credenciais externas mesmo em ambiente local.

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=ts,react,vite,github,firebase" height="48" alt="Rodando o Projeto — TypeScript">
  </a>
</p>

## Possíveis Impedimentos

- **Node.js na versão usada no `Dockerfile`** (`node:22-alpine` ou equivalente), rodar com uma versão diferente pode gerar builds inconsistentes com o que roda em produção.
- **Firebase configurado**, repositórios com `firebase.json` dependem de um projeto Firebase válido (Auth, Firestore) para funcionar localmente além do build estático — sem credenciais, telas que dependem de dados reais ficam quebradas.
- **Secrets locais**, variáveis `VITE_*` equivalentes às injetadas em runtime pelo [Infisical](https://infisical.com) (URLs de API, chaves públicas) precisam ser criadas manualmente em um `.env.local` — sem elas, o app builda mas falha ao tentar se conectar no backend.

## Instalação do Projeto

### Iniciando o repositório com o Github

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=github,vscode" height="48" alt="Frameworks">
  </a>
</p>

Clone o repositório e abra no VS Code.

```Comandos para clonar o repositório
git clone https://github.com/Solierrr/<repo>.git
cd ./<repo>
code . -r
```

### Instalando dependências necessárias para rodar o projeto localmente

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=npm" height="48" alt="Frameworks">
  </a>
</p>

```Comandos para instalação de dependências
npm install
npm run dev
```
