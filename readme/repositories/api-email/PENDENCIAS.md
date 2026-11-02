<p align="center">
  <img src="./assets/readme/banners/fastify.png" alt="Fastify" width="100%">
</p>

# Pendências da documentação

As dúvidas abaixo dependem de configuração ou decisão do responsável. As hipóteses estão marcadas nos documentos. Este arquivo sai antes da cópia para o repositório de origem.

## 1. Qual configuração está ativa no QA

- Onde aparece: `docs/RUNNING.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: o endereço de QA existe no contrato, e há SMTP e Brevo disponíveis. O checklist registrava variáveis ausentes no Render. O Makefile deixa `VAULT_FOLDERS` vazio, e o entrypoint pode tentar usar um CLI ausente na imagem.
- Hipótese usada no texto: o endereço é um destino declarado. A configuração compatível com a imagem atual recebe as variáveis pela plataforma, sem ativar o caminho do CLI ausente. Disponibilidade, transporte ativo e pastas autorizadas do ambiente precisam de confirmação.
- Resposta do dono:

## 2. Qual é o estado da implantação já declarada em produção

- Onde aparece: `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: há aplicação Argo CD, Service interno e Deployment com imagem `0.3.0` e Brevo, contrariando o levantamento antigo. Readiness usa `/health`, o manifesto não define `DOCS_ENABLED` e o workflow do serviço não tem job de produção.
- Hipótese usada no texto: os manifestos representam a configuração declarada, sem comprovar operação. O serviço permanece destinado à produção conforme a decisão já registrada, e a prontidão e a exposição da documentação ainda precisam ser verificadas no ambiente.
- Resposta do dono:

## 3. Quando os consumidores podem abandonar a chave legada

- Onde aparece: `docs/OVERVIEW.md`, `docs/ARCHITECTURE.md`, `docs/API.md` e `docs/STATUS.md`.
- O que o código mostra: o serviço já aceita chaves por chamador. O cliente do `api-auth` ainda envia `X-API-Key`, enquanto o worker do `api-core` envia a chave nova quando configurada, mas ainda depende de uma configuração legada para iniciar. O fallback legado identifica o chamador como `api-core`.
- Hipótese usada no texto: a compatibilidade permanece necessária até migrar e validar os consumidores. A existência de uma chave por chamador no destino não foi tratada como prova de que todos já usam essa identidade.
- Resposta do dono: Respondido no VersioSpec (2026-10-23): decisão delegada de uma chave por serviço que usa o envio. A chave legada sai quando os consumidores migrarem.

## 4. Qual deve ser a política de novas tentativas neste serviço

- Onde aparece: `docs/OVERVIEW.md`, `docs/ARCHITECTURE.md`, `docs/API.md` e `docs/STATUS.md`.
- O que o código mostra: cada solicitação executa uma chamada ao transporte, sem retry automático, fila ou idempotência. Timeout pode deixar o aceite incerto. O worker de convites do cadastro central possui tentativas próprias. O checklist deixa a decisão sobre novas tentativas com o responsável.
- Hipótese usada no texto: o contrato atual continua síncrono e sem novas tentativas neste serviço. A documentação distingue o aceite do transporte da entrega e não atribui ao serviço as tentativas implementadas no chamador.
- Resposta do dono:
