<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/k6.png" alt="k6" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# Arquitetura do Repositório

O `infra-stress` reúne testes de carga em k6, escritos em TypeScript e empacotados com esbuild antes da execução. Há dois alvos prontos, o `web-worker` e o `web-app`, cada um com um teste rápido de verificação e um teste de estresse. A configuração define as URLs por ambiente e aplica travas de segurança, como a confirmação obrigatória para executar contra produção e limites menores de usuários virtuais em planos gratuitos.

- **Alvos e ambientes (`src/targets.json`):** URL de cada alvo em local, QA e produção.
- **Perfil da execução (`src/config.ts`):** lê as opções do k6, aplica as travas e define os estágios do teste de estresse.
- **Cenários por alvo (`src/web-app.ts` e `src/web-worker.ts`):** o primeiro simula o carregamento completo da página; o segundo confere o comportamento de borda, em que a página de manutenção é um resultado esperado quando a origem está desligada.
- **Testes (`src/smoke/` e `src/stress/`):** o teste rápido e o de estresse de cada alvo, além dos testes genéricos por lista de URLs.
- **Build (`scripts/build.mjs`):** gera os arquivos que o k6 executa.

## Estrutura do repositório

```text
├── .github/
├── docs/
├── scripts/
│   └── build.mjs
├── src/
│   ├── smoke/
│   ├── stress/
│   ├── config.ts
│   ├── https.ts
│   ├── targets.json
│   ├── web-app.ts
│   └── web-worker.ts
├── Makefile
├── package.json
└── README.md
```
