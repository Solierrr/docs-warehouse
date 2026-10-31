# Fluxos entre repositórios

Fluxos que atravessam mais de um repositório. Cada repositório descreve em `flows/` só a parte dele e aponta para cá quando o fluxo continua em outro lugar.

| Fluxo | Repositórios |
|---|---|
| [Visão geral das integrações](./INTEGRATIONS.md) | todos |
| [Login e validação do token](./LOGIN_AND_TOKEN.md) | `web-app`, `mobile-app`, `web-sandbox`, `api-auth` e todo serviço que valida JWT |
| [Criação do usuário no cadastro central](./USER_PROVISIONING.md) | `api-auth`, `api-core` |
| [Chamada entre serviços](./SERVICE_TO_SERVICE_AUTH.md) | todo serviço que chama outro |
| [Comunidade de projeto](./PROJECT_COMMUNITY.md) | `api-messenger`, `api-core` |
| [Conversa com o assistente](./ASSISTANT_CHAT.md) | `ai-assistant`, `ai-operational`, `ai-geographic`, `mcp-database`, `api-recommendation`, `api-messenger`, `api-core` |
| [Convite de projeto por e-mail](./PROJECT_INVITE_EMAIL.md) | `api-core`, `api-email` |
| [Feed de recomendações](./RECOMMENDATION_FEED.md) | `database-bootstrap`, `api-recommendation`, `mcp-database` |
| [Cópia dos dados para análise](./ANALYTICS_SYNC.md) | `databricks-sync`, `databricks-stocker`, `database-console` |
| [Release e deploy](./RELEASE_AND_DEPLOY.md) | todo repositório publicado, `.github`, `infra-gitops`, `infra-platform` |

Os diagramas seguem o [padrão de diagramas](../standards/DIAGRAMS.md). Este levantamento é de 2026-10-29. Integrações ainda não ligadas aparecem tracejadas.
