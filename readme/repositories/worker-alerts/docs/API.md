<p align="center">
  <img src="../assets/readme/banners/hono.png" alt="Hono" width="100%">
</p>

# API

O serviço tem poucas rotas e um único chamador de fato, o Grafana Cloud, que envia os alertas e a batida do heartbeat. A única rota pública é a de saúde, e todas as outras exigem o token bearer que o Grafana conhece.

## Autenticação

O Grafana envia o cabeçalho `Authorization: Bearer <token>`, e o Worker compara o token em tempo constante com o segredo `WEBHOOK_TOKEN`. A mesma regra vale para o heartbeat e para a execução da sonda sob demanda, porque as três rotas são chamadas pelo mesmo lado.

## Rotas

| Rota | Para quê |
|---|---|
| `POST /grafana` | recebe o webhook e cria, comenta ou registra o fim do incidente no Jira |
| `POST /grafana/preview` | mostra o ticket que seria criado, sem nenhum contato com o Jira |
| `POST /heartbeat` | recebe a batida do Grafana Cloud, enviada a cada cinco minutos |
| `POST /monitor/run` | roda a conferência do heartbeat e a sonda na hora e devolve o resultado |
| `GET /health` | responde se o Worker está no ar, sem autenticação |

## Contrato do alerta

Cada envio traz de 1 a 50 alertas, e cada alerta precisa dos rótulos `alert_id`, `priority` (de P1 a P5), `service_name` e `deployment_environment`. Os rótulos `test` e `silence_on_pause` são opcionais, assim como `category` e `escalation_group`, este último usado para ligar tickets relacionados do mesmo grupo.

## Limites

O corpo do envio tem no máximo 256 KiB, e as anotações de cada alerta têm no máximo 4.000 caracteres. A cadência dos avisos é definida pela política de notificação do Grafana, e o Worker aplica por cima o intervalo mínimo de 30 minutos e o teto de 8 tickets em 24 horas.

## Erros

Os erros seguem o formato `application/problem+json`. O Jira sem configuração responde 503 com `CHANNEL_NOT_CONFIGURED`, e uma falha na consulta ou na criação também responde 503, para que o Grafana repita o envio.
