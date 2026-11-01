# Dados do grafo de serviços

`services.json` é um cadastro versionado. As arestas representam vínculos identificados no código ou documentação; `planned` indica uma relação planejada e não confirma integração em execução. A presença de uma aresta não comprova configuração ou disponibilidade em todos os ambientes.

Em 2026-10-28, os 39 repositórios ativos da organização foram comparados com os nós cadastrados. Foram acrescentadas estas relações, verificadas na `main` dos repositórios:

- `ai-assistant` → `api-core`: [cliente de unidades](https://github.com/Solierrr/ai-assistant/blob/main/src/infra/api_core/client.py).
- `ai-geographic` → `api-messenger`: [cliente de mensagens](https://github.com/Solierrr/ai-geographic/blob/main/src/infra/api_messenger/client.py).
- `infra-stress` → `web-app`: [requisições do teste de carga](https://github.com/Solierrr/infra-stress/blob/main/src/web-app.ts).
- `worker-failover` → `web-app`: [sincronização do roteamento](https://github.com/Solierrr/worker-failover/blob/main/scripts/sync-language-routing.mjs).
- `infra-gitops` → serviços com [manifestos versionados](https://github.com/Solierrr/infra-gitops/tree/main/services). A existência dos arquivos não comprova deploy ativo.

O inventário de repositórios e a revisão dessas relações não constituem validação exaustiva de todas as conexões nem teste de integração.
