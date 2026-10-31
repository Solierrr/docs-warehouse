<p align="center">
  <img src="../assets/readme/banners/react.png" alt="react" width="100%">
</p>

# Proxy do portal

O backend não exporta um OpenAPI próprio. A interface autenticada fica sob `/api/qa`.

| Caminho | Uso |
|---|---|
| `/services` | Identificadores permitidos |
| `/{id}/spec` | Contrato remoto ajustado para o proxy local |
| `/{id}/proxy/*` | Chamada ao caminho permitido no destino fixo |
| `/health` | Processo local, fora do prefixo e público |

O portal exige Bearer JWT de QA. Alguns destinos recebem credenciais específicas de servidor. As respostas não são armazenadas em cache. O limite de corpo e resposta é dez MiB, e o timeout de destino é noventa segundos.

```http
GET /api/qa/services
Authorization: Bearer <access token de QA>
```

O proxy devolve erros próprios com `message`, não o contrato ProblemDetail completo. Falta de credencial de destino produz 503. Destino desconhecido produz 404. Caminho vedado produz 403. Falhas de upstream e redirecionamentos bloqueados produzem 502. Mutações não são repetidas automaticamente.
