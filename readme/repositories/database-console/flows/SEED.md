<p align="center">
  <img src="../assets/readme/banners/postgresql.png" alt="postgresql" width="100%">
</p>

# Carga planejada

A carga constrói um conjunto determinístico e usa as imagens do catálogo de mocks.

```mermaid
flowchart TD
 A[Plano e manifesto] --> B[Constrói dados e relatório]
 B --> C{Dry run?}
 C -->|sim| D[Encerra sem escrita]
 C -->|não| E[Valida ambiente e imagens]
 E --> F[Grava core e auth]
```

Ambiente não permitido, configuração ausente e imagens insuficientes no modo estrito interrompem a carga. QA exige hash de senha próprio. `--core-only` evita gravar identidade. `--reset` remove somente os identificadores gerados pelo plano.
