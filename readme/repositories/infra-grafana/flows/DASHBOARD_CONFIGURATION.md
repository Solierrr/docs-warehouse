<p align="center">
  <img src="../assets/readme/banners/grafana.png" alt="Grafana" width="100%">
</p>

# Configuração dos painéis existentes

A configuração operacional existente usa arquivos de outros repositórios. O fluxo abaixo localiza seus responsáveis e não pressupõe uma implementação neste molde.

```mermaid
flowchart LR
 A[Painéis no coletor] --> C[ConfigMaps de painéis]
 B[Recursos no GitOps] --> D[Application com duas fontes]
 C --> D
 D --> G[Grafana consulta fontes configuradas]
```

ConfigMap ausente, credencial inválida e backend indisponível impedem visualizar dados. O contexto da telemetria está no [mapa de integrações](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md).
