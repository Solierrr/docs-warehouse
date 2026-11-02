<p align="center">
  <img src="../assets/readme/banners/hono.png" alt="Hono" width="100%">
</p>

# Situação

## Funciona

- O webhook do Grafana Cloud abre, comenta e registra o fim dos incidentes no Jira, com o intervalo mínimo e o teto diário de tickets.
- A prévia mostra o ticket que seria criado sem tocar no Jira.
- O heartbeat abre um incidente P1 quando o monitoramento passa mais de 15 minutos sem mandar sinal.
- A sonda abre um incidente P1 depois de três falhas seguidas de um serviço principal e o resolve na primeira resposta boa.
- Os alertas de "serviço sem dados" ficam em silêncio enquanto o cluster está desligado de propósito e por 30 minutos depois que ele volta.
- O e-mail dos incidentes P1 e P2 sai pelo `api-email` quando o canal está configurado.

## Falta

- O aviso por WhatsApp ainda não existe, porque depende da aprovação do modelo de mensagem pela Meta. <!-- PENDENTE: 1 -->
- O e-mail depende do cluster e não sai enquanto ele está fora do ar, o que deixa o Jira como único aviso nesse caso.
