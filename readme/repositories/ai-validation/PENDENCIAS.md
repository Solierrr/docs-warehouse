<p align="center">
  <img src="./assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Pendências

## 1. Contrato de validação profissional

- Onde aparece em `docs/OVERVIEW.md, docs/ARCHITECTURE.md, docs/API.md e docs/STATUS.md`.
- O que o código mostra é que não há rota profissional nesta main. O cadastro central espera outro contrato e o helper de chave não está aplicado a uma rota de validação.
- Hipótese usada no texto é descrever certificados e CNPJ como fluxos atuais. Confirmar contrato e sequência de adoção antes de ligar o consumidor.
- Resposta do dono fica em aberto.

## 2. Política de aceitação de certificados

- Onde aparece em `docs/OVERVIEW.md e docs/STATUS.md`.
- O que o código mostra é que a consolidação usa 730 dias, 20 e 8 horas e similaridade 85. Datas ausentes ou inválidas não são reprovadas por verificação independente.
- Hipótese usada no texto é descrever como critérios implementados, sem apresentar como comprovação normativa. Confirmar política de formação, reciclagem, datas e vínculo com a pessoa.
- Resposta do dono fica em aberto.

## 3. Configuração efetiva dos ambientes

- Onde aparece em `docs/RUNNING.md, docs/API.md, docs/DEPLOY.md e docs/STATUS.md`.
- O que o código mostra é que jWT é padrão, mas AUTH_REQUIRED pode desligar. O texto do bootstrap diz público. Debug admite PROD com lista de administradores. Os valores e revisões implantadas não foram consultados.
- Hipótese usada no texto é seguir os routers atuais. Confirmar issuer, exigência JWT, configuração de docs e debug e revisão implantada nos ambientes.
- Resposta do dono fica em aberto.

## 4. Origem e limites das imagens

- Onde aparece em `docs/ARCHITECTURE.md e docs/STATUS.md`.
- O que o código mostra é que download HTTP ou HTTPS segue redirects, sem limite de bytes ou lista de origens declarados nesse caminho.
- Hipótese usada no texto é exigir URL acessível no contrato documentado. Confirmar armazenamento aceito, limite de tamanho e política de acesso para documentos pessoais.
- Resposta do dono fica em aberto.
