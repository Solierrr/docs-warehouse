# Conversa com o assistente

O `ai-assistant` recebe a mensagem, decide quem responde e grava a conversa no `api-messenger`. Para dados da plataforma ele usa as ferramentas do `mcp-database`. Tarefas operacionais ele delega ao `ai-operational` pelo protocolo A2A.

```mermaid
sequenceDiagram
    participant Cliente as web-sandbox (o web-app ainda usa mock)
    participant Assist as ai-assistant
    participant Oper as ai-operational
    participant MCP as mcp-database
    participant Rec as api-recommendation
    participant Msg as api-messenger
    participant LLM as Provedor de LLM

    Cliente->>Assist: POST /chat (JWT)
    Assist->>Assist: guardrails e roteador
    alt pergunta sobre dados da plataforma
        Assist->>MCP: ferramenta MCP (X-Service-Key)
        MCP->>Rec: feed de recomendações (X-Service-Key)
        Rec-->>MCP: resultados
        MCP-->>Assist: resultados
    else tarefa operacional
        Assist->>Oper: A2A
        Oper->>MCP: ferramenta MCP (X-Service-Key)
        Oper-->>Assist: resultado
    end
    Assist->>LLM: geração da resposta
    LLM-->>Assist: texto
    Assist->>Msg: grava a resposta na conversa (X-Service-Key)
    Assist-->>Cliente: resposta com outcome e reason
```

- O `outcome` diz como o turno terminou (`ANSWERED`, `REFUSED`, `DEGRADED`, `TOOL_FAILED`) e o `reason`, o motivo. Os três agentes de conversa usam os mesmos valores.
- O `ai-geographic` também conversa com o assistente pelo A2A, para perguntas de localização, e usa o `api-google`.
