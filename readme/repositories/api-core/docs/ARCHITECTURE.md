<p align="center">
  <img src="../assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

# Arquitetura

O serviço usa Java 21, Spring Boot 4.1.2, JPA e PostgreSQL. Os pacotes são organizados por domínio dentro das camadas de controller, service, repository, DTO e entidade. O código da main inclui o DDL do banco em migrations Flyway e tarefas duráveis para tradução, validação profissional e envio de convites.

```mermaid
flowchart LR
    Apps[Aplicativos e agentes] -->|HTTP + JWT| API[Controllers e serviços]
    Internos[api-auth, api-messenger e mcp-database] -->|HTTP + X-Service-Key| API
    API -->|HTTP público, JWKS| Auth[api-auth]
    API -->|JPA e Flyway| PG[(PostgreSQL)]
    API -->|cache Redis| Redis[(Redis)]
    API -->|HTTPS + credencial do provedor| Cloud[Cloudinary]
    API -->|HTTP + credenciais em transição| Google[api-google]
    API -->|HTTP + credenciais em transição| Email[api-email]
    API -->|HTTP opcional + credenciais em transição| Valid[ai-validation]
    API -->|HTTP + X-Recommendation-Key| Rec[api-recommendation]
    API -->|OTLP| Otel[Coletor de observabilidade]
```

## Organização

As camadas e os domínios ficam em um único artefato Maven.

| Caminho a partir do pacote Java principal | Papel |
|---|---|
| `controller/`, `openapi/` | entradas HTTP e documentação das operações |
| `service/` | regras, transações, autorização de recursos e tarefas |
| `repository/` | consultas, locks e acesso JPA |
| `domain/entity/`, `domain/enums/` | modelo persistido e estados |
| `dto/` | contratos de entrada, saída e atualizações parciais |
| `security/`, `security/rbac/`, `security/mobile/` | identidade, chaves, permissões e acesso mobile |
| `integration/`, `config/` | clientes HTTP e configuração dos provedores |
| `exception/handler/` | ProblemDetail e tratamento de erros |
| `observability/` | Actuator, traces, logs e correlação |

Os grupos de domínio incluem identidade, empresa, catálogo, unidade, proposta, execução, profissional, pedido e recomendação. `src/main/resources/db/migration/` contém o schema e os dados de referência. Os testes e a coleção Bruno acompanham os grupos de recursos.

## Segurança

Há três cadeias stateless. A chain de ordem zero libera health e info do Actuator. A de ordem um cobre `/internal/**` com `ServiceKeyAuthFilter`. A chain de usuário valida JWT por JWKS e emissor, recusa tipo de token incompatível e libera os catálogos públicos e o atalho provisório de login.

| Consumidor interno | Escopo autorizado |
|---|---|
| `api-auth` | `/internal/users` e seus recursos |
| `api-messenger` | `/internal/projects/**` e `/internal/technical-projects/**` |
| `mcp-database` | leitura de `/internal/catalog/**` |

As chaves vêm de `SERVICE_KEY_API_AUTH`, `SERVICE_KEY_API_MESSENGER` e `SERVICE_KEY_MCP_DATABASE`. Uma chave curta impede a partida, e chave ausente não autentica. A guarda compara as chaves em tempo constante. A exceção de acesso da chain interna ainda usa o entrypoint de autenticação, portanto uma chave válida fora de seu escopo pode ser apresentada como 401 em vez do 403 normativo.

Nas rotas de usuário, o interceptor RBAC combina o identificador da operação com o cargo e suas permissões. Os serviços também conferem empresa, propriedade ou participação. O contexto da requisição reaproveita consultas de identidade e autorização. A resolução atual usa um vínculo empresarial, coerente com a restrição única do banco e diferente da decisão de produto de vários vínculos. <!-- PENDENTE: 1 -->

## Integrações

Os aplicativos e agentes usam o JWT da pessoa nas rotas de negócio. Os consumidores internos usam a chave de seu serviço. O catálogo de integrações está em [INTEGRATIONS.md](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md), com diferenças atuais registradas em [STATUS.md](./STATUS.md).

