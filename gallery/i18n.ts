export const languages = [
  { code: "pt-BR", label: "Português" },
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Español" },
] as const;
export type Locale = (typeof languages)[number]["code"];

export interface Labels {
  views: string;
  note: string;
  repository: string;
  services: string;
  repositoryHint: string;
  files: string;
  filesUnit: string;
  folders: string;
  open: string;
  details: string;
  empty: string;
  stack: string;
  group: string;
  relations: string;
  outgoing: string;
  incoming: string;
  filters: string;
  reset: string;
  zoomIn: string;
  zoomOut: string;
  changes: string;
  planned: string;
  notInOrg: string;
}

export const labels: Record<Locale, Labels> = {
  "pt-BR": {
    views: "Diagramas",
    note: "Os diagramas e as descrições estão em português.",
    repository: "Organização do repositório",
    services: "Relação entre os serviços",
    repositoryHint: "Gerado a partir das pastas do repositório. Clique em uma pasta para expandir as subpastas e ver o detalhe.",
    files: "Arquivos",
    filesUnit: "arquivos",
    folders: "Subpastas",
    open: "Abrir no GitHub",
    details: "Detalhes",
    empty: "Selecione um item no diagrama.",
    stack: "Tecnologia",
    group: "Grupo",
    relations: "Relações",
    outgoing: "Usa",
    incoming: "É usado por",
    filters: "Filtros do grafo",
    reset: "Reenquadrar",
    zoomIn: "Aproximar",
    zoomOut: "Afastar",
    changes: "O que mudou desde o Miro",
    planned: "Planejada",
    notInOrg: "Sem repositório próprio (recurso de infraestrutura).",
  },
  "en-US": {
    views: "Diagrams",
    note: "The diagrams and descriptions are written in Portuguese.",
    repository: "Repository organization",
    services: "Service relations",
    repositoryHint: "Generated from the repository folders. Click a folder to expand its subfolders and see details.",
    files: "Files",
    filesUnit: "files",
    folders: "Subfolders",
    open: "Open on GitHub",
    details: "Details",
    empty: "Select an item in the diagram.",
    stack: "Technology",
    group: "Group",
    relations: "Relations",
    outgoing: "Uses",
    incoming: "Used by",
    filters: "Graph filters",
    reset: "Fit view",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    changes: "What changed since Miro",
    planned: "Planned",
    notInOrg: "No repository of its own (infrastructure resource).",
  },
  "es-ES": {
    views: "Diagramas",
    note: "Los diagramas y las descripciones están en portugués.",
    repository: "Organización del repositorio",
    services: "Relación entre los servicios",
    repositoryHint: "Generado a partir de las carpetas del repositorio. Haz clic en una carpeta para expandir sus subcarpetas y ver el detalle.",
    files: "Archivos",
    filesUnit: "archivos",
    folders: "Subcarpetas",
    open: "Abrir en GitHub",
    details: "Detalles",
    empty: "Selecciona un elemento del diagrama.",
    stack: "Tecnología",
    group: "Grupo",
    relations: "Relaciones",
    outgoing: "Usa",
    incoming: "Es usado por",
    filters: "Filtros del grafo",
    reset: "Reencuadrar",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    changes: "Qué cambió desde Miro",
    planned: "Planificada",
    notInOrg: "Sin repositorio propio (recurso de infraestructura).",
  },
};

export const repository = "https://github.com/Solierrr/docs-warehouse";
