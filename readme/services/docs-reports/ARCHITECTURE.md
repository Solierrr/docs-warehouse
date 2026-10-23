<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/html.png" alt="HTML5" width="100%">
</p>

# Arquitetura do Repositório

O `docs-reports` gera relatórios, documentos e manuais em HTML com agentes de inteligência artificial. Um agente orquestrador lê as instruções do repositório, conduz uma entrevista para registrar a especificação do documento e, depois da aprovação, distribui o trabalho entre agentes de pesquisa, redação e diagramação. Uma revisão independente avalia o resultado, em até três ciclos. O conteúdo é escrito sobre modelos que já trazem a identidade visual.

- **Instruções dos agentes:** `AGENTS.md` define o papel do orquestrador; `CLAUDE.md` e `GEMINI.md` adaptam essas instruções a cada ferramenta, e `.claude/` guarda os agentes e as skills.
- **Modelos (`templates/`):** documento, manual e relatório em HTML.
- **Sistema visual (`design-system/`):** fontes, logos, tokens e diretrizes aplicados pelos modelos.
- **Saídas (`documents/`):** cada documento gerado fica numa pasta própria.
- **Padrão editorial (`editorial.md`):** regras de escrita aplicadas pela revisão.

## Estrutura do repositório

```text
├── .claude/
│   ├── agents/
│   └── skills/
├── .github/
├── design-system/
├── documents/
├── templates/
│   ├── document.html
│   ├── manual.html
│   └── report.html
├── AGENTS.md
├── CLAUDE.md
├── GEMINI.md
├── editorial.md
├── Makefile
└── README.md
```
