<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/vite.png" width="100" hspace="8" alt="Vite" title="Vite">
</p>

# Arquitetura do Repositório

O `lib-web` é a biblioteca de componentes React compartilhada pelas aplicações web da plataforma, publicada no npm. Ela reúne os componentes de interface, os tokens do sistema de design (cores, fontes e espaçamentos), os modelos de e-mail e utilitários de observabilidade. O build é feito com Vite em modo biblioteca, e cada componente é documentado e testado no Storybook.

- **Componentes (`src/components/`):** peças de interface prontas para uso, exportadas pelo ponto de entrada da biblioteca.
- **Tokens (`src/tokens/`):** valores do sistema de design, gerados por script e consumidos pelos componentes.
- **E-mails (`src/email/`):** modelos de e-mail com a identidade visual da plataforma.
- **Textos (`src/locales/`):** traduções usadas pelos componentes.
- **Observabilidade (`src/observability/`):** utilitários de telemetria para as aplicações que usam a biblioteca.
- **Documentação (`.storybook/` e `src/stories/`):** exemplos visuais de cada componente.
- **Scripts (`scripts/`):** geração de tokens e da identidade dos e-mails e empacotamento dos assets.

## Estrutura do repositório

```text
├── .github/
├── .storybook/
├── docs/
├── public/
├── scripts/
├── src/
│   ├── assets/
│   ├── components/
│   ├── email/
│   ├── locales/
│   ├── observability/
│   ├── shared/
│   ├── stories/
│   ├── tokens/
│   ├── index.ts
│   └── style.css
├── index.ts
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```
