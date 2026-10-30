<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Arquitetura

Serviço FastAPI com schemas Pydantic e um grafo LangGraph para certificados. O fluxo de empresas consulta BrasilAPI e um agente de texto. O código lê configurações de ambiente e reutiliza a biblioteca de modelos, sem banco de negócio próprio.

```mermaid
flowchart LR
  C[Cliente] -->|HTTP e JWT| A[FastAPI]
  A -->|HTTP público JWKS| J[Serviço de acesso]
  A --> G[Grafo de certificados]
  G -->|HTTPS público| I[Imagens dos documentos]
  G --> L[Adaptadores de modelos]
  A --> E[Validação de empresa]
  E -->|HTTPS público| B[BrasilAPI]
  E --> L
  L -->|HTTPS e chave do provedor| P[Provedores de modelos]
  A --> D[Debug administrativo em memória]
```

## Organização

| Caminho | Responsabilidade |
|---|---|
| `main.py` | Bootstrap, CORS, limites, erros, rotas e geração do OpenAPI |
| `src/api/` | Schemas, autenticação, rotas e respostas de erro |
| `src/workflow/` | Grafo, estado, extração, consolidação e depuração |
| `src/agents/specialist/` | Prompts e agente de empresa |
| `src/core/llm/` | Clientes e fallback de modelos |
| `src/core/config/` | Settings cacheadas |
| `src/services/` | Consulta BrasilAPI |
| `tests/` | Testes de rotas, nós, segurança e integrações isoladas |

## Integrações e autenticação

| Relação | Protocolo | Autenticação |
|---|---|---|
| Clientes chamam validação | HTTP JSON | JWT de usuário por padrão |
| Verificação de assinatura | HTTP JWKS | Chave pública, assinatura RS256 |
| Download de certificados | HTTP ou HTTPS | URL acessível, sem envio do JWT ao armazenamento |
| Consulta de CNPJ | HTTPS BrasilAPI | Sem credencial no cliente implementado |
| Modelos | HTTPS pelos adaptadores | Chaves de provedor do ambiente |
| Cadastro central pretende validar profissional | HTTP | Contrato ausente nesta main, sem integração ativa comprovada |

`require_access_token` é dependência dos dois routers de negócio. `AUTH_REQUIRED` vem ativo por padrão. Sem JWKS configurado, retorna 503. A validação exige `exp` e `sub`, aceita apenas RS256 e rejeita `token_type` diferente de `access`, assumindo access quando o campo não existe. O issuer é conferido quando configurado.

A função `require_caller` e a variável `SERVICE_KEY_API_CORE` existem. Nenhuma rota de validação desta main usa essa dependência. Definir uma chave não cria a rota profissional nem substitui a autenticação JWT. <!-- PENDENTE: 1 -->

## Execução e dados

O grafo público é compilado sem checkpointer. Ele baixa as duas imagens, aplica segurança, executa os especialistas e consolida. Base64 e MIME são reutilizados no estado durante a solicitação. Falhas capturadas na leitura ou nos nós podem gerar reprovação de documento, enquanto exceções não tratadas viram erro HTTP.

O download segue redirecionamentos e usa timeout de 30 segundos. O código não declara limite de bytes ou restrição de origem. A política de imagens precisa ser definida antes de descrever essa entrada como restrita a um armazenamento aprovado. <!-- PENDENTE: 4 -->

O fallback externo só avança por erro reconhecido como rate limit. Chamadas de imagem excluem o provedor marcado como apenas texto. A biblioteca compartilhada também administra rodízio de chaves. Dependências instaladas não comprovam uso de PostgreSQL, MongoDB ou índice vetorial.

## Observabilidade, health e versão

Logs usam JSON. Debug administrativo fornece etapas e reexecução controlada, descritos no [fluxo de depuração](../flows/DEBUG_REPLAY.md). Não há persistência de negócio. Os limites e o debug são locais à instância.

`/health` retorna estado e versão, e `/ready` retorna estado. Nenhum deles consulta BrasilAPI, JWKS ou modelos. Isso não comprova que uma validação real será atendida.

A versão é lida de `version.txt`, atualmente `3.1.0`. A revisão analisada é `7855fc9f`, em 2026-10-30. Fontes em [bootstrap](https://github.com/Solierrr/ai-validation/blob/main/main.py), [JWT](https://github.com/Solierrr/ai-validation/blob/main/src/core/security/jwt.py), [grafo](https://github.com/Solierrr/ai-validation/blob/main/src/workflow/graph/graph.py), [settings](https://github.com/Solierrr/ai-validation/blob/main/src/core/config/settings.py) e [download](https://github.com/Solierrr/ai-validation/blob/main/src/workflow/nodes/security_guardrail_node.py).