| Destino | Protocolo e identidade | Uso |
|---|---|---|
| `api-auth` | HTTP, JWKS público e proxy de login | validação de token e atalho `/dev/login` |
| `api-email` | HTTP, `X-API-Key` e `X-Service-Key` quando configurado | envio assíncrono de convites persistidos |
| `api-google` | HTTP, Bearer legado e `X-Service-Key` | tradução de ofertas |
| `ai-validation` | HTTP, Bearer legado e `X-Service-Key` | processamento opcional de documentos |
| `api-recommendation` | HTTP, `X-Recommendation-Key` | feeds com cache em memória e fallback SQL |
| Cloudinary | HTTPS com conta do provedor | imagens públicas e documentos autenticados |

`SERVICE_KEY` é a chave própria enviada a e-mail, tradução e validação. Os clientes ainda têm condições que dependem das credenciais legadas antes de executar. A presença da chave nova não conclui a migração. `/dev/login` também permanece público, sem perfil que o restrinja a desenvolvimento. <!-- PENDENTE: 6 -->

## Dados e transações

O [PostgreSQL](../database/POSTGRES.md) é a fonte de negócio. Flyway aplica V1 a V3 na partida e Hibernate valida as entidades. V1 inclui 68 tabelas, constraints, índices, triggers e a procedure de cobrança. V2 cria views de exportação com seleção de campos. V3 inclui permissões, cargo administrativo e plano de referência. A migração de bancos já existentes e de consumidores do schema anterior precisa ser coordenada. <!-- PENDENTE: 3 -->

O aceite de proposta bloqueia a proposta e o estoque, reserva quantidades e grava `ACCEPTED` na mesma transação. O projeto e o serviço são criados por outras operações. Não há vínculo de proposta no schema do projeto que represente conversão automática. <!-- PENDENTE: 2 -->

O checkout bloqueia ofertas em ordem estável, grava snapshots de itens e pagamento e limpa o carrinho na transação. Cancelar pedido pago devolve disponibilidade e marca o pagamento como reembolsado. As regras de compra também têm proteção por triggers no banco.

O [Redis](../database/REDIS.md) guarda somente buscas elegíveis de fornecedores e contadores de popularidade. A indisponibilidade é tratada com retorno ao acesso relacional. O cache do feed de recomendações é separado, em memória do processo, limitado a 256 entradas e com TTL configurável.

## Tarefas duráveis e arquivos

Traduções usam `offer_translation_job`, com versão da origem, lease e token de posse. O worker chama o tradutor fora da transação de claim e confere a versão antes de concluir. Falhas recebem backoff e limite de tentativas.

O onboarding profissional guarda rascunho, snapshot, política e evidências. A aprovação promove a versão e atualiza o técnico. A validação automática vem desativada por padrão, e sua compatibilidade com o serviço externo precisa ser verificada. <!-- PENDENTE: 4 -->

Arquivos não usam um único armazenamento. Fotos públicas de cadastros e faturas usam Cloudinary. Fotos de projeto ficam em `project_photo.content`. Documentos profissionais começam no PostgreSQL, e imagens validadas podem ser arquivadas no Cloudinary autenticado, com conferência de SHA-256 na leitura. Os detalhes estão no [fluxo de arquivos](../flows/MEDIA_UPLOAD.md).

## Health, versão e observabilidade

Liveness verifica o processo, readiness verifica PostgreSQL e Redis fica fora do health. A chain específica do Actuator libera as sondas. `pom.xml` fornece a versão do OpenAPI e de `/actuator/info`. A versão dos recursos de telemetria também pode vir de configuração de ambiente.

Micrometer e OpenTelemetry exportam métricas, traces e logs por OTLP. `TraceIdResponseFilter` expõe `X-Trace-Id`, e `ProblemDetailFactory` acrescenta o trace válido ao erro. Operações Cloudinary têm observações próprias.

A análise usa a main em [`8469e06c`](https://github.com/Solierrr/api-core/commit/8469e06cddef66b77a00f922863b84c40dd53405), conferida em 2026-10-30.
