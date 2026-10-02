# Template da coleção Bruno local

Copie o diretório `templates/http/` para a raiz do repositório da API. Abra `http/` como uma coleção Bruno e selecione o ambiente `local`; ajuste `baseUrl` em `environments/local.bru` para a porta do serviço.

## Estrutura

- `bruno.json`: manifesto da coleção.
- `environments/local.bru`: variáveis locais, incluindo URL base e placeholders de autenticação.
- `exemplos/001-get-example.bru`: exemplo de requisição; substitua a rota antes de executar.
- `README.md`: instruções da coleção e regras de manutenção.

## Convenções

- Separe as requisições em subpastas por domínio ou recurso.
- Numere e nomeie os arquivos como `NNN-verbo-rota.bru`.
- Marque no nome com `[mutates]` as operações que criam, atualizam, removem dados, iniciam fluxos ou chamam rotas internas.
- Descreva em `docs {}` o efeito relevante das operações para permitir revisão antes da execução.
- Deixe credenciais, tokens e chaves vazios nos arquivos versionados; preencha-os apenas localmente no Bruno.
- Use IDs de exemplo sintaticamente válidos e troque-os por IDs existentes no banco local quando necessário.
- A coleção não executa requisições automaticamente. Confira o efeito de uma chamada antes de enviá-la.
- Mantenha os exemplos sincronizados com o contrato real e não use a coleção para operações destrutivas em ambientes compartilhados.

A coleção é um cliente manual de desenvolvimento e não substitui testes automatizados nem a especificação OpenAPI.
