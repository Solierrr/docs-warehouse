import { useEffect, useMemo, useRef, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import noverlap from "graphology-layout-noverlap";
import Sigma from "sigma";
import { extremityArrow, layerDashed, layerFill, pathCurved, sdfSquare } from "sigma/rendering";
import { layerImage } from "@sigma/node-image";
import { Surface } from "@solaria.network/web-lib";
import { IconExternalLink } from "@tabler/icons-react";
import data from "./data/services.json";
import stackData from "./data/stack.json";
import { labels, type Locale } from "./i18n";

type Kind = "http" | "data" | "a2a" | "jwks" | "lib" | "planned";

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
interface StackImage {
  name: string;
  label: string;
}
interface ServiceStack {
  banner: StackImage | null;
  stacks: StackImage[];
}

const nodes = data.nodes as ServiceNode[];
const edges = data.edges as ServiceEdge[];
const stacks = stackData as Record<string, ServiceStack>;

const kindNames: Record<Locale, Record<Kind, string>> = {
  "pt-BR": { http: "HTTP", data: "Banco ou serviço de dados", a2a: "A2A entre agentes", jwks: "Validação de JWT (JWKS)", lib: "Biblioteca", planned: "Planejada" },
  "en-US": { http: "HTTP", data: "Database or data service", a2a: "Agent-to-agent (A2A)", jwks: "JWT validation (JWKS)", lib: "Library", planned: "Planned" },
  "es-ES": { http: "HTTP", data: "Base o servicio de datos", a2a: "A2A entre agentes", jwks: "Validación de JWT (JWKS)", lib: "Biblioteca", planned: "Planificada" },
};

const groupNames: Record<Locale, Record<string, string>> = {
  "pt-BR": { client: "Cliente", edge: "Borda", api: "API", ai: "IA", data: "Dados", dataops: "Operação de dados", infra: "Infraestrutura", lib: "Biblioteca e documentação" },
  "en-US": { client: "Client", edge: "Edge", api: "API", ai: "AI", data: "Data", dataops: "Data operations", infra: "Infrastructure", lib: "Library and documentation" },
  "es-ES": { client: "Cliente", edge: "Borde", api: "API", ai: "IA", data: "Datos", dataops: "Operación de datos", infra: "Infraestructura", lib: "Biblioteca y documentación" },
};

const groupColors: Record<string, string> = {
  client: "#3b82f6",
  edge: "#06b6d4",
  api: "#8b5cf6",
  ai: "#ec4899",
  data: "#16a34a",
  dataops: "#ca8a04",
  infra: "#64748b",
  lib: "#a16207",
};

const kindColors: Record<Kind, string> = {
  http: "#64748b",
  data: "#16a34a",
  a2a: "#ec4899",
  jwks: "#8b5cf6",
  lib: "#a16207",
  planned: "#94a3b8",
};

// Espessura, traço e intervalo (em pixels) de cada tipo de relação. Intervalo zero desenha linha contínua.
const kindLines: Record<Kind, { size: number; dash: number; gap: number }> = {
  http: { size: 1.5, dash: 10, gap: 0 },
  data: { size: 2, dash: 2, gap: 3 },
  a2a: { size: 3, dash: 8, gap: 4 },
  jwks: { size: 1.5, dash: 6, gap: 4 },
  lib: { size: 1.5, dash: 2, gap: 4 },
  planned: { size: 1.5, dash: 6, gap: 6 },
};

const kindOrder: Kind[] = ["http", "data", "a2a", "jwks", "lib", "planned"];
const organization = "https://github.com/Solierrr";
const groupOrder = Object.keys(groupColors);
const asset = (folder: "banners" | "stacks", name: string) => `${import.meta.env.BASE_URL}stack/${folder}/${name}.png`;

function cssColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function buildGraph() {
  const graph = new MultiDirectedGraph();
  const perGroup: Record<string, number> = {};
  nodes.forEach((node) => {
    const slot = (perGroup[node.group] = (perGroup[node.group] ?? 0) + 1);
    const angle = (groupOrder.indexOf(node.group) / groupOrder.length) * 2 * Math.PI + slot * 0.18;
    const radius = 10 + slot * 2;
    graph.addNode(node.id, {
      label: node.id,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      color: groupColors[node.group] ?? "#64748b",
      image: asset("stacks", node.icon),
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
  forceAtlas2.assign(graph, {
    iterations: 800,
    settings: { ...forceAtlas2.inferSettings(graph), scalingRatio: 40, gravity: 1, outboundAttractionDistribution: true },
  });
  // Tamanhos em unidades do grafo, proporcionais à extensão do desenho, para que o zoom
  // escale ícones e linhas juntos e o noverlap afaste os ícones que ainda se sobrepõem.
  const xs = graph.mapNodes((_node, attributes) => attributes.x as number);
  const ys = graph.mapNodes((_node, attributes) => attributes.y as number);
  const unit = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 600;
  graph.updateEachNodeAttributes((_node, attributes) => ({ ...attributes, size: 18 * unit }));
  graph.updateEachEdgeAttributes((_edge, attributes) => ({ ...attributes, size: attributes.size * unit }));
  noverlap.assign(graph, { maxIterations: 300, settings: { margin: 18 * unit, ratio: 1 } });
  return graph;
}

export default function ServiceGraph({ locale }: { locale: Locale }) {
  const text = labels[locale];
  const container = useRef<HTMLDivElement>(null);
  const renderer = useRef<Sigma | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<Record<Kind, boolean>>({
    http: true,
    data: true,
    a2a: true,
    jwks: true,
    lib: false,
    planned: true,
  });

  useEffect(() => {
    if (!container.current) return;
    const ink = cssColor("--color-operational-ink", "#1f2937");
    const shell = cssColor("--color-operational-shell", "#ffffff");
    const graph = buildGraph();
    const instance = new Sigma(graph, container.current, {
      primitives: {
        nodes: {
          shapes: [sdfSquare({ cornerRadius: 0.32 })],
          variables: { image: { type: "string", default: "" } },
          layers: [layerFill(), layerImage({ drawingMode: "image", padding: 0.06 })],
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
            labelFont: "Plus Jakarta Sans, sans-serif",
            labelPosition: "below",
            labelBackgroundColor: shell,
            labelBackgroundPadding: 2,
            cursor: "pointer",
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
      },
      settings: {
        enableNodeDrag: true,
        labelDensity: 2,
        autoRescaleContent: "labels",
        stagePadding: 40,
        minCameraRatio: 0.2,
        maxCameraRatio: 3,
      },
    });
    instance.on("clickNode", ({ node }) => setSelectedId(node));
    instance.on("clickStage", () => setSelectedId(null));
    renderer.current = instance;
    return () => {
      instance.kill();
      renderer.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = renderer.current;
    if (!instance) return;
    const graph = instance.getGraph();
    graph.forEachEdge((edge, attributes) => {
      graph.setEdgeAttribute(edge, "hidden", !enabled[attributes.kind as Kind]);
    });
    const visibleEdges = selectedId
      ? graph.edges(selectedId).filter((edge) => !graph.getEdgeAttribute(edge, "hidden"))
      : [];
    const neighborhood = new Set(selectedId ? [selectedId] : []);
    visibleEdges.forEach((edge) => graph.extremities(edge).forEach((node) => neighborhood.add(node)));
    instance.setNodesState(graph.nodes(), { isHighlighted: false });
    instance.setEdgesState(graph.edges(), { isHighlighted: false });
    instance.setNodesState([...neighborhood], { isHighlighted: true });
    instance.setEdgesState(visibleEdges, { isHighlighted: true });
    instance.setGraphState({ hasHighlighted: selectedId !== null });
  }, [enabled, selectedId]);

  const selected = nodes.find((node) => node.id === selectedId);
  const selectedStack = selected ? stacks[selected.id] : undefined;
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
    <div className="diagram-layout">
      <Surface className="diagram-canvas" contentClassName="diagram-canvas-content">
        <p className="diagram-hint">{text.servicesHint}</p>
        <div className="graph-filters" role="group" aria-label={text.filters}>
          {kindOrder.map((kind) => (
            <label key={kind} className="graph-filter">
              <input
                type="checkbox"
                checked={enabled[kind]}
                onChange={(event) => setEnabled((current) => ({ ...current, [kind]: event.target.checked }))}
              />
              <span className="graph-swatch" style={{ background: kindColors[kind] }} aria-hidden="true" />
              {kindNames[locale][kind]}
            </label>
          ))}
          <button
            type="button"
            className="graph-reset"
            onClick={() => renderer.current?.getCamera().animate({ x: 0.5, y: 0.5, ratio: 1, angle: 0 })}
          >
            {text.reset}
          </button>
        </div>
        <div ref={container} className="graph-canvas" role="img" aria-label={text.services} />
        <ul className="graph-legend">
          {Object.entries(groupColors).map(([group, color]) => (
            <li key={group}>
              <span className="graph-swatch" style={{ background: color }} aria-hidden="true" />
              {groupNames[locale][group]}
            </li>
          ))}
        </ul>
      </Surface>
      <Surface className="diagram-details" contentClassName="diagram-details-content">
        <h2 className="detail-title">{text.details}</h2>
        {selected ? (
          <>
            {selectedStack?.banner ? (
              <img
                className="detail-banner"
                src={asset("banners", selectedStack.banner.name)}
                alt={selectedStack.banner.label}
              />
            ) : (
              <img className="detail-icon" src={asset("stacks", selected.icon)} alt="" />
            )}
            <p className="detail-name">{selected.id}</p>
            {selectedStack && selectedStack.stacks.length > 0 && (
              <ul className="detail-stacks" aria-label={text.stack}>
                {selectedStack.stacks.map((item) => (
                  <li key={item.name}>
                    <img src={asset("stacks", item.name)} alt={item.label} title={item.label} />
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
              <a className="detail-link" href={`${organization}/${selected.id}`} target="_blank" rel="noopener noreferrer">
                <IconExternalLink size={16} aria-hidden="true" />
                {text.open}
              </a>
            ) : (
              <p className="detail-text">{text.notInOrg}</p>
            )}
          </>
        ) : (
          <p className="detail-text">{text.empty}</p>
        )}
      </Surface>
    </div>
  );
}
