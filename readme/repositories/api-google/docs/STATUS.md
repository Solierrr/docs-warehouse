<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/google.png" alt="Google" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/fastapi.png" width="100" hspace="8" alt="FastAPI" title="FastAPI">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gcp.png" width="100" hspace="8" alt="Google Cloud" title="Google Cloud">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/google-maps.png" width="100" hspace="8" alt="Google Maps" title="Google Maps">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/google-translate.png" width="100" hspace="8" alt="Google Translate" title="Google Translate">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Status

- **FastAPI**, arquitetura em camadas (`domain`/`application`/`infrastructure`/`api`), um módulo por capability.
- **Sem estado**, o serviço só chama o Google (ou lê chaves do ambiente) conforme os parâmetros e devolve o resultado; quem chamou grava onde precisar.
- **Capability `address`**, sugestão de endereço, detalhes por `place_id`, geocodificação (direta e reversa), validação e `resolve` (Places New, Geocoding e Address Validation).
- **Capability `solar`**, viabilidade solar de um telhado via Solar API, incluindo os dados do painel de referência.
- **Capability `i18n`**, detecção de idioma + tradução (Cloud Translation API) de campos de texto para os outros dois entre `en`/`es`/`pt`.
- **Capability `geo`**, fuso horário por coordenada, calculado localmente.
- **Autenticação**, JWT RS256 de usuário validado via JWKS do `api-auth` (`app/infrastructure/auth`); ainda não aplicado nos endpoints.
- **Observabilidade**, logging/tracing/metrics via OpenTelemetry.
- **Licença Apache 2.0**.
