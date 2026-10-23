<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/template.png" alt="Template" width="100%">
</p>

# Arquitetura do Repositório

## Estrutura inicial

O molde é completo de propósito. Consulte a [matriz por tipo de repositório](https://github.com/Solierrr/docs-warehouse/blob/main/templates/README.md#matriz-por-tipo) e remova depois, no repositório novo, os arquivos que o seu tipo não usa.

- `http/README.md`: convenções do cliente HTTP local.
- `http/bruno.json`: manifesto da coleção Bruno.
- `http/environments/local.bru`: ambiente local da API, com credenciais vazias.
- `http/`: requisições `.bru` agrupadas em diretórios em inglês (`health/`, `authentication/`, `tasks/`).
- `.dockerignore`: exclui segredos e arquivos locais do contexto de build da imagem.
- `entrypoint.sh`: busca configuração no Infisical em runtime quando Universal Auth está configurado; sem essas credenciais, inicia diretamente o comando da imagem.
- `Makefile`: comandos padrão da organização (`make help`); preencha o bloco "especifico deste repositorio" com os valores da stack, copiando o fragmento de `docs-warehouse/templates/make/`.
- `.env.example`: nomes e valores de exemplo das variáveis necessárias; não inclua credenciais reais.
- `Dockerfile`: ponto de partida para empacotar a aplicação.

## Cliente HTTP local

Abra `http/` como uma coleção Bruno e edite os arquivos `.bru` para incluir as rotas reais do serviço. Consulte [`http/README.md`](https://github.com/Solierrr/generic-template/blob/main/http/README.md) para instruções e o template canônico em [`docs-warehouse/templates/http/`](https://github.com/Solierrr/docs-warehouse/tree/main/templates/http).

Antes de disponibilizar o repositório, substitua as descrições de exemplo e revise os links e comandos para refletir a stack escolhida.

## Inicialização da imagem no Render

O `entrypoint.sh` recebe o comando da aplicação definido no `CMD` do `Dockerfile`. Se `INFISICAL_CLIENT_ID` e `INFISICAL_CLIENT_SECRET` estiverem presentes em runtime, ele autentica via Universal Auth e inicia esse comando sob `infisical run`; caso contrário, executa-o diretamente com as variáveis já injetadas pela plataforma. O projeto padrão é o workspace plataforma e o ambiente padrão é `qa`; ambos podem ser substituídos por `INFISICAL_PROJECT_ID` e `INFISICAL_ENV`.

Para ativar o caminho Infisical, instale o CLI na imagem runtime e configure as credenciais como variáveis de runtime do Render, nunca como argumentos ou variáveis de build. Quando o Render já fornecer os segredos diretamente, não configure as credenciais Universal Auth e o launcher apenas inicia a aplicação. Use um launcher específico quando o serviço precisar preparar arquivos ou fazer outra transformação antes de iniciar.
