<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/react.png" alt="React" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/vite.png" width="100" hspace="8" alt="Vite" title="Vite">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/tailwind.png" width="100" hspace="8" alt="Tailwind CSS" title="Tailwind CSS">
</p>

# Arquitetura do Repositório

O `web-sandbox` é uma aplicação React com TypeScript, servida pelo Vite e publicada no Render como site estático. Ela usa os componentes da `lib-web`, consumidos a partir de um pacote versionado no próprio repositório, e se autentica no `api-auth` de QA. O conteúdo das telas vem de uma configuração local com os repositórios e serviços da plataforma, e não há backend próprio.

- **Funcionalidades (`src/features/`):** login, catálogo de repositórios, tela para reativar os serviços de QA e documentação das APIs com Swagger UI.
- **Configuração (`src/config/`):** lista de repositórios e serviços, URLs por ambiente e catálogo das APIs.
- **Autenticação:** sessão do `api-auth` de QA; em desenvolvimento local, um modo simulado permite entrar sem chamar a API.
- **Biblioteca (`vendor/`):** pacote da `lib-web` versionado no repositório, para usar alterações ainda não publicadas.
- **Testes:** Vitest com Testing Library.

## Estrutura do repositório

```text
├── .github/
├── docs/
├── public/
├── src/
│   ├── assets/
│   ├── config/
│   ├── features/
│   ├── App.tsx
│   └── main.tsx
├── vendor/
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```
