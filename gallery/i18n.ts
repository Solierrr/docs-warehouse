export const languages = [
  { code: "pt-BR", label: "Português" },
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Español" },
] as const;
export type Locale = (typeof languages)[number]["code"];

export interface Labels {
  language: string;
  github: string;
  views: string;
  note: string;
  repository: string;
  services: string;
  repositoryHint: string;
  servicesHint: string;
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
  planned: string;
  notInOrg: string;
}

export const labels: Record<Locale, Labels> = {
  "pt-BR": {
    language: "Idioma",
    github: "Repositório no GitHub",
    views: "Diagramas",
    note: "Os diagramas e as descrições estão em português.",
    repository: "Organização do repositório",
    services: "Relação entre os serviços",
    repositoryHint: "Gerado a partir das pastas do repositório. Clique em uma pasta para expandir as subpastas e ver o detalhe.",
    servicesHint: "Clique em um serviço para ver o que ele usa e quem o usa. Arraste para reorganizar.",
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
    filters: "Tipos de relação",
    reset: "Reenquadrar",
    planned: "Planejada",
    notInOrg: "Sem repositório próprio (recurso de infraestrutura).",
  },
  "en-US": {
    language: "Language",
    github: "GitHub repository",
    views: "Diagrams",
    note: "The diagrams and descriptions are written in Portuguese.",
    repository: "Repository organization",
    services: "Service relations",
    repositoryHint: "Generated from the repository folders. Click a folder to expand its subfolders and see details.",
    servicesHint: "Click a service to see what it uses and who uses it. Drag to rearrange.",
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
    filters: "Relation types",
    reset: "Fit view",
    planned: "Planned",
    notInOrg: "No repository of its own (infrastructure resource).",
  },
  "es-ES": {
    language: "Idioma",
    github: "Repositorio en GitHub",
    views: "Diagramas",
    note: "Los diagramas y las descripciones están en portugués.",
    repository: "Organización del repositorio",
    services: "Relación entre los servicios",
    repositoryHint: "Generado a partir de las carpetas del repositorio. Haz clic en una carpeta para expandir sus subcarpetas y ver el detalle.",
    servicesHint: "Haz clic en un servicio para ver qué usa y quién lo usa. Arrastra para reorganizar.",
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
    filters: "Tipos de relación",
    reset: "Reencuadrar",
    planned: "Planificada",
    notInOrg: "Sin repositorio propio (recurso de infraestructura).",
  },
};

export const repository = "https://github.com/Solierrr/docs-warehouse";
