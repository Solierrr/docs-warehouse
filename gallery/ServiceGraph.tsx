import { useEffect, useMemo, useRef, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from "d3-force";
import Sigma from "sigma";
import { extremityArrow, layerDashed, layerFill, pathCurved, sdfSquare } from "sigma/rendering";
import { layerImage } from "@sigma/node-image";
import { Checkbox, GroupAction, MenuList, Surface, SurfaceGroup } from "@solaria.network/web-lib";
import { IconExternalLink, IconFilter, IconFocusCentered, IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import graphLabels from "./data/graph-labels.json";
import data from "./data/services.json";
import stackData from "./data/stack.json";
import { labels, type Locale } from "./i18n";
import { groupColors } from "./palette";
import { monogramTile, nodeTile, stackIcon, svgUrl } from "./stackIcons";

type Kind =
  | "http"
  | "data"
  | "a2a"
  | "jwks"
  | "assets"
  | "observability"
  | "hosting"
  | "secrets"
  | "deploy"
  | "standards"
  | "lib"
  | "planned";

interface ServiceNode {
  id: string;
  group: string;
  icon: string;
  stack: string;
  role: string;
  repo: boolean;
}
interface ServiceEdge {
  source: string;
  target: string;
  kind: Kind;
  label: string;
}
interface StackItem {
  name: string;
  label: string;
}

const nodes = data.nodes as ServiceNode[];
const edges = data.edges as ServiceEdge[];
const stacks = stackData as Record<string, StackItem[]>;

const kindNames = graphLabels.kinds as Record<Locale, Record<Kind, string>>;

const groupNames = graphLabels.groups as Record<Locale, Record<string, string>>;


const kindColors: Record<Kind, string> = {
  http: "#64748b",
  data: "#16a34a",
  a2a: "#ec4899",
  jwks: "#8b5cf6",
  assets: "#0ea5e9",
  observability: "#f59e0b",
  hosting: "#14b8a6",
  secrets: "#ef4444",
  deploy: "#6366f1",
  standards: "#78716c",
  lib: "#a16207",
  planned: "#94a3b8",
};

// Espessura, traço e intervalo (em pixels) de cada tipo de relação. Intervalo zero desenha linha contínua.
const kindLines: Record<Kind, { size: number; dash: number; gap: number }> = {
  http: { size: 1.5, dash: 10, gap: 0 },
  data: { size: 2, dash: 2, gap: 3 },
  a2a: { size: 3, dash: 8, gap: 4 },
  jwks: { size: 1.5, dash: 6, gap: 4 },
  assets: { size: 1.5, dash: 4, gap: 3 },
  observability: { size: 1.5, dash: 3, gap: 3 },
  hosting: { size: 2.5, dash: 10, gap: 0 },
  secrets: { size: 2, dash: 8, gap: 3 },
  deploy: { size: 1.5, dash: 10, gap: 0 },
  standards: { size: 1, dash: 2, gap: 5 },
  lib: { size: 1.5, dash: 2, gap: 4 },
  planned: { size: 1.5, dash: 6, gap: 6 },
};

const kindOrder: Kind[] = [
  "http",
  "data",
  "a2a",
  "jwks",
  "assets",
  "observability",
  "hosting",
  "secrets",
  "deploy",
  "standards",
  "lib",
  "planned",
];
// Relações em grande número que não entram nas molas da física, para não puxar o desenho para um nó só.
const looseKinds = new Set<Kind>(["deploy", "standards", "lib"]);
const displayName = (node: ServiceNode) =>
  node.group === "environment" || node.group === "managed" ? node.stack : node.id;
const organization = "https://github.com/Solierrr";
// Região de cada grupo, em unidades do grafo (o eixo y cresce para cima): clientes e borda no alto,
// APIs e IA no meio, dados embaixo, ambientes e infraestrutura à direita, padrões à esquerda.
const groupAnchors: Record<string, [number, number]> = {
  client: [-180, 260],
  edge: [20, 260],
  api: [-60, 80],
  ai: [210, 110],
  lib: [-390, 70],
  data: [-40, -160],
  dataops: [-280, -160],
  managed: [200, -190],
  infra: [390, 80],
  environment: [410, -130],
};
const anchorOf = (group: string) => groupAnchors[group] ?? [0, 0];
const zoomStep = 1.5;
const nodeSize = 18;
const labelFamily = '"Plus Jakarta Sans", sans-serif';

interface SimulationNode extends SimulationNodeDatum {
  id: string;
  group: string;
}

// Física contínua, como no Obsidian: molas nas relações, repulsão entre serviços e colisão entre ícones.
function simulate(graph: MultiDirectedGraph) {
  const simulationNodes = graph.mapNodes(
    (id, attributes): SimulationNode => ({ id, group: attributes.group, x: attributes.x, y: attributes.y }),
  );
  const links = graph
    .filterEdges((_edge, attributes) => !looseKinds.has(attributes.kind as Kind))
    .map((edge) => ({ source: graph.source(edge), target: graph.target(edge) }));
  const byId = new Map(simulationNodes.map((node) => [node.id, node]));
  const apply = () =>
    graph.updateEachNodeAttributes(
      (id, attributes) => {
        const node = byId.get(id);
        return node ? { ...attributes, x: node.x, y: node.y } : attributes;
      },
      { attributes: ["x", "y"] },
    );
  const simulation = forceSimulation(simulationNodes)
    .force(
      "link",
      forceLink<SimulationNode, { source: string; target: string }>(links)
        .id((node) => node.id)
        .distance(55)
        .strength(0.12),
    )
    .force("charge", forceManyBody().strength(-110))
    .force("collide", forceCollide(nodeSize * 2.3))
    .force("x", forceX<SimulationNode>((node) => anchorOf(node.group)[0]).strength(0.14))
    .force("y", forceY<SimulationNode>((node) => anchorOf(node.group)[1]).strength(0.14))
    .stop();
  // Assenta antes do primeiro desenho, para o enquadramento inicial já pegar o formato final.
  simulation.tick(300);
  apply();
  simulation.on("tick", apply);
  return { simulation, byId };
}

// Ícones da linha do README, sem repetir o mesmo desenho (os recursos do Kubernetes usam o mesmo logo).
function stackRow(id: string) {
  const seen = new Set<string>();
  return (stacks[id] ?? []).flatMap((item) => {
    const icon = stackIcon(item.name);
    if (!icon || seen.has(icon.svg)) return [];
    seen.add(icon.svg);
    return [{ ...item, svg: icon.svg }];
  });
}

function cssColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function buildGraph() {
  const graph = new MultiDirectedGraph();
  const perGroup: Record<string, number> = {};
  nodes.forEach((node) => {
    // Espiral em volta da âncora do grupo, como ponto de partida da física.
    const slot = (perGroup[node.group] = (perGroup[node.group] ?? 0) + 1);
    const [ax, ay] = anchorOf(node.group);
    const angle = slot * 2.4;
    const radius = 22 * Math.sqrt(slot);
    graph.addNode(node.id, {
      label: displayName(node),
      group: node.group,
      x: ax + Math.cos(angle) * radius,
      y: ay + Math.sin(angle) * radius,
      size: nodeSize,
      color: groupColors[node.group] ?? "#64748b",
      image: "",
    });
  });
  edges.forEach((edge, index) => {
    graph.addDirectedEdgeWithKey(`e${index}`, edge.source, edge.target, {
      kind: edge.kind,
      label: edge.label,
      color: kindColors[edge.kind],
      ...kindLines[edge.kind],
      hidden: false,
    });
  });
  return graph;
}

export default function ServiceGraph({ locale }: { locale: Locale }) {
  const text = labels[locale];
  const container = useRef<HTMLDivElement>(null);
  const renderer = useRef<Sigma | null>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState<Record<Kind, boolean>>({
    http: true,
    data: true,
    a2a: true,
    jwks: true,
    assets: true,
    observability: true,
    hosting: true,
    secrets: true,
    deploy: false,
    standards: false,
    lib: false,
    planned: true,
  });

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    // O Sigma monta o atlas de glifos no primeiro desenho; espera a fonte da lib para não cair na fonte de reserva.
    void document.fonts
      .load(`600 12px ${labelFamily}`)
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        dispose = mount(element);
        setReady(true);
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  function mount(element: HTMLDivElement) {
    const ink = cssColor("--color-operational-ink", "#1f2937");
    const shell = cssColor("--color-operational-shell", "#ffffff");
    const graph = buildGraph();
    const { simulation, byId } = simulate(graph);
    const instance = new Sigma(graph, element, {
      primitives: {
        nodes: {
          shapes: [sdfSquare({ cornerRadius: 0.32 })],
          variables: { image: { type: "string", default: "" } },
          layers: [layerFill(), layerImage({ drawingMode: "image", padding: 0.1 })],
        },
        edges: {
          paths: [pathCurved()],
          extremities: [extremityArrow()],
          variables: {
            dash: { type: "number", default: 10 },
            gap: { type: "number", default: 0 },
          },
          layers: [
            layerDashed({
              dashSize: { attribute: "dash", mode: "pixels" },
              gapSize: { attribute: "gap", mode: "pixels" },
            }),
          ],
        },
      },
      styles: {
        nodes: [
          {
            x: { attribute: "x" },
            y: { attribute: "y" },
            size: { whenState: "isHovered", then: (attributes) => attributes.size * 1.15, else: { attribute: "size" } },
            color: { attribute: "color" },
            image: { attribute: "image" },
            label: { attribute: "label" },
            labelColor: ink,
            labelSize: 12,
            labelFont: `600 ${labelFamily}`,
            labelPosition: "below",
            labelBackgroundColor: shell,
            labelBackgroundPadding: 2,
            cursor: (_attributes, state) => (state.isDragged ? "grabbing" : "grab"),
            depth: { whenState: "isHovered", then: "topNodes", else: "nodes" },
          },
          {
            when: (_attributes, state, graphState) => graphState.hasHighlighted && !state.isHighlighted,
            then: { opacity: 0.15, labelVisibility: "hidden" },
          },
          {
            when: (_attributes, state, graphState) => graphState.hasHighlighted && state.isHighlighted,
            then: { depth: "topNodes", labelVisibility: "visible" },
          },
        ],
        edges: [
          {
            color: { attribute: "color" },
            size: { attribute: "size" },
            dash: { attribute: "dash" },
            gap: { attribute: "gap" },
            head: "arrow",
            opacity: 0.7,
            visibility: { whenData: { hidden: true }, then: "hidden", else: "visible" },
          },
          {
            when: (_attributes, state, graphState) => graphState.hasHighlighted && !state.isHighlighted,
            then: { opacity: 0.06 },
          },
          {
            when: (_attributes, state, graphState) => graphState.hasHighlighted && state.isHighlighted,
            then: { opacity: 1, depth: "topEdges" },
          },
        ],
        stage: {
          cursor: (graphState) => (graphState.isPanning || graphState.isDragging ? "grabbing" : "grab"),
        },
      },
      settings: {
        enableNodeDrag: true,
        labelDensity: 1,
        autoRescale: "once",
        autoRescaleContent: "labels",
        stagePadding: 40,
        minCameraRatio: 0.2,
        maxCameraRatio: 3,
      },
    });
    instance.on("clickNode", ({ node }) => setSelectedId(node));
    instance.on("clickStage", () => setSelectedId(null));
    instance.on("enterNode", ({ node }) => setHoveredId(node));
    instance.on("leaveNode", () => setHoveredId(null));
    renderer.current = instance;
    // O painel de detalhes entra e sai do layout, então o canvas muda de largura sem a janela mudar.
    const resize = new ResizeObserver(() => instance.resize());
    resize.observe(element);

    // Um empurrão leve na entrada, para o grafo chegar se acomodando.
    simulation.alpha(0.15).restart();
    instance.on("nodeDragStart", ({ node }) => {
      const dragged = byId.get(node);
      if (dragged) [dragged.fx, dragged.fy] = [dragged.x, dragged.y];
      simulation.alphaTarget(0.3).restart();
    });
    instance.on("nodeDrag", ({ node }) => {
      const dragged = byId.get(node);
      if (dragged) [dragged.fx, dragged.fy] = [graph.getNodeAttribute(node, "x"), graph.getNodeAttribute(node, "y")];
    });
    instance.on("nodeDragEnd", ({ node }) => {
      const dragged = byId.get(node);
      if (dragged) [dragged.fx, dragged.fy] = [null, null];
      simulation.alphaTarget(0);
    });

    let active = true;
    void Promise.all(
      nodes.map(async (node) => {
        const icon = stackIcon(node.icon);
        return [node.id, icon ? await nodeTile(icon.svg) : monogramTile(displayName(node))] as const;
      }),
    ).then((entries) => {
      if (!active) return;
      entries.forEach(([id, tile]) => graph.setNodeAttribute(id, "image", tile));
    });

    return () => {
      active = false;
      resize.disconnect();
      simulation.stop();
      instance.kill();
      renderer.current = null;
    };
  }

  useEffect(() => {
    const instance = renderer.current;
    if (!instance) return;
    const graph = instance.getGraph();
    graph.forEachEdge((edge, attributes) => {
      graph.setEdgeAttribute(edge, "hidden", !enabled[attributes.kind as Kind]);
    });
    const focus = selectedId ?? hoveredId;
    const visibleEdges = focus
      ? graph.edges(focus).filter((edge) => !graph.getEdgeAttribute(edge, "hidden"))
      : [];
    const neighborhood = new Set(focus ? [focus] : []);
    visibleEdges.forEach((edge) => graph.extremities(edge).forEach((node) => neighborhood.add(node)));
    instance.setNodesState(graph.nodes(), { isHighlighted: false });
    instance.setEdgesState(graph.edges(), { isHighlighted: false });
    instance.setNodesState([...neighborhood], { isHighlighted: true });
    instance.setEdgesState(visibleEdges, { isHighlighted: true });
    instance.setGraphState({ hasHighlighted: focus !== null });
  }, [enabled, selectedId, hoveredId, ready]);

  useEffect(() => {
    if (!filtersOpen) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !toolbar.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [filtersOpen]);

  const selected = nodes.find((node) => node.id === selectedId);
  const selectedIcon = selected ? stackIcon(selected.icon) : undefined;
  const selectedRow = selected ? stackRow(selected.id) : [];

  function zoom(factor: number) {
    const camera = renderer.current?.getCamera();
    if (camera) void camera.animate({ ratio: camera.getState().ratio * factor }, { duration: 250 });
  }
  const relations = useMemo(() => {
    if (!selected) return { outgoing: [], incoming: [] };
    return {
      outgoing: edges.filter((edge) => edge.source === selected.id && enabled[edge.kind]),
      incoming: edges.filter((edge) => edge.target === selected.id && enabled[edge.kind]),
    };
  }, [selected, enabled]);

  function relationItem(edge: ServiceEdge, other: string) {
    return (
      <li key={`${edge.source}-${edge.target}-${edge.kind}`}>
        <button type="button" className="relation-link" onClick={() => setSelectedId(other)}>
          {other}
        </button>
        <span className="relation-kind" style={{ color: kindColors[edge.kind] }}>
          {kindNames[locale][edge.kind]}
          {edge.label ? ` · ${edge.label}` : ""}
        </span>
      </li>
    );
  }

  return (
    <div className={`diagram-layout${selected ? "" : " diagram-layout-single"}`}>
      <Surface className="diagram-canvas" contentClassName="diagram-canvas-content">
        <div className="graph-toolbar" ref={toolbar}>
          <SurfaceGroup
            direction="horizontal"
            divided={false}
            role="toolbar"
            aria-label={text.services}
            className="shrink-0"
          >
            <GroupAction
              layout="icon"
              label={text.filters}
              glyph={<IconFilter size={22} className="shrink-0" aria-hidden="true" />}
              active={filtersOpen}
              aria-expanded={filtersOpen}
              aria-haspopup="true"
              onClick={() => setFiltersOpen((open) => !open)}
            />
            <GroupAction
              layout="icon"
              label={text.zoomIn}
              glyph={<IconZoomIn size={22} className="shrink-0" aria-hidden="true" />}
              onClick={() => zoom(1 / zoomStep)}
            />
            <GroupAction
              layout="icon"
              label={text.zoomOut}
              glyph={<IconZoomOut size={22} className="shrink-0" aria-hidden="true" />}
              onClick={() => zoom(zoomStep)}
            />
            <GroupAction
              layout="icon"
              label={text.reset}
              glyph={<IconFocusCentered size={22} className="shrink-0" aria-hidden="true" />}
              onClick={() => renderer.current?.getCamera().animate({ x: 0.5, y: 0.5, ratio: 1, angle: 0 })}
            />
          </SurfaceGroup>
          {filtersOpen && (
            <MenuList className="graph-filter-menu" role="group" aria-label={text.filters}>
              {kindOrder.map((kind) => (
                <li key={kind} className="graph-filter-item">
                  <span className="graph-swatch" style={{ background: kindColors[kind] }} aria-hidden="true" />
                  <Checkbox
                    label={kindNames[locale][kind]}
                    checked={enabled[kind]}
                    onChange={(event) => setEnabled((current) => ({ ...current, [kind]: event.target.checked }))}
                  />
                </li>
              ))}
            </MenuList>
          )}
        </div>
        <div ref={container} className="graph-canvas" role="img" aria-label={text.services} />
      </Surface>
      {selected && (
        <Surface className="diagram-details" contentClassName="diagram-details-content">
          <h2 className="detail-title">{text.details}</h2>
          <div className="detail-heading">
            <span className="detail-icon">
              {selectedIcon ? (
                <img src={svgUrl(selectedIcon.svg, 96)} alt={selectedIcon.title} title={selectedIcon.title} />
              ) : (
                <img src={monogramTile(displayName(selected), 96)} alt="" />
              )}
            </span>
            <p className="detail-name">{displayName(selected)}</p>
          </div>
          {selectedRow.length > 0 && (
            <ul className="detail-stacks" aria-label={text.stack}>
              {selectedRow.map((item) => (
                <li key={item.name}>
                  <img src={svgUrl(item.svg, 64)} alt={item.label} title={item.label} />
                </li>
              ))}
            </ul>
          )}
          <p className="detail-text">{selected.role}</p>
          <dl className="detail-list">
            <dt>{text.group}</dt>
            <dd>{groupNames[locale][selected.group]}</dd>
            <dt>{text.stack}</dt>
            <dd>{selected.stack}</dd>
          </dl>
          {relations.outgoing.length > 0 && (
            <>
              <h3 className="detail-subtitle">{text.outgoing}</h3>
              <ul className="relation-list">{relations.outgoing.map((edge) => relationItem(edge, edge.target))}</ul>
            </>
          )}
          {relations.incoming.length > 0 && (
            <>
              <h3 className="detail-subtitle">{text.incoming}</h3>
              <ul className="relation-list">{relations.incoming.map((edge) => relationItem(edge, edge.source))}</ul>
            </>
          )}
          {selected.repo ? (
            <a
              className="detail-link"
              href={`${organization}/${selected.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconExternalLink size={16} aria-hidden="true" />
              {text.open}
            </a>
          ) : (
            <p className="detail-text">{text.notInOrg}</p>
          )}
        </Surface>
      )}
    </div>
  );
}
