<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/html.png" alt="HTML5" width="100%">
</p>

# Como usar

## Detalhes técnicos

Repositório para produzir **relatórios, documentos e manuais de instrução da plataforma em HTML**, com agentes de IA. Os modelos já trazem a identidade visual; o agente escreve o conteúdo por cima.

## Como usar

1. Abra uma sessão de um assistente de IA (Claude Code, Gemini, Codex...) na raiz do repositório. Ele lê o [AGENTS.md](https://github.com/Solierrr/docs-reports/blob/main/AGENTS.md) e assume o papel de orquestrador.
2. Diga o que precisa: um relatório, um manual ou um documento. O orquestrador conduz uma entrevista (grilling) e grava uma especificação.
3. **Aprove a especificação.** Nada é gerado antes disso.
4. O orquestrador despacha os agentes (pesquisa, redação, diagramação) e uma revisão independente, e repete até aprovar ou atingir 3 ciclos.
5. O resultado fica em `documents/<nome>/<nome>.html`.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| [AGENTS.md](https://github.com/Solierrr/docs-reports/blob/main/AGENTS.md) | Fonte única de instruções. `CLAUDE.md` e `GEMINI.md` apontam para ele |
| [.claude/agents/](https://github.com/Solierrr/docs-reports/tree/main/.claude/agents) | Agentes: orquestrador, pesquisador, redator, diagramador e revisor, com suas personas (lentes) |
| [.claude/skills/grilling/](https://github.com/Solierrr/docs-reports/blob/main/.claude/skills/grilling/SKILL.md) | Skill obrigatória de entrevista antes de gerar |
| [templates/](https://github.com/Solierrr/docs-reports/blob/main/templates/README.md) | `report.html`, `manual.html` e `document.html` com identidade e espaços `data-slot` |
| [design-system/](https://github.com/Solierrr/docs-reports/blob/main/design-system/README.md) | Identidade plataforma: tokens, logos, fontes, diretrizes |
| [editorial.md](https://github.com/Solierrr/docs-reports/blob/main/editorial.md) | Convenções editoriais |
| [documents/](https://github.com/Solierrr/docs-reports/blob/main/documents/README.md) | Entregáveis |
| `.runs/<nome>/` | Trabalho local ignorado pelo Git |

Não há aplicação, build, workflow nem dependências. HTML e PDF (sob pedido, pela impressão do navegador) em A4 retrato; o PDF não é o entregável padrão.
