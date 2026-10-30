<p align="center">
  <img src="../assets/readme/banners/google.png" alt="Google" width="100%">
</p>

# Situação verificada em 2026-10-30

## Em funcionamento

- Em 2026-10-30, as rotas de endereço, fuso, tradução e energia solar estão implementadas na `main`.
- Em 2026-10-30, as rotas de usuário validam JWT e as rotas internas validam `X-Service-Key`.
- Em 2026-10-30, o contrato OpenAPI é exportado do código e há testes de rotas, serviços e adaptadores.

## Limitações

- Em 2026-10-30, duas rotas antigas permanecem abertas durante a migração dos chamadores. <!-- PENDENTE: 1 -->
- Em 2026-10-30, o cliente de token do Calendar não é usado por uma rota, embora suas configurações de OAuth sejam exigidas. <!-- PENDENTE: 2 -->
- Em 2026-10-30, o acesso de PROD é interno segundo o checklist. O caminho para o aplicativo móvel não está decidido. <!-- PENDENTE: 3 -->
- Em 2026-10-30, os nomes do repositório, da imagem e do serviço publicado divergem. <!-- PENDENTE: 4 -->
- Em 2026-10-30, o `Dockerfile` usa `python:latest` e o `pyproject.toml` exige Python 3.14 ou superior.
