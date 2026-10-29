<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/react.png" alt="React" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/vite.png" width="100" hspace="8" alt="Vite" title="Vite">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/tailwind.png" width="100" hspace="8" alt="Tailwind CSS" title="Tailwind CSS">
</p>

# Telas

- Catálogo: página inicial com todos os repositórios da plataforma (exceto Elos) e filtros em pílulas de ícones, como as do login: framework (Spring, LangChain, FastAPI, React), linguagem (Python, Kotlin, Java, TypeScript, Terraform) e tipo (serviços, bibliotecas, infraestrutura, dados, documentação, mobile). Clicar em um ícone liga o filtro e clicar de novo desliga; os filtros se combinam e ficam na URL. Cada repositório mostra o GitHub e, quando tem Swagger, as opções PROD e QA com abrir em nova aba e copiar o link. Serviços sem Swagger mostram os links da aplicação em QA e PROD. A linha `storybook` aponta para o GitHub Pages (`VITE_STORYBOOK_WEB_APP` e `VITE_STORYBOOK_LIB_WEB` sobrescrevem as URLs).
- Keepalive: acorda os serviços de QA no Render com uma requisição simples (`no-cors`, sem integrar o serviço de keepalive). Há um botão por serviço, conjuntos predefinidos (Essenciais, IA e Todos) e seleção múltipla. A resposta indica só que o serviço respondeu; o plano free pode levar cerca de um minuto para acordar. Aplicações estáticas (web-app e web-sandbox) não dormem e ficam de fora.
- Fluxo de IA: reservado e comentado em `src/App.tsx` (rota, item de menu e import). Será implementado por outra pessoa.

As telas de teste manual por serviço (API-core, API-messenger, serviços de IA e demais) foram removidas; o catálogo concentra os links de cada serviço. A sessão fica só em memória, com logout local imediato.
