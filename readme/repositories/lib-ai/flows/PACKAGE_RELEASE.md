<p align="center">
  <img src="../assets/readme/banners/pypi.png" alt="PyPI" width="100%">
</p>

# Publicação do pacote

O workflow consulta a versão antes de construir e publicar.

```mermaid
flowchart TD
  A[Push na main ou disparo manual] --> B[Consultar versão no PyPI]
  B -->|Existe| C[Encerrar sem publicar]
  B -->|Ausente| D[Instalar e validar]
  B -->|Falha de consulta| E[Encerrar com erro]
  D -->|Falha| E
  D -->|Sucesso| F[Construir distribuição]
  F --> G[Publicar por identidade do workflow]
  G --> H[Consumidor atualiza dependência]
```

## Falhas e limites

Falha de consulta não equivale a versão ausente. Falhas de teste, lint e build impedem a publicação. Trusted Publishing depende do ambiente configurado. O processo integrado está em [release e deploy](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RELEASE_AND_DEPLOY.md).

Fonte em [implementação](https://github.com/Solierrr/lib-ai/blob/main/.github/workflows/publish.yml).
