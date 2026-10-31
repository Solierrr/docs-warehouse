<p align="center">
  <img src="../assets/readme/banners/kong.png" alt="kong" width="100%">
</p>

# Encaminhamento de chamada

Uma chamada de QA usa o prefixo do serviço para selecionar a origem.

```mermaid
sequenceDiagram
 participant C as Cliente
 participant K as Kong
 participant S as Serviço
 C->>K: HTTP com prefixo e credenciais da operação
 K->>K: Seleciona rota e remove prefixo
 K->>S: HTTPS com caminho restante
 S-->>K: Resposta ou erro do contrato
 K-->>C: Resposta e correlação
```

Rota inexistente, origem indisponível e timeout podem impedir a chamada. Erros de autorização continuam sendo produzidos pelo serviço.
