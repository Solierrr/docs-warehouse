import data from "./data/diagrams.json";

// Diagramas que vieram do board do Miro, atualizados para o que o código faz hoje (outubro de 2026).
// Os dados ficam em data/diagrams.json; cada diagrama guarda também o que mudou em relação ao original.

export type DiagramGroup = "architecture" | "sequence" | "flow" | "usecase";

export interface FlowNode {
  id: string;
  lane: number;
  row: number;
  kind: "start" | "end" | "action" | "decision";
  label?: string;
}
export interface FlowEdge {
  source: string;
  target: string;
  label?: string;
  dashed?: boolean;
}
export interface FlowDiagram {
  kind: "flow";
  lanes: string[];
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface Participant {
  id: string;
  label: string;
  icon?: string;
}
export type SequenceStep =
  | { kind: "call" | "reply"; from: string; to: string; label: string }
  | { kind: "self"; on: string; label: string }
  | { kind: "note"; over: [string, string]; label: string }
  | { kind: "frame"; label: string; branches: { label: string; steps: SequenceStep[] }[] };
export interface SequenceDiagram {
  kind: "sequence";
  participants: Participant[];
  steps: SequenceStep[];
}

export interface PlacedNode {
  id: string;
  label: string;
  detail?: string;
  icon?: string;
  x: number;
  y: number;
}
export interface ContextEntity {
  id: string;
  label: string;
  detail: string;
  icon?: string;
  operation?: boolean;
}
export interface ContextDiagram {
  kind: "context";
  people: ContextEntity[];
  system: { label: string; detail: string; contains: string[] };
  externals: ContextEntity[];
}

export interface UseCaseDiagram {
  kind: "usecase";
  actors: PlacedNode[];
  cases: PlacedNode[];
  links: { actor: string; useCase: string }[];
  generalizations: { child: string; parent: string }[];
}

export interface LayersDiagram {
  kind: "layers";
}

export interface DiagramEntry {
  id: string;
  group: DiagramGroup;
  title: string;
  summary: string;
  changes: string[];
  body: FlowDiagram | SequenceDiagram | ContextDiagram | UseCaseDiagram | LayersDiagram;
}

export const diagrams = data as DiagramEntry[];
