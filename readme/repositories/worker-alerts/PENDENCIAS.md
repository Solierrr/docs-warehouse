<p align="center">
  <img src="./assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

# Pendências

## 1. Quais configurações e integrações estão ativas em produção

- Onde aparece: `docs/OVERVIEW.md`, `docs/API.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: há domínio, cron, bindings, snapshot de espaços, alvos e contrato de segredos. O repositório não comprova o deploy efetivo, o contato do Grafana, a entrega de heartbeat, a política de repetição do remetente, as permissões do Jira nem os destinatários de e-mail.
- Hipótese usada no texto: o contrato versionado representa a configuração esperada de produção. A disponibilidade e as ligações externas permanecem sem confirmação operacional.
- Resposta do dono:

## 2. Quem confirma e encerra os tickets de cada espaço

- Onde aparece: `docs/OVERVIEW.md`, `docs/STATUS.md` e `flows/INCIDENT_RECOVERY.md`.
- O que o código mostra: o roteamento escolhe os espaços e prioridades. A recuperação acrescenta rótulo e comentário, mas não muda status, atribui responsável ou implementa prazo de atendimento.
- Hipótese usada no texto: a equipe do espaço de destino acompanha o incidente, confirma a recuperação e encerra o ticket manualmente. O responsável e o procedimento de cada espaço precisam ser confirmados.
- Resposta do dono:
