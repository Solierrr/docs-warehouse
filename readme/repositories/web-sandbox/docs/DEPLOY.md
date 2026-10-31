<p align="center">
  <img src="../assets/readme/banners/react.png" alt="react" width="100%">
</p>

# Deploy

O Dockerfile usa Node.js 24, compila frontend e servidor e executa a aplicação na porta 5180. O entrypoint carrega configuração de QA. Publicar apenas o diretório `dist` não disponibiliza o proxy.

O README de origem indica https://web-sandbox-qa.onrender.com para o Web Service, enquanto o workflow de ambiente ainda aponta https://web-sandbox-7ug0.onrender.com. O destino vigente precisa de confirmação. <!-- PENDENTE: 2 -->

O processo comum está em [QA_RENDER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md). Este serviço é independente e publica a main. Credenciais do proxy ficam no ambiente do servidor, fora do build do navegador.
