<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

# Atendimento de incidentes

O serviço atende quem acompanha a disponibilidade e as falhas da plataforma. Ele transforma os avisos do monitoramento em tickets que podem ser investigados e acompanhados pela equipe. Os tickets apresentam o impacto informado, a prioridade, o horário do problema, os primeiros passos e links para investigar registros e rastros de execução.

## Capacidades

O atendimento aparece no Jira e, quando o canal está configurado, também por e-mail.

- Receber alertas de falha e de recuperação do Grafana Cloud.
- Mostrar uma prévia do conteúdo do ticket antes de enviar ao Jira.
- Direcionar cada serviço ao espaço de atendimento correspondente.
- Relacionar ocorrências e níveis de alerta do mesmo problema.
- Detectar a ausência do sinal periódico do Grafana Cloud.
- Verificar aplicações por fora do cluster para perceber indisponibilidade do caminho público.

## Regras de atendimento

As prioridades vão de P1 a P5. A prioridade do alerta determina a prioridade do ticket, da mais alta à mais baixa. Alertas de ambiente diferente do configurado são ignorados.

O intervalo mínimo entre tickets é contado desde a criação do último ticket daquele alerta, serviço e ambiente. O limite diário considera uma janela móvel de 24 horas. Antes do intervalo mínimo, o aviso é ignorado. Depois dele, se o teto diário foi atingido, o serviço comenta no último ticket em vez de criar outro. Os padrões do código são 30 minutos e oito tickets, ambos configuráveis.

O sinal de recuperação acrescenta uma marca de resolução e um comentário aos tickets encontrados. Ele não encerra o atendimento nem muda o status no Jira. A hipótese de operação é que a equipe do espaço de destino confirma o atendimento e encerra o ticket. A distribuição dessa responsabilidade ainda precisa ser confirmada. <!-- PENDENTE: 2 -->

Avisos por e-mail acompanham a criação do ticket e o registro de recuperação de alertas P1 ou P2 recebidos do Grafana. Repetições sem ticket novo, alertas das outras prioridades e alertas identificados como teste não geram esse e-mail. A indisponibilidade do e-mail não impede o registro no Jira.

## Pausa e disponibilidade

Durante uma pausa planejada do cluster, o serviço suspende as sondas das aplicações e registra a recuperação dos incidentes de sonda que estavam abertos. A verificação do sinal do Grafana Cloud continua ativa porque esse provedor funciona fora do cluster.

Alertas do Grafana explicitamente marcados para silenciamento durante pausa não abrem ticket enquanto a pausa está ativa ou durante a carência posterior observada. Os sinais de recuperação continuam sendo processados. Os demais alertas continuam valendo.

O código descreve a operação esperada. A configuração efetivamente publicada dos contatos, regras, destinatários e verificações ainda precisa ser confirmada. <!-- PENDENTE: 1 -->
