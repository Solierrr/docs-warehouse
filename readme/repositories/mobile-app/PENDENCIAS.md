<p align="center">
  <img src="./assets/readme/banners/jetpack-compose.png" alt="Jetpack Compose" width="100%">
</p>

# Pendências

## 1. Banco local, atualização e retenção

- Onde aparece em `docs/ARCHITECTURE.md, docs/DEPLOY.md, docs/STATUS.md e database/SQLITE.md`.
- O que o código mostra é que há cinco tabelas Room, versão 3, sem migração no módulo e com fallback destrutivo. A fila contém mensagens não enviadas e não há TTL de histórico nesse caminho.
- Hipótese usada no texto é documentar o banco próprio, contrariando a hipótese inicial. Confirmar preservação da fila, retenção e limite de armazenamento.
- Resposta do dono: Respondido em 2026-11-01: "Sim", a fila precisa sobreviver às atualizações do app.


## 2. Destinos por variante

- Onde aparece em `docs/RUNNING.md, docs/DEPLOY.md e docs/STATUS.md`.
- O que o código mostra é que hosts são compilados no Gradle. Endereços usa destino antigo no QA e fica vazio no PROD.
- Hipótese usada no texto é apresentar destinos como declarados. Confirmar hosts, geocodificação e redirect antes de distribuir.
- Resposta do dono:


## 3. Assinatura e versão distribuída

- Onde aparece em `docs/ARCHITECTURE.md, docs/DEPLOY.md e docs/STATUS.md`.
- O que o código mostra é que gradle declara versão 1.0 e código 1. O checklist cita tag anterior e o workflow não produz pacote.
- Hipótese usada no texto é descrever builds debug e ausência de automação. Confirmar canal, assinatura e fonte da versão.
- Resposta do dono:


## 4. Escopo das áreas locais

- Onde aparece em `docs/OVERVIEW.md e docs/STATUS.md`.
- O que o código mostra é que agenda, locais salvos, chamados e notificações usam exemplos. Firebase Installations não acrescenta push e há atalhos com ids fixos.
- Hipótese usada no texto é limitar capacidades conectadas às comprovadas. Confirmar escopo dessas telas para distribuição.
- Resposta do dono: Respondido em 2026-11-01: "Acho que sim", as áreas de exemplo saem da versão distribuída. O dono valida de novo depois de subir todo o mobile.


## 5. Garantia de reenvio

- Onde aparece em `docs/API.md, docs/STATUS.md e flows/CHAT_OUTBOX.md`.
- O que o código mostra é que o cliente guarda clientMessageId e confere só as últimas 100 mensagens antes de repetir. Seu comentário assume ausência de deduplicação no destino.
- Hipótese usada no texto é descrever redução de duplicação sem envio único garantido. Confirmar contrato do servidor quando a confirmação sai da janela de histórico.
- Resposta do dono:
