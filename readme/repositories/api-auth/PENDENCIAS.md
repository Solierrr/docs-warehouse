<p align="center">
  <img src="./assets/readme/banners/springboot.png" alt="springboot" width="100%">
</p>

# Pendências

## 1. Restrição dos provedores federados

- Onde aparece: `docs/OVERVIEW.md` e `docs/STATUS.md`.
- O que o código mostra: a decisão e o schema permitem Google e Microsoft, mas o serviço de login usa emissor e sujeito do Firebase sem restrição explícita do provedor nesse fluxo.
- Hipótese usada no texto: a decisão de produto é registrada e a aplicação efetiva permanece por confirmar.
- Resposta do dono:

## 2. Proteção das rotas internas

- Onde aparece: `docs/ARCHITECTURE.md`, `docs/API.md` e `docs/STATUS.md`.
- O que o código mostra: `SecurityConfig` permite `/internal/**`, diferentemente do padrão que exige chave por chamador.
- Hipótese usada no texto: a documentação descreve a main e não pressupõe proteção externa de rede.
- Resposta do dono:

## 3. Transporte de e-mail implantado

- Onde aparece: `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: o cliente já chama `api-email` com `X-API-Key`, em vez de SMTP próprio indicado no checklist. O padrão atual usa outro cabeçalho.
- Hipótese usada no texto: o fluxo existe no código, mas a configuração e a compatibilidade no ambiente não foram comprovadas.
- Resposta do dono:
