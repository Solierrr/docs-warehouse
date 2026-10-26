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
  ContextEntity,
  DiagramEntry,
  FlowDiagram,
  SequenceDiagram,
  SequenceStep,
  UseCaseDiagram,
} from "./diagrams";
import { labels, type Locale } from "./i18n";
import { groupColors } from "./palette";
import { monogramTile, stackIcon, svgUrl } from "./stackIcons";

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

function StackGlyph({ name, size = 22, fallback }: Readonly<{ name?: string; size?: number; fallback?: string }>) {
  const icon = name ? stackIcon(name) : undefined;
  let src: string | undefined;
  if (icon) src = svgUrl(icon.svg, size * 2);
  else if (fallback) src = monogramTile(fallback, size * 2);
  if (!src) return null;
  return <img src={src} alt="" width={size} height={size} className="shrink-0" />;
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
  entity: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-entity" style={{ borderTopColor: data.color as string }}>
      <Handles />
      <div className="diagram-card-head">
        {data.person ? (
          <span className="diagram-entity-person" aria-hidden="true">
            <IconUser size={18} />
          </span>
        ) : (
          <StackGlyph name={data.icon as string} size={24} fallback={data.label as string} />
        )}
        <span className="diagram-card-title">{data.label as string}</span>
      </div>
      <span className="diagram-card-detail">{data.detail as string}</span>
    </div>
  ),
  system: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-system" style={{ width: data.width as number }}>
      <Handles />
      <span className="diagram-system-title">{data.label as string}</span>
      <span className="diagram-system-detail">{data.detail as string}</span>
      <ul className="diagram-system-parts">
        {(data.contains as string[]).map((part) => (
          <li key={part}>{part}</li>
        ))}
      </ul>
    </div>
  ),
  band: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-band" style={{ width: data.width as number, height: data.height as number }}>
      <span className="diagram-band-stripe" style={{ background: data.color as string }} aria-hidden="true" />
      <span className="diagram-band-title">{data.label as string}</span>
      {data.detail ? <span className="diagram-band-detail">{data.detail as string}</span> : null}
    </div>
  ),
  bandAnchor: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-band-anchor" style={{ height: data.height as number }}>
      <Handles />
    </div>
  ),
  member: ({ data }: NodeProps<Node<Data>>) => (
    <div className="diagram-member">
      <div className="diagram-card-head">
        <StackGlyph name={data.icon as string} size={22} fallback={data.label as string} />
        <span className="diagram-card-title">{data.label as string}</span>
      </div>
      <span className="diagram-member-role">{data.detail as string}</span>
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

function sideEdge(id: string, source: string, target: string, dx: number, dy: number, extra: Partial<Edge> = {}): Edge {
  const [from, to] = pickSides(dx, dy);
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
    nodes.push(
      {
        id: `p-${participant.id}`,
        type: "participant",
        position: { x: index * column + 20, y: 0 },
        data: { label: participant.label, icon: participant.icon },
        draggable: false,
        selectable: false,
      },
      {
        id: `l-${participant.id}`,
        type: "lifeline",
        position: { x: index * column + column / 2 - 1, y: 52 },
        data: { height: y - 40 },
        draggable: false,
        selectable: false,
        zIndex: -2,
      },
    );
  });
  return { nodes, edges };
}

