<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

# Escolha de idioma

Somente navegações HTML GET e HEAD entram na normalização. APIs, arquivos, métodos de escrita e iscas são preservados.

```mermaid
flowchart TD
 A[Navegação HTML] --> B[URL, cookie, idioma do navegador ou padrão]
 B --> C{Prefixo precisa mudar?}
 C -->|sim| D[Redireciona 302 sem cache]
 C -->|não| E[Segue para origem]
 D --> F[Salva preferência]
 E --> F
```

O contexto de entrada da plataforma está no [mapa de integrações](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md).
