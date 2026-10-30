<p align="center">
  <img src="../assets/readme/banners/google.png" alt="Google" width="100%">
</p>

# Consulta solar

O serviço geográfico envia coordenadas. A API consulta o telhado mais próximo coberto pelo provedor e devolve os dados solares. O [mapa de integrações](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md) situa essa chamada entre os serviços.

```mermaid
sequenceDiagram
  participant Geo as ai-geographic
  participant API as Serviço de localização
  participant Solar as Google Solar API
  Geo->>API: GET /internal/solar/roof-viability (HTTP + X-Service-Key)
  API->>Solar: HTTPS + chave do provedor
  alt Cobertura disponível
    Solar-->>API: Dados solares do telhado
    API-->>Geo: Viabilidade solar
  else Sem cobertura
    Solar-->>API: 404
    API-->>Geo: 404
  end
```

## Casos de erro

Chave ausente ou inválida retorna 401. Chamador sem permissão retorna 403. Coordenada inválida retorna 422. Sem cobertura solar, a chamada retorna 404. Falha do provedor retorna erro de dependência.
