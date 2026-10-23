<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/react.png" alt="React" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/vite.png" width="100" hspace="8" alt="Vite" title="Vite">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/storybook.png" width="100" hspace="8" alt="Storybook" title="Storybook">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/firebase.png" width="100" hspace="8" alt="Firebase" title="Firebase">
</p>

# Arquitetura de uma aplicação web

README reutilizável, usado como base do `ARCHITECTURE.md` das aplicações front-end (`web-app`, `web-sandbox`) e da biblioteca de componentes (`lib-web`). São aplicações de página única em React com TypeScript, servidas pelo Vite. O código se separa por responsabilidade: as telas roteadas ficam em `pages/`, as peças de interface reutilizáveis em `components/`, o acesso aos dados de cada assunto em `features/` e a infraestrutura comum (idioma, Firebase, logs, mocks) em `config/`. Escreva o documento em português, em parágrafos corridos, com no mínimo 60 palavras na introdução e quatro bullets de decisões.

## O que descrever

- **Rotas.** Onde são declaradas, como se aplicam os idiomas (`/pt-BR/...`, `/en-US/...`, `/es-ES/...`) e quais rotas são públicas ou exigem sessão.
- **Dados por assunto.** Cada domínio tem seu `*.service.ts` com as chamadas HTTP, os tipos e, quando houver, os mocks. Descreva a camada HTTP fina que padroniza erro e log.
- **Modo mock.** A variável `VITE_MOCKS` (`ALWAYS`, `FALLBACK` ou `DEACTIVATED`) decide se a chamada vai à API real ou volta um dado simulado, o que permite desenvolver sem o backend no ar.
- **Idioma.** Biblioteca de tradução, onde ficam os dicionários por assunto e como o idioma é resolvido a partir da URL.
- **Componentes.** Como se organizam (primitivos de interface, layout, feedback, sobreposições, marca), o que vem da biblioteca compartilhada e o que é local, e onde cada um é documentado no Storybook.
- **Autenticação e Firebase.** Como a sessão é guardada, o que usa Firestore (por exemplo o indicador de digitação no chat) e quais chaves são públicas.
- **Testes.** Vitest com Testing Library, arquivos ao lado do código e o projeto de testes do Storybook.
- **Entrega.** Como é publicada: imagem Nginx no GKE ou site estático no Render.

## Estrutura típica

```text
├── .github/
├── docs/
├── public/
├── src/
│   ├── assets/
│   ├── components/        ui, layout, feedback, overlay e brand
│   ├── config/            i18n, firebase, logging e mocks
│   ├── features/          um serviço e um conjunto de tipos por assunto
│   ├── lib/               cliente HTTP e utilidades compartilhadas
│   ├── pages/
│   └── routes/
├── .storybook/
├── Dockerfile
├── Makefile
├── package.json
├── vite.config.ts
└── README.md
```

## Checklist antes de abrir o Pull Request

- A árvore do documento bate com as pastas reais.
- Variáveis `VITE_*` citadas existem no `.env.example` e **nenhuma é chave interna**, porque vão para o navegador.
- A lista de rotas e de idiomas corresponde ao código de roteamento.
- Pontos que o código não confirma estão marcados como `{a confirmar: ...}`.

## Veja também

- [Como rodar um projeto TypeScript](../running/TYPESCRIPT.md)
- [Segredos e variáveis](../infisical/README.md)
- [Deploy de QA](../deploy/QA_RENDER.md) e [de produção](../deploy/PROD_GKE_ARGOCD.md)
