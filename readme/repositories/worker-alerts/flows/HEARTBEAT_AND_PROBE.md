<p align="center">
  <img src="../assets/readme/banners/hono.png" alt="Hono" width="100%">
</p>

# Heartbeat e sonda

Acontece a cada cinco minutos, pela tarefa agendada, ou na hora, por `POST /monitor/run`. Os dois verificadores cobrem o caso em que ninguém avisa que o aviso parou, e os incidentes que eles abrem seguem o mesmo caminho dos alertas comuns, com ticket no Jira e etiqueta de fim quando o problema passa.

```mermaid
flowchart TD
    Inicio[Tarefa agendada ou POST /monitor/run] --> Batida{Última batida do Grafana há mais de 15 minutos?}
    Batida -->|sim| H01[Abre o incidente H01, P1, no quadro de infraestrutura]
    Batida -->|não| ResolveH[Resolve o H01 se estiver aberto]
    H01 --> Cluster
    ResolveH --> Cluster{Cluster desligado de propósito?}
    Cluster -->|sim| Pausa[Não roda a sonda e resolve o que estava aberto]
    Cluster -->|não| Sonda[Consulta a saúde dos serviços principais]
    Sonda --> Falhas{Três falhas seguidas no mesmo serviço?}
    Falhas -->|sim| S01[Abre o incidente S01, P1, no quadro do serviço]
    Falhas -->|não| ResolveS[Uma resposta boa resolve o S01 do serviço]
```

Antes da primeira batida depois de um deploy novo, o Worker conta a partir da primeira verificação, para não abrir o H01 sem motivo. Quando o arquivo que informa se o cluster está desligado não pode ser lido, a sonda assume que o cluster está ativo.
