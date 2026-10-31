<p align="center">
  <img src="../assets/readme/banners/postgresql.png" alt="postgresql" width="100%">
</p>

# Credenciais e backup

`make vault` obtém a configuração de `/database` no Infisical. O `.env` é ignorado pelo Git. Os comandos usam os nomes das variáveis, sem necessidade de registrar valores na documentação.

`make backup TARGET=core`, `TARGET=auth` ou `TARGET=all` chama o script PowerShell e `pg_dump`. O dump é SQL plain. A gravação usa temporário e só passa ao nome final depois de sucesso e conteúdo não vazio. Os arquivos ficam em `backups/`, fora do versionamento. MongoDB e analytics não são incluídos nesse comando.

A política de retenção, armazenamento externo e restauração deve ser definida pelo responsável. <!-- PENDENTE: 1 --> Os dumps podem conter dados das contas e precisam permanecer fora do repositório.

O contrato em `db/roles/contracts.json` separa grupos sem login e logins por consumidor. O comando `roles.py login` obtém a senha de uma variável de ambiente indicada pelo operador. Os papéis de leitura não recebem acesso geral a `public`.
