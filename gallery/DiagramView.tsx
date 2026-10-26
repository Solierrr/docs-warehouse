import { useMemo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { GroupAction, Surface, SurfaceGroup } from "@solaria.network/web-lib";
import { IconFocusCentered, IconUser, IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import services from "./data/services.json";
import type {
  ContextDiagram,
  DiagramEntry,
  FlowDiagram,
  PlacedNode,
  SequenceDiagram,
  SequenceStep,
  UseCaseDiagram,
} from "./diagrams";
import { labels, type Locale } from "./i18n";
import { stackIcon, svgUrl } from "./stackIcons";

type Side = "top" | "right" | "bottom" | "left";
const positions: Record<Side, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};
const sides = Object.keys(positions) as Side[];

// Cada nó tem uma entrada e uma saída em cada lado; a aresta escolhe os lados pela posição relativa.
function Handles() {
  return (
    <>
      {sides.map((side) => (
        <Handle key={`s-${side}`} id={`s-${side}`} type="source" position={positions[side]} className="diagram-handle" />
      ))}
      {sides.map((side) => (
        <Handle key={`t-${side}`} id={`t-${side}`} type="target" position={positions[side]} className="diagram-handle" />
      ))}
    </>
  );
}

function pickSides(dx: number, dy: number): [Side, Side] {
  if (Math.abs(dx) < 1) return dy >= 0 ? ["bottom", "top"] : ["left", "left"];
  if (Math.abs(dy) < 1) return dx > 0 ? ["right", "left"] : ["left", "right"];
  if (dx > 0) return dy > 0 ? ["right", "top"] : ["right", "bottom"];
  return dy > 0 ? ["left", "top"] : ["left", "bottom"];
}

function StackGlyph({ name, size = 22 }: { name?: string; size?: number }) {
  const icon = name ? stackIcon(name) : undefined;
  if (!icon) return null;
  return <img src={svgUrl(icon.svg, size * 2)} alt="" width={size} height={size} className="shrink-0" />;
}

type Data = Record<string, unknown>;

const nodeTypes = {
  lane: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-lane" style={{ width: data.width as number, height: data.height as number }}>
      <span className="diagram-lane-title">{data.label as string}</span>
    </div>
  ),
  action: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-action">
      <Handles />
      {data.label as string}
    </div>
  ),
  decision: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-decision">
      <Handles />
      <svg className="diagram-decision-shape" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="50,1 99,25 50,49 1,25" />
      </svg>
      <span>{data.label as string}</span>
    </div>
  ),
  terminal: ({ data }: NodeProps<Node<Data>>) => (
    <div className={`diagram-terminal${data.end ? " diagram-terminal-end" : ""}`}>
      <Handles />
    </div>
  ),
  card: ({ data }: NodeProps<Node<Data>>) => (
    <div className={`diagram-card${data.highlight ? " diagram-card-highlight" : ""}`}>
      <Handles />
      <div className="diagram-card-head">
        {data.person ? <IconUser size={20} aria-hidden="true" /> : <StackGlyph name={data.icon as string} />}
        <span className="diagram-card-title">{data.label as string}</span>
      </div>
      {data.detail ? <span className="diagram-card-detail">{data.detail as string}</span> : null}
    </div>
  ),
  participant: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-participant">
      {data.icon ? <StackGlyph name={data.icon as string} size={18} /> : <IconUser size={18} aria-hidden="true" />}
      <span>{data.label as string}</span>
    </div>
  ),
  lifeline: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-lifeline" style={{ height: data.height as number }} />
  ),
  anchor: () => (
    <div className="diagram-anchor">
      <Handle id="s" type="source" position={Position.Right} className="diagram-handle" />
      <Handle id="t" type="target" position={Position.Left} className="diagram-handle" />
    </div>
  ),
  note: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-note" style={{ width: data.width as number }}>
      {data.label as string}
    </div>
  ),
  frame: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-frame" style={{ width: data.width as number, height: data.height as number }}>
      <span className="diagram-frame-tag">{data.label as string}</span>
      {(data.branches as { label: string; offset: number }[]).map((branch, index) => (
        <div
          key={branch.label}
          className={`diagram-frame-branch${index > 0 ? " diagram-frame-split" : ""}`}
          style={{ top: branch.offset }}
        >
          [{branch.label}]
        </div>
      ))}
    </div>
  ),
  actor: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-actor">
      <Handles />
      <svg viewBox="0 0 40 60" width="34" height="52" aria-hidden="true">
        <circle cx="20" cy="9" r="7" />
        <path d="M20 16v22M6 24h28M20 38 9 56M20 38l11 18" />
      </svg>
      <span>{data.label as string}</span>
    </div>
  ),
  usecase: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-usecase">
      <Handles />
      {data.label as string}
    </div>
  ),
  boundary: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-boundary" style={{ width: data.width as number, height: data.height as number }}>
      <span className="diagram-lane-title">{data.label as string}</span>
    </div>
  ),
  layer: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-layer" style={{ width: data.width as number, height: data.height as number }}>
      <span className="diagram-lane-title">{data.label as string}</span>
    </div>
  ),
};

