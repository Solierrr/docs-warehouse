<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/react.png" alt="React" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/vite.png" width="100" hspace="8" alt="Vite" title="Vite">
</p>

# Desenvolvimento

## Detalhes técnicos

Interface de testes manuais do ambiente de QA. Login pela API-auth, seguido de layout e componentes consumidos diretamente de `@solaria.network/web-lib`. O web-app mantém seus componentes locais.

## Executar localmente

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:5174. Use uma conta do QA. As variáveis de `.env.example` podem ser copiadas para `.env.local`; são URLs públicas, sem credenciais de serviço. Alterações de variáveis exigem reiniciar o Vite. Os destinos padrão são os serviços de QA no Render. Serviços locais podem substituir essas URLs durante o desenvolvimento.

O catálogo usa os hosts de QA documentados (Render) e, para PROD, o padrão `https://<servico>.solarianetwork.site`. Qualquer URL pode ser sobrescrita com `VITE_QA_<SERVICO>` ou `VITE_PROD_<SERVICO>` (nome do serviço em maiúsculas e com `_`, por exemplo `VITE_PROD_API_CORE`). A disponibilidade depende do ambiente: o cluster de PROD pode estar desligado e o Swagger pode estar desativado pelo próprio serviço.

## Modo mock (local, sem dependência externa)

Com `VITE_MOCKS=ALWAYS` (padrão do `.env.example`) e só no `npm run dev`, o login aceita qualquer e-mail e senha, cria uma sessão local e não chama a API-auth: renovação e logout também ficam locais. Nada é simulado além da autenticação, então as telas que consultam as APIs de QA continuam chamando os serviços reais e, sem um JWT válido, tendem a retornar 401. Para usar a autenticação real, defina `VITE_MOCKS=DEACTIVATED`. Builds de produção ignoram essa variável.

## Biblioteca local

O tarball em `vendor` permite consumir as alterações locais da lib sem publicar nem depender de uma pasta irmã em `npm ci`. Para atualizar:

```sh
cd ../web-lib
npm run build
npm pack --pack-destination ../web-sandbox/vendor
cd ../web-sandbox
npm install ./vendor/solaria.network-web-lib-0.5.0.tgz
```

## Validação

```sh
npm test
npm run lint
npm run build
```

Os testes usam respostas controladas e não alteram QA. Nenhum BFF é utilizado, e nenhuma chave interna deve ser adicionada a variáveis `VITE_*`.
