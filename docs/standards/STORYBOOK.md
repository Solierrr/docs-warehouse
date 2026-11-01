# Storybook

O `web-app` e o `lib-web` documentam os componentes do mesmo jeito: mesma versão, mesmos addons, mesmas convenções de história e mesma publicação. O Storybook é a referência visual do design system.

| Repositório | Storybook publicado |
|---|---|
| `lib-web` | [solierrr.github.io/lib-web](https://solierrr.github.io/lib-web/) |
| `web-app` | [solierrr.github.io/web-app](https://solierrr.github.io/web-app/) |

## Um por repositório

- Cada repositório tem o seu Storybook, publicado no GitHub Pages, sem composição entre eles.
- O `lib-web` documenta todo componente exportado pelo pacote; é a vitrine da biblioteca.
- O `web-app` documenta só os componentes que não são do `lib-web`, inclusive os de feature (`OfferCard`, `ProjectGrid`). Não há duplicação.
- Quando um componente migra do `web-app` para o `lib-web`, a história migra junto e sai do `web-app`.
- O `web-sandbox` não tem Storybook próprio; consome os componentes do `lib-web`.

## Versão e configuração

- A mesma versão exata do Storybook e dos addons nos dois repositórios, sem `^`, `~` nem `latest`, atualizada pelo Dependabot (hoje a linha 10.6).
- Addons: `@storybook/addon-docs`, `@storybook/addon-a11y`, `@storybook/addon-vitest` e `@storybook/addon-mcp`. O Chromatic não é usado.
- Node 24 nos workflows (o `lib-web` exige Node 24 no `engines`).
- O Vitest tem dois projetos: `unit` (jsdom) e `storybook` (Chromium pelo Playwright, `@storybook/addon-vitest`). No `lib-web`, `npm test` roda só o `unit`; o `test:storybook` roda as histórias. Todo `preview.yml` roda os testes das histórias nas pull requests (`test: true` só em PR); a publicação não espera por eles.
- As histórias rodam dentro de um `MemoryRouter` (decorator global), porque componentes de navegação usam o roteador.
- Scripts no `package.json`, com os mesmos nomes nos dois repositórios:

| Script | Comando |
|---|---|
| `storybook` | `storybook dev -p 6006` |
| `build-storybook` | `storybook build` (com qualquer passo de geração antes, como os tokens do `lib-web`) |
| `test:storybook` | `vitest run --project=storybook --maxWorkers=1 --no-file-parallelism --testTimeout=30000 --hookTimeout=60000` (no `lib-web`, depois de gerar os tokens) |

`preview.tsx`:

- `tags: ["autodocs"]` para todos.
- i18n com troca de idioma na barra (`pt-BR`, `en-US`, `es-ES`), por `globalTypes` e um decorator que aplica o idioma.
- Sem barra de tema enquanto o tema escuro não existir no design system.
- `layout` padrão e os viewports do design system.

```tsx
const preview = {
  tags: ["autodocs"],
  globalTypes: {
    locale: {
      description: "Idioma",
      toolbar: {
        icon: "globe",
        items: [
          { value: "pt-BR", title: "Português" },
          { value: "en-US", title: "English" },
          { value: "es-ES", title: "Español" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { locale: "pt-BR" },
  decorators: [withLocale],
  parameters: {
    layout: "centered",
    a11y: { test: "error" },
  },
} satisfies Preview;

export default preview;
```

## Convenções de história

- Arquivo `Componente.stories.tsx` ao lado do componente, em CSF3, com `satisfies Meta<typeof Componente>`.
- `title` numa árvore única nos dois repositórios, derivada das pastas do `lib-web` (por exemplo `Brand/`, `UI/`, `Layout/`, `Forms/`, `Feedback/`, `Data/`).
- Uma história `Default` e uma por estado relevante: carregando, vazio, erro, desabilitado, texto longo.
- `args` para tudo que é configurável e `argTypes` com controle e descrição. JSDoc nas props, que o autodocs mostra.
- `play` nos componentes interativos (formulários, diálogos, menus), que roda como teste pelo `addon-vitest`.
- Sem dados reais. Textos vindos das traduções, não fixos em português.
- Acessibilidade: nenhuma violação do `addon-a11y` em nível `error`. Exceção só justificada na própria história, em `parameters.a11y`.
- Só componentes. Páginas e telas inteiras nunca entram.

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Salvar",
    variant: "primary",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
      description: "Estilo visual do botão.",
    },
    disabled: { control: "boolean", description: "Desabilita o clique." },
    onClick: { action: "clicked", description: "Chamado no clique." },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const LongText: Story = {
  args: { children: "Salvar as alterações do projeto e voltar para a lista" },
};

export const Clicked: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
```

## Imagens (`assets/mocks/`)

- Imagens das histórias em `assets/mocks/` na raiz do repositório, servidas pelo `staticDirs` do `.storybook/main.ts`.
- Poucas e só as necessárias, tiradas do `mocks-warehouse`.
- Um `assets/mocks/README.md` curto cita a origem de cada imagem.
- O `api-email` usa a mesma pasta para as prévias e as imagens dos e-mails.

```ts
const config = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  staticDirs: [{ from: "../assets/mocks", to: "/mocks" }],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest", "@storybook/addon-mcp"],
  framework: "@storybook/react-vite",
} satisfies StorybookConfig;
```

Na história, a imagem é referenciada como `/mocks/<arquivo>`.

## CI e publicação

- O workflow reutilizável `preview-storybook.yml`, do repositório `.github`, instala as dependências, roda o build (e os testes das histórias, quando pedido) e, quando pedido, publica no GitHub Pages. As regras comuns dos ambientes de preview estão em [PREVIEW.md](./PREVIEW.md).
- O caller fica em [`github/workflow/typescript/preview-storybook.yml`](../../github/workflow/typescript/preview-storybook.yml) e substitui o `storybook.yml` próprio de cada repositório:
  - em toda PR: build, sem publicar;
  - em push na `main`: build e publicação no Pages, no ambiente `PREVIEW`.
- O link do Storybook publicado fica no README de cada repositório e neste documento.
