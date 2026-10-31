<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="fastapi" width="100%">
</p>

# Consulta solar

A consulta usa coordenadas para buscar o telhado mais próximo e resumir a estimativa de imagem.

```mermaid
sequenceDiagram
 participant G as Especialista
 participant T as Ferramenta solar
 participant A as api-google
 G->>T: Latitude e longitude
 T->>A: HTTP GET com X-Service-Key
 alt Dados disponíveis
 A-->>T: Dados do telhado
 T-->>G: Área, painéis, insolação e três maiores planos
 else Sem cobertura ou falha
 A-->>T: Erro
 T-->>G: Indisponibilidade informada
 end
```

O timeout é de vinte segundos. A falta de cobertura retorna uma informação ao especialista. Outras falhas de HTTP registram `SOLAR_DATA_UNAVAILABLE`.