function SelfEdge({ sourceX, sourceY, targetY, label, markerEnd, style }: EdgeProps) {
  const path = `M ${sourceX} ${sourceY} h 36 V ${targetY} h -32`;
  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="diagram-edge-label nodrag nopan"
          style={{ transform: `translate(${sourceX + 44}px, ${(sourceY + targetY) / 2}px) translateY(-50%)` }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const edgeTypes = { self: SelfEdge };

const arrow = { type: MarkerType.ArrowClosed, width: 16, height: 16 };
const labelStyle = {
  labelBgPadding: [6, 3] as [number, number],
  labelBgBorderRadius: 6,
  labelStyle: { fontSize: 11, fontWeight: 500 },
};

// Em diagramas posicionados livremente, a conexão segue o eixo com maior distância.
function pickPlacedSides(dx: number, dy: number): [Side, Side] {
  if (Math.abs(dy) >= 60) return dy > 0 ? ["bottom", "top"] : ["top", "bottom"];
  return dx > 0 ? ["right", "left"] : ["left", "right"];
}

function sideEdge(
  id: string,
  source: string,
  target: string,
  dx: number,
  dy: number,
  extra: Partial<Edge> = {},
  picker: (dx: number, dy: number) => [Side, Side] = pickSides,
): Edge {
  const [from, to] = picker(dx, dy);
  return {
    id,
    source,
    target,
    sourceHandle: `s-${from}`,
    targetHandle: `t-${to}`,
    type: "smoothstep",
    markerEnd: arrow,
    ...labelStyle,
    ...extra,
  };
}

// Atividades em raias: cada raia é uma coluna e cada passo tem uma linha fixa.
function flowGraph(body: FlowDiagram) {
  const laneWidth = 280;
  const rowHeight = 124;
  const top = 72;
  const rows = Math.max(...body.nodes.map((node) => node.row)) + 1;
  const height = top + rows * rowHeight;
  const size = { action: [210, 64], decision: [220, 116], start: [28, 28], end: [28, 28] } as const;
  const nodes: Node[] = body.lanes.map((label, lane) => ({
    id: `lane-${lane}`,
    type: "lane",
    position: { x: lane * laneWidth, y: 0 },
    data: { label, width: laneWidth, height },
    draggable: false,
    selectable: false,
    zIndex: -1,
  }));
  const centers = new Map<string, { lane: number; row: number }>();
  for (const node of body.nodes) {
    const [width, h] = size[node.kind];
    centers.set(node.id, node);
    nodes.push({
      id: node.id,
      type: node.kind === "start" || node.kind === "end" ? "terminal" : node.kind,
      position: { x: node.lane * laneWidth + (laneWidth - width) / 2, y: top + node.row * rowHeight + (rowHeight - h) / 2 },
      data: { label: node.label, end: node.kind === "end" },
      draggable: false,
    });
  }
  const edges = body.edges.map((edge, index) => {
    const a = centers.get(edge.source)!;
    const b = centers.get(edge.target)!;
    return sideEdge(`e${index}`, edge.source, edge.target, b.lane - a.lane, b.row - a.row, {
      label: edge.label,
      style: edge.dashed ? { strokeDasharray: "6 4" } : undefined,
    });
  });
  return { nodes, edges };
}

// Sequência: participantes no topo, linhas de vida e cada mensagem entre dois pontos de ancoragem.
function sequenceGraph(body: SequenceDiagram) {
  const column = 210;
  const center = (id: string) => body.participants.findIndex((item) => item.id === id) * column + column / 2;
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let y = 104;
  let count = 0;
  const anchor = (x: number, at: number) => {
    const id = `a${count++}`;
    nodes.push({ id, type: "anchor", position: { x, y: at }, data: {}, draggable: false, selectable: false });
    return id;
  };
  const columnsOf = (steps: SequenceStep[]): number[] =>
    steps.flatMap((step) => {
      if (step.kind === "self") return [center(step.on)];
      if (step.kind === "note") return step.over.map(center);
      if (step.kind === "frame") return step.branches.flatMap((branch) => columnsOf(branch.steps));
      return [center(step.from), center(step.to)];
    });

  const place = (steps: SequenceStep[]) => {
    for (const step of steps) {
      if (step.kind === "call" || step.kind === "reply") {
        const source = anchor(center(step.from), y);
        const target = anchor(center(step.to), y);
        edges.push({
          id: `m${count}`,
          source,
          target,
          sourceHandle: "s",
          targetHandle: "t",
          type: "straight",
          label: step.label,
          markerEnd: arrow,
          style: step.kind === "reply" ? { strokeDasharray: "6 4" } : undefined,
          ...labelStyle,
        });
        y += 58;
      } else if (step.kind === "self") {
        const source = anchor(center(step.on), y);
        const target = anchor(center(step.on) + 4, y + 26);
        edges.push({ id: `m${count}`, source, target, sourceHandle: "s", targetHandle: "t", type: "self", label: step.label, markerEnd: arrow });
        y += 70;
      } else if (step.kind === "note") {
        const [left, right] = step.over.map(center).sort((a, b) => a - b);
        const width = right - left + 150;
        nodes.push({
          id: `n${count++}`,
          type: "note",
          position: { x: left - 75, y: y - 14 },
          data: { label: step.label, width },
          draggable: false,
          selectable: false,
        });
        y += 58;
      } else if (step.kind === "frame") {
        const xs = columnsOf(step.branches.flatMap((branch) => branch.steps));
        const left = Math.min(...xs) - 95;
        const right = Math.max(...xs) + 95;
        const start = y - 30;
        const branches: { label: string; offset: number }[] = [];
        y += 14;
        for (const branch of step.branches) {
          branches.push({ label: branch.label, offset: y - start - 26 });
          y += 20;
          place(branch.steps);
        }
        nodes.push({
          id: `f${count++}`,
          type: "frame",
          position: { x: left, y: start },
          data: { label: step.label, branches, width: right - left, height: y - start - 18 },
          draggable: false,
          selectable: false,
          zIndex: -1,
        });
        y += 8;
      }
    }
  };
  place(body.steps);

  body.participants.forEach((participant, index) => {
    nodes.push({
      id: `p-${participant.id}`,
      type: "participant",
      position: { x: index * column + 20, y: 0 },
      data: { label: participant.label, icon: participant.icon },
      draggable: false,
      selectable: false,
    });
    nodes.push({
      id: `l-${participant.id}`,
      type: "lifeline",
      position: { x: index * column + column / 2 - 1, y: 52 },
      data: { height: y - 40 },
      draggable: false,
      selectable: false,
      zIndex: -2,
    });
  });
  return { nodes, edges };
}

function placedEdges(byId: Map<string, PlacedNode>, links: { source: string; target: string; label?: string; dashed?: boolean }[]) {
  return links.map((link, index) => {
    const a = byId.get(link.source)!;
    const b = byId.get(link.target)!;
    return sideEdge(
      `e${index}`,
      link.source,
      link.target,
      b.x - a.x,
      b.y - a.y,
      { label: link.label, style: link.dashed ? { strokeDasharray: "6 4" } : undefined },
      pickPlacedSides,
    );
  });
}

function contextGraph(body: ContextDiagram) {
  const all = [...body.people, body.system, ...body.externals];
  const byId = new Map(all.map((item) => [item.id, item]));
  const nodes: Node[] = all.map((item) => ({
    id: item.id,
    type: "card",
    position: { x: item.x, y: item.y },
    data: {
      label: item.label,
      detail: item.detail,
      icon: item.icon,
      person: body.people.includes(item),
      highlight: item === body.system,
    },
    draggable: false,
  }));
  return { nodes, edges: placedEdges(byId, body.edges) };
}

function useCaseGraph(body: UseCaseDiagram) {
  const byId = new Map([...body.actors, ...body.cases].map((item) => [item.id, item]));
  const xs = body.cases.map((item) => item.x);
  const ys = body.cases.map((item) => item.y);
  const nodes: Node[] = [
    {
      id: "boundary",
      type: "boundary",
      position: { x: Math.min(...xs) - 40, y: Math.min(...ys) - 70 },
      data: { label: "Plataforma", width: Math.max(...xs) - Math.min(...xs) + 300, height: Math.max(...ys) - Math.min(...ys) + 150 },
      draggable: false,
      selectable: false,
      zIndex: -1,
    },
    ...body.actors.map((item) => ({ id: item.id, type: "actor", position: { x: item.x, y: item.y }, data: { label: item.label }, draggable: false })),
    ...body.cases.map((item) => ({ id: item.id, type: "usecase", position: { x: item.x, y: item.y }, data: { label: item.label }, draggable: false })),
  ];
  const edges: Edge[] = [
    ...body.links.map((link, index) => {
      const a = byId.get(link.actor)!;
      const b = byId.get(link.useCase)!;
      return { ...sideEdge(`u${index}`, link.actor, link.useCase, b.x - a.x, 0), type: "straight", markerEnd: undefined };
    }),
    ...body.generalizations.map((link, index) => {
      const a = byId.get(link.child)!;
      const b = byId.get(link.parent)!;
      return {
        ...sideEdge(`g${index}`, link.child, link.parent, b.x - a.x, b.y - a.y),
        type: "straight",
        markerEnd: { type: MarkerType.Arrow, width: 22, height: 22 },
      };
    }),
  ];
  return { nodes, edges };
}

const layerOrder: { label: string; groups: string[] }[] = [
  { label: "Canais e borda", groups: ["client", "edge"] },
  { label: "APIs de domínio", groups: ["api"] },
  { label: "Inteligência", groups: ["ai"] },
  { label: "Dados e estado", groups: ["data"] },
  { label: "Operação de dados", groups: ["dataops"] },
  { label: "Infraestrutura", groups: ["infra"] },
  { label: "Bibliotecas e documentação", groups: ["lib"] },
];

function layersGraph() {
  const cardWidth = 210;
  const rowHeight = 150;
  const nodes: Node[] = [];
  const widest = Math.max(...layerOrder.map((layer) => services.nodes.filter((item) => layer.groups.includes(item.group)).length));
  layerOrder.forEach((layer, row) => {
    const members = services.nodes.filter((item) => layer.groups.includes(item.group));
    nodes.push({
      id: `layer-${row}`,
      type: "layer",
      position: { x: 0, y: row * rowHeight },
      data: { label: layer.label, width: widest * (cardWidth + 16) + 32, height: rowHeight - 16 },
      draggable: false,
      selectable: false,
      zIndex: -1,
    });
    members.forEach((item, index) => {
      nodes.push({
        id: item.id,
        type: "card",
        position: { x: 16 + index * (cardWidth + 16), y: row * rowHeight + 34 },
        data: { label: item.id, detail: item.stack, icon: item.icon },
        draggable: false,
      });
    });
  });
  return { nodes, edges: [] as Edge[] };
}

function graphOf(entry: DiagramEntry) {
  switch (entry.body.kind) {
    case "flow":
      return flowGraph(entry.body);
    case "sequence":
      return sequenceGraph(entry.body);
    case "context":
      return contextGraph(entry.body);
    case "usecase":
      return useCaseGraph(entry.body);
    default:
      return layersGraph();
  }
}

function Canvas({ entry, locale }: { entry: DiagramEntry; locale: Locale }) {
  const text = labels[locale];
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { nodes, edges } = useMemo(() => graphOf(entry), [entry]);
  return (
    <div className="diagram-layout">
      <Surface className="diagram-canvas" contentClassName="diagram-canvas-content">
        <div className="graph-toolbar">
          <SurfaceGroup direction="horizontal" divided={false} role="toolbar" aria-label={entry.title} className="shrink-0">
            <GroupAction
              layout="icon"
              label={text.zoomIn}
              glyph={<IconZoomIn size={22} className="shrink-0" aria-hidden="true" />}
              onClick={() => void zoomIn({ duration: 250 })}
            />
            <GroupAction
              layout="icon"
              label={text.zoomOut}
              glyph={<IconZoomOut size={22} className="shrink-0" aria-hidden="true" />}
              onClick={() => void zoomOut({ duration: 250 })}
            />
            <GroupAction
              layout="icon"
              label={text.reset}
              glyph={<IconFocusCentered size={22} className="shrink-0" aria-hidden="true" />}
              onClick={() => void fitView({ padding: 0.08, duration: 300 })}
            />
          </SurfaceGroup>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          minZoom={0.1}
          maxZoom={2.5}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
          className="diagram-flow"
        />
      </Surface>
      <Surface className="diagram-details" contentClassName="diagram-details-content">
        <h2 className="detail-title">{text.details}</h2>
        <p className="detail-name">{entry.title}</p>
        <p className="detail-text">{entry.summary}</p>
        <h3 className="detail-subtitle">{text.changes}</h3>
        <ul className="detail-changes">
          {entry.changes.map((change) => (
            <li key={change}>{change}</li>
          ))}
        </ul>
      </Surface>
    </div>
  );
}

export default function DiagramView({ entry, locale }: { entry: DiagramEntry; locale: Locale }) {
  return (
    <ReactFlowProvider key={entry.id}>
      <Canvas entry={entry} locale={locale} />
    </ReactFlowProvider>
  );
}
