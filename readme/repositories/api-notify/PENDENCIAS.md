# Pendências do `api-notify`

Dúvidas que o código não responde. Cada uma tem a hipótese usada no texto. O dono responde e depois este arquivo sai.

## 1. Quem dispara cada tipo de notificação

- Onde aparece: `docs/OVERVIEW.md`, tipos de notificação.
- O que o código mostra: os tipos são mensagem nova, serviço agendado e mudança no serviço, e são aceitas as chaves do `api-messenger` e do `api-core`.
- Hipótese usada no texto: o `api-messenger` dispara a mensagem nova e o `api-core` dispara os dois tipos de serviço.
- Resposta do dono: Respondido em 2026-11-01: confirmado, o `api-messenger` dispara a mensagem nova e o `api-core` os dois tipos de serviço.

## 2. Navegador como plataforma

- Onde aparece: `docs/OVERVIEW.md`, primeiro parágrafo.
- O que o código mostra: a plataforma aceita `ANDROID` e `WEB`, mas nenhum cliente cadastra aparelho ainda.
- Hipótese usada no texto: o `web-app` também vai receber notificações pelo navegador.
- Resposta do dono: Respondido em 2026-11-01: "web app nao recebe no navegador".
