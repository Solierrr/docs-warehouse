<p align="center">
  <img src="../assets/readme/banners/springboot.png" alt="springboot" width="100%">
</p>

# Situação

Os itens refletem a main consultada em 2026-10-31.

- Cadastro, login, vínculo federado, rotação de refresh e autorização mobile possuem implementação e testes.
- Recuperação e confirmação já chamam `api-email`, contrariando a indicação antiga de envio por SMTP próprio.
- O cliente de e-mail envia `X-API-Key`, enquanto o padrão atual exige `X-Service-Key`. A configuração efetiva precisa de confirmação. <!-- PENDENTE: 3 -->
- TOTP tem estrutura de dados e serviço, mas não tem rota de configuração. A exclusão de conta não tem endpoint implementado.
- A configuração atual libera `/internal/**` sem autenticação por chave. <!-- PENDENTE: 2 -->
- A política de Google e Microsoft está registrada no checklist e no schema, mas precisa ser alinhada à validação federada executada. <!-- PENDENTE: 1 -->