// Contexto da esquerda para a direita: quem usa, a plataforma e os serviços que ela usa. Embaixo, a entrega
// e a operação que a sustentam. Cada card diz a sua relação, então os conectores ficam sem rótulo e não se cruzam.
function contextGraph(body: ContextDiagram) {
  const cardWidth = 250;
  const cardHeight = 112;
  const gap = 20;
  const column = (count: number) => count * cardHeight + (count - 1) * gap;
  const used = body.externals.filter((item) => !item.operation);
  const operation = body.externals.filter((item) => item.operation);
  const systemWidth = 360;
  const peopleX = 32;
  const systemX = peopleX + cardWidth + 140;
  const usedX = systemX + systemWidth + 140;
  const width = usedX + cardWidth + 32;
  const top = 56;
  const sideHeight = Math.max(column(body.people.length), column(used.length));
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const band = (id: string, label: string, x: number, y: number, bandWidth: number, height: number, color: string) =>
    nodes.push({
      id,
      type: "band",
      position: { x, y },
      data: { label, width: bandWidth, height, color },
      draggable: false,
      selectable: false,
      zIndex: -1,
    });
  const card = (item: ContextEntity, x: number, y: number, person: boolean) =>
    nodes.push({
      id: item.id,
      type: "entity",
      position: { x, y },
      data: { ...item, person, color: person ? groupColors.client : groupColors.managed },
      draggable: false,
    });
  const link = (id: string, source: string, target: string, from: Side, to: Side) =>
    edges.push({ id, source, target, sourceHandle: `s-${from}`, targetHandle: `t-${to}`, type: "smoothstep", markerEnd: arrow });

  band("band-people", "Quem usa", 0, 0, cardWidth + 64, top + sideHeight + 24, groupColors.client);
  body.people.forEach((item, index) => {
    card(item, peopleX, top + index * (cardHeight + gap) + (sideHeight - column(body.people.length)) / 2, true);
    link(`p-${item.id}`, item.id, "platform", "right", "left");
  });
  band("band-used", "Serviços que a plataforma usa", usedX - 32, 0, cardWidth + 64, top + sideHeight + 24, groupColors.managed);
  used.forEach((item, index) => {
    card(item, usedX, top + index * (cardHeight + gap) + (sideHeight - column(used.length)) / 2, false);
    link(`u-${item.id}`, "platform", item.id, "right", "left");
  });
  const systemHeight = 230;
  nodes.push({
    id: "platform",
    type: "system",
    position: { x: systemX, y: top + (sideHeight - systemHeight) / 2 },
    data: { ...body.system, width: systemWidth },
    draggable: false,
  });
  const operationY = top + sideHeight + 80;
  const rowWidth = operation.length * cardWidth + (operation.length - 1) * gap;
  const operationWidth = Math.max(width, rowWidth + 64);
  band("band-operation", "Entrega e operação", 0, operationY, operationWidth, 72 + cardHeight + 24, groupColors.environment);
  nodes.push({
    id: "operation-anchor",
    type: "bandAnchor",
    position: { x: systemX + systemWidth / 2, y: operationY },
    data: { height: 1 },
    draggable: false,
    selectable: false,
  });
  link("operation", "operation-anchor", "platform", "top", "bottom");
  const start = (operationWidth - rowWidth) / 2;
  operation.forEach((item, index) => card(item, start + index * (cardWidth + gap), operationY + 56, false));
  return { nodes, edges };
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

interface Layer {
  label: string;
  detail: string;
  groups: string[];
  path?: boolean;
}

const layerOrder: Layer[] = [
  { label: "Canais", detail: "Onde as pessoas usam a plataforma.", groups: ["client"], path: true },
  { label: "Borda", detail: "Recebe o tráfego do domínio e encaminha às APIs.", groups: ["edge"], path: true },
  { label: "APIs de domínio", detail: "Regras de negócio, identidade e integrações.", groups: ["api"], path: true },
  { label: "Inteligência", detail: "Agentes de IA e o servidor MCP.", groups: ["ai"], path: true },
  { label: "Dados", detail: "Bancos e serviços de dados.", groups: ["data"], path: true },
  { label: "Operação de dados", detail: "Schema, seed, migração, grafo e análise.", groups: ["dataops"] },
  { label: "Infraestrutura", detail: "Cluster, implantação, observabilidade e testes.", groups: ["infra"] },
  { label: "Ambientes e distribuição", detail: "Onde cada repositório roda ou é publicado.", groups: ["environment"] },
  { label: "Serviços gerenciados", detail: "Provedores externos de que a plataforma depende.", groups: ["managed"] },
  { label: "Bibliotecas e padrões", detail: "Bibliotecas, molde de repositório e documentação.", groups: ["lib"] },
];

// Camadas em faixas: título e papel à esquerda, membros em grade à direita. As cinco primeiras seguem o
// caminho de uma requisição e são ligadas por setas; as demais formam a base de suporte.
function layersGraph() {
  const titleWidth = 250;
  const cardWidth = 220;
  const cardHeight = 92;
  const gap = 14;
  const perRow = 6;
  const width = titleWidth + perRow * (cardWidth + gap) + 24;
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let y = 0;
  layerOrder.forEach((layer, index) => {
    const members = services.nodes.filter((item) => layer.groups.includes(item.group));
    const rows = Math.max(1, Math.ceil(members.length / perRow));
    const height = 32 + rows * (cardHeight + gap);
    const color = groupColors[layer.groups[0]] ?? "#64748b";
    nodes.push(
      {
        id: `layer-${index}`,
        type: "band",
        position: { x: 0, y },
        data: { label: layer.label, detail: layer.detail, width, height, color },
        draggable: false,
        selectable: false,
        zIndex: -1,
      },
      {
        id: `layer-anchor-${index}`,
        type: "bandAnchor",
        position: { x: 120, y },
        data: { height },
        draggable: false,
        selectable: false,
      },
    );
    members.forEach((item, position) => {
      const named = item.group === "environment" || item.group === "managed" ? item.stack : item.id;
      nodes.push({
        id: `member-${item.id}`,
        type: "member",
        position: {
          x: titleWidth + (position % perRow) * (cardWidth + gap),
          y: y + 16 + Math.floor(position / perRow) * (cardHeight + gap),
        },
        data: { label: named, detail: item.role, icon: item.icon },
        draggable: false,
      });
    });
    if (layer.path && layerOrder[index + 1]?.path) {
      edges.push({
        id: `path-${index}`,
        source: `layer-anchor-${index}`,
        target: `layer-anchor-${index + 1}`,
        sourceHandle: "s-bottom",
        targetHandle: "t-top",
        type: "straight",
        markerEnd: { ...arrow, color: "#f97316" },
        style: { stroke: "#f97316", strokeWidth: 2 },
      });
    }
    y += height + 18;
  });
  return { nodes, edges };
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

function Canvas({ entry, locale }: Readonly<{ entry: DiagramEntry; locale: Locale }>) {
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

export default function DiagramView({ entry, locale }: Readonly<{ entry: DiagramEntry; locale: Locale }>) {
  return (
    <ReactFlowProvider key={entry.id}>
      <Canvas entry={entry} locale={locale} />
    </ReactFlowProvider>
  );
}
