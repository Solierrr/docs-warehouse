<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/bruno.png" alt="Bruno" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/api.png" width="100" hspace="8" alt="API" title="API">
</p>

# Coleção Bruno

Todo repositório `api-` tem uma pasta `http/` com uma coleção do [Bruno](https://www.usebruno.com), um cliente HTTP que guarda as chamadas como arquivos de texto no próprio repositório. Ela serve para executar à mão as chamadas da API local, revisá-las em Pull Request e mantê-las junto do código. Não substitui testes automatizados nem a especificação OpenAPI (o Swagger).

## Como usar

1. Instale o Bruno e abra a pasta `http/` do repositório (`Open Collection`).
2. Selecione o ambiente `local`.
3. Ajuste `baseUrl` em `environments/local.bru` para a porta do serviço.
4. Rode o login em `authentication/`, copie o token retornado para `userToken` (só na sua máquina) e chame as rotas autenticadas.

A coleção nunca executa nada sozinha: confira o efeito de uma chamada antes de enviá-la.

## Estrutura

```text
http/
├── README.md
├── bruno.json
├── environments/
│   └── local.bru
└── <dominio>/
    └── NNN-verbo-rota.bru
```

- `bruno.json` é o manifesto da coleção.
- `environments/local.bru` guarda as variáveis locais: URL base e placeholders de autenticação.
- Cada subpasta agrupa um domínio ou recurso, com nome em inglês (`health`, `authentication`, `tasks`...).
- O modelo para copiar está em [`templates/http/`](../../templates/http/README.md), com seis exemplos de health check, autenticação e operações REST. Os exemplos de `tasks/` são ilustrativos: adapte rotas, payloads, paginação e autenticação ao contrato real do serviço.

## Convenções

- **Nome do arquivo:** `NNN-verbo-rota.bru`, numerado na ordem de uso.
- **Operações que alteram dados:** marque `[mutates]` no nome quando a chamada cria, atualiza ou remove dados, inicia um fluxo ou usa uma rota interna.
- **Documentação:** descreva em `docs {}` o efeito relevante da chamada, para permitir revisão antes da execução.
- **Credenciais:** tokens, senhas e chaves ficam vazios nos arquivos versionados e são preenchidos só localmente no Bruno.
- **IDs de exemplo:** use valores sintaticamente válidos e troque-os por IDs que existam no banco local.
- **Ambientes compartilhados:** não use a coleção para operações destrutivas em QA ou produção.
- **Sincronia:** quando o contrato da API mudar, a coleção muda no mesmo Pull Request.

## Veja também

- [Segredos e variáveis de ambiente](../infisical/README.md), de onde vêm as credenciais usadas no login local.
