<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/vite.png" width="100" hspace="8" alt="Vite" title="Vite">
</p>

# Instalação e uso

## Detalhes técnicos

Os tokens Tailwind são distribuídos em `@solaria.network/web-lib/theme.css` (diretiva `@theme`) e como `tailwindTheme` em `@solaria.network/web-lib/tokens`. O layout de e-mail utiliza esse mesmo tema no componente Tailwind do React Email, que converte classes em estilos inline para envio. Templates dentro de EmailLayout podem usar as classes dos tokens sem importar o CSS de browser.

Biblioteca de interfaces React reutilizáveis para as aplicações web da organização.

O pacote é escrito em TypeScript, distribui tipos e mantém React como `peerDependency`, evitando cópias duplicadas do runtime em cada aplicação consumidora.

## Instalação

```bash
npm install @solaria.network/web-lib
```

## Uso

```tsx
import { PrimaryButton } from '@solaria.network/web-lib'
import '@solaria.network/web-lib/style.css'

export function SaveAction() {
  return <PrimaryButton content="Salvar" description="Salvar alterações" />
}
```

O kit contém os controles atuais do web-app e seus presets: Button, ToolbarAction, Input (incluindo CEP/CNPJ/UF), Textarea, Select, Checkbox, Combobox, Hyperlink, Instructions, MessageComposer, Pagination, StatusField e Switcher. Inclui Menu/context menu, Confirmation/ConfirmedAction, Toast, Skeletons, RegistrationStatus, loaders, logo/copyright, Canvas/SideCanvas, OperationalPage/Table e FormSurface/FormSection.

Para a entrada de browser, instale React 19.3, react-dom, lucide-react, react-icons, react-router-dom, react-i18next, i18next e react-speech-recognition. A navegação usa o Router do consumidor. Os componentes traduzidos usam seu I18nextProvider; `uiTranslations` fornece os recursos do kit em pt-BR/en-US/es-ES, sem iniciar tradução globalmente. Importe style.css para aplicar os tokens e estilos do kit.

O web-app continua usando seus arquivos locais nesta etapa. SaaSLayout é um shell genérico configurável da biblioteca; sessão/autorização e páginas de negócio pertencem à aplicação. Os arquivos vazios de Alert/Tooltip não são anunciados como componentes implementados.

Layouts genéricos também exportados: Access, Sidebar e seus itens, EntityCard/EntityCorridor, ChatLayout/ChatMessage, Footer e seções/formulário de edição de perfil. Chat recebe contratos estruturais locais com usuário id/name e mensagem/texto/data/anexos, sem importar modelos de domínio da aplicação.
