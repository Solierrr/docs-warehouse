<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/react.png" alt="React" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/vite.png" width="100" hspace="8" alt="Vite" title="Vite">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/tailwind.png" width="100" hspace="8" alt="Tailwind CSS" title="Tailwind CSS">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/storybook.png" width="100" hspace="8" alt="Storybook" title="Storybook">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/firebase.png" width="100" hspace="8" alt="Firebase" title="Firebase">
</p>

# Arquitetura do Repositório

As aplicações web são aplicações de página única em React com TypeScript, servidas pelo Vite. O código se separa por responsabilidade: as telas roteadas ficam em `pages/`, as peças de interface reutilizáveis em `components/`, o acesso aos dados de cada assunto em `features/` e a infraestrutura comum (idioma, Firebase, logs e mocks) em `config/`. Cada camada de acesso à API já nasce com um caminho de fallback para dados simulados, o que permite desenvolver a interface sem o backend no ar.

- **Rotas:** declaradas num único lugar, como listas de definições, e multiplicadas para cada idioma suportado (`/pt-BR/...`, `/en-US/...`, `/es-ES/...`), sem duplicar componentes.
- **Dados por assunto:** cada domínio tem o seu `*.service.ts` com as chamadas HTTP, os tipos e, quando houver, os mocks. Um cliente HTTP fino padroniza erro e log.
- **Modo mock:** a variável `VITE_MOCKS` (`ALWAYS`, `FALLBACK` ou `DEACTIVATED`) decide se a chamada vai à API real ou volta um dado simulado, inclusive quando a API real falha.
- **Idioma:** `i18next` com dicionários por idioma e por assunto; o idioma é resolvido a partir da URL.
- **Componentes:** organizados por categoria (primitivos de interface, layout, feedback, sobreposições e marca), estilizados com Tailwind e documentados no Storybook.
- **Autenticação e Firebase:** a sessão é guardada no navegador, e o Firestore atende o que precisa de tempo real, como o indicador de digitação do chat.
- **Testes:** Vitest com Testing Library, com os arquivos ao lado do código, e um projeto de testes do Storybook.
- **Variáveis públicas:** tudo que começa com `VITE_` vai para o navegador, então nenhuma chave interna entra ali.

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

## Veja também

- [Como rodar um projeto TypeScript](../running/TYPESCRIPT.md)
- [Segredos e variáveis](../infisical/README.md)
- [Deploy de QA](../deploy/QA_RENDER.md) e [de produção](../deploy/PROD_GKE_ARGOCD.md)
