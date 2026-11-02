<p align="center">
  <img src="../assets/readme/banners/hono.png" alt="Hono" width="100%">
</p>

# Alerta que vira incidente

Acontece quando uma regra do Grafana Cloud dispara ou volta ao normal. O resultado é um ticket novo, um comentário no ticket existente ou o registro do fim do incidente no Jira, e um e-mail quando o incidente é P1 ou P2. Os avisos do mesmo incidente passam um de cada vez pelo Durable Object da chave, para que dois envios quase simultâneos não abram dois tickets.

```mermaid
sequenceDiagram
    participant Grafana as Grafana Cloud
    participant Worker as worker-alerts
    participant DO as Durable Object do incidente
    participant Jira
    participant Email as api-email

    Grafana->>Worker: POST /grafana (Bearer)
    Worker->>Worker: confere token, tamanho e contrato do alerta
    alt token inválido ou alerta fora do contrato
        Worker-->>Grafana: 401, 413, 415 ou 422
    end
    Worker->>DO: entrega o alerta pela chave do incidente
    alt alerta de outro ambiente
        DO-->>Worker: ignorado
    else alerta disparou
        DO->>Jira: busca os tickets da chave nos últimos dias
        alt último ticket com menos de 30 minutos
            DO-->>Worker: ignorado pelo intervalo
        else 8 tickets em 24 horas
            DO->>Jira: comenta no último ticket
        else
            DO->>Jira: cria o ticket no quadro do serviço
            opt prioridade P1 ou P2 e não é teste
                DO->>Email: POST /emails (X-Service-Key)
            end
        end
    else alerta resolvido
        DO->>Jira: adiciona inc-resolvido e comenta a duração
        opt prioridade P1 ou P2 e não é teste
            DO->>Email: POST /emails (X-Service-Key)
        end
    end
    alt falha ao consultar ou criar no Jira
        Worker-->>Grafana: 503, e o Grafana tenta de novo
    else
        Worker-->>Grafana: 200 com a ação de cada alerta
    end
```
