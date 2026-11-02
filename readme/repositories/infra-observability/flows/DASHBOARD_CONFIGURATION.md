<p align="center">
  <img src="../assets/readme/banners/grafana.png" alt="Grafana" width="100%">
</p>

# Configuração dos painéis e alertas

Acontece quando a equipe cria ou ajusta um painel ou uma regra de alerta. O resultado é o Grafana mostrando o painel atualizado e avaliando a regra a cada minuto.

```mermaid
flowchart LR
 A[Arquivo em dashboards ou alerting] --> B[Revisão e merge]
 B --> C[Provisionamento na instância]
 C --> D[Grafana consulta Prometheus, Loki e Tempo]
 D --> E{Regra disparou?}
 E -->|sim| F[Webhook ao api-email por prioridade]
 E -->|não| G[Painel atualizado]
```

## Casos de erro

- Uma fonte de dados sem o uid `prometheus` deixa as regras sem avaliação.
- Sem a variável `API_EMAIL_KEY`, os webhooks são recusados pelo destino.
- Um backend de telemetria indisponível dispara o alerta de serviço sem dados.

O contexto da telemetria está no [mapa de integrações](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md).
