<p align="center">
  <img src="../assets/readme/banners/rabbitmq.png" alt="RabbitMQ" width="100%">
</p>

# Estrutura inicial

O repositório ainda guarda os arquivos do modelo de criação da organização, que é completo de propósito, e cada um deles deve ser mantido, adaptado ou removido quando a tecnologia do broker for escolhida. A [matriz por tipo de repositório](https://github.com/Solierrr/docs-warehouse/blob/main/templates/README.md#matriz-por-tipo) indica quais arquivos cada tipo de repositório usa.

## Arquivos do modelo

| Arquivo | Para que serve |
|---|---|
| `http/` | a coleção Bruno com requisições de exemplo, agrupadas em pastas em inglês como `health/`, `authentication/` e `tasks/` |
| `http/environments/local.bru` | o ambiente local da coleção, com as credenciais vazias |
| `Dockerfile` | o ponto de partida para empacotar a aplicação numa imagem |
| `.dockerignore` | a lista que impede segredos e arquivos locais de entrarem no build da imagem |
| `entrypoint.sh` | o launcher que busca a configuração no Infisical em runtime, quando há credenciais de Universal Auth |
| `.env.example` | os nomes das variáveis necessárias, com valores de exemplo e nenhuma credencial real |

## Inicialização da imagem no Render

O `entrypoint.sh` recebe o comando da aplicação definido no `CMD` do `Dockerfile`. Quando `INFISICAL_CLIENT_ID` e `INFISICAL_CLIENT_SECRET` existem em runtime, ele autentica por Universal Auth e inicia esse comando sob `infisical run`, e sem essas credenciais executa o comando diretamente, com as variáveis que a plataforma já injetou.

O projeto e o ambiente do Infisical vêm de `INFISICAL_PROJECT_ID` e `INFISICAL_ENV`, com o ambiente `qa` como padrão. As credenciais de Universal Auth entram como variáveis de runtime do Render, nunca como argumento ou variável de build, porque um segredo usado no build pode ficar gravado na imagem.
