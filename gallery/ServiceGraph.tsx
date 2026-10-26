import { useEffect, useMemo, useRef, useState } from "react";
import cytoscape, { type Core, type StylesheetJson } from "cytoscape";
import { Surface } from "@solaria.network/web-lib";
import { IconExternalLink } from "@tabler/icons-react";
import data from "./data/services.json";
import { labels, type Locale } from "./i18n";

type Kind = "http" | "data" | "a2a" | "jwks" | "lib" | "planned";

interface ServiceNode {
  id: string;
  group: string;
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

const nodes = data.nodes as ServiceNode[];
const edges = data.edges as ServiceEdge[];

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

const kindOrder: Kind[] = ["http", "data", "a2a", "jwks", "lib", "planned"];
const organization = "https://github.com/Solierrr";

function cssColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function stylesheet(): StylesheetJson {
  const ink = cssColor("--color-operational-ink", "#1f2937");
  const shell = cssColor("--color-operational-shell", "#ffffff");
  return [
    {
      selector: "node",
      style: {
        "background-color": (element) => groupColors[element.data("group")] ?? "#64748b",
        label: "data(id)",
        color: ink,
        "font-size": 11,
        "font-family": "Plus Jakarta Sans, sans-serif",
        "text-valign": "bottom",
        "text-margin-y": 4,
        "text-outline-color": shell,
        "text-outline-width": 2,
        width: 22,
        height: 22,
        "border-width": 2,
        "border-color": shell,
      },
    },
    { selector: 'node[group = "data"]', style: { shape: "barrel", width: 28, height: 22 } },
    { selector: 'node[group = "lib"]', style: { shape: "round-rectangle" } },
    {
      selector: "edge",
      style: {
        width: 1.5,
        "curve-style": "bezier",
        "target-arrow-shape": "triangle",
        "arrow-scale": 0.9,
        "line-color": (element) => kindColors[element.data("kind") as Kind],
        "target-arrow-color": (element) => kindColors[element.data("kind") as Kind],
        opacity: 0.75,
      },
    },
    { selector: 'edge[kind = "data"]', style: { "line-style": "dotted", width: 2 } },
    { selector: 'edge[kind = "a2a"]', style: { "line-style": "dashed", width: 3 } },
    { selector: 'edge[kind = "jwks"]', style: { "line-style": "dashed" } },
    { selector: 'edge[kind = "lib"]', style: { "line-style": "dotted", opacity: 0.5 } },
    { selector: 'edge[kind = "planned"]', style: { "line-style": "dashed", opacity: 0.5 } },
    { selector: ".dim", style: { opacity: 0.12 } },
    {
      selector: "edge.focus",
      style: {
        label: "data(label)",
        "font-size": 9,
        color: ink,
        "text-background-color": shell,
        "text-background-opacity": 0.9,
        "text-background-padding": "2px",
        opacity: 1,
        width: 2.5,
      },
    },
    { selector: "node:selected", style: { "border-color": ink, "border-width": 3 } },
    { selector: ".hidden", style: { display: "none" } },
  ];
}

export default function ServiceGraph({ locale }: { locale: Locale }) {
  const text = labels[locale];
  const container = useRef<HTMLDivElement>(null);
  const graph = useRef<Core | null>(null);
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
    const instance = cytoscape({
      container: container.current,
      elements: [
        ...nodes.map((node) => ({ data: { ...node } })),
        ...edges.map((edge, index) => ({ data: { id: `e${index}`, ...edge } })),
      ],
      style: stylesheet(),
      layout: {
        name: "cose",
        animate: false,
        nodeRepulsion: () => 90000,
        idealEdgeLength: () => 110,
        edgeElasticity: () => 80,
        gravity: 0.35,
        numIter: 1500,
        randomize: false,
        padding: 24,
      },
      minZoom: 0.2,
      maxZoom: 3,
      wheelSensitivity: 0.25,
    });
    instance.on("tap", "node", (event) => setSelectedId(event.target.id()));
    instance.on("tap", (event) => {
      if (event.target === instance) setSelectedId(null);
    });
    graph.current = instance;
    const observer = new ResizeObserver(() => {
      instance.resize();
      instance.fit(undefined, 24);
    });
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      instance.destroy();
      graph.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = graph.current;
    if (!instance) return;
    instance.batch(() => {
      instance.edges().forEach((edge) => {
        edge.toggleClass("hidden", !enabled[edge.data("kind") as Kind]);
      });
      instance.elements().removeClass("dim focus");
      instance.nodes().unselect();
      if (selectedId) {
        const node = instance.getElementById(selectedId);
        const visibleEdges = node.connectedEdges().not(".hidden");
        const neighborhood = visibleEdges.connectedNodes().union(node).union(visibleEdges);
        instance.elements().not(neighborhood).addClass("dim");
        visibleEdges.addClass("focus");
        node.select();
      }
    });
  }, [enabled, selectedId]);

  const selected = nodes.find((node) => node.id === selectedId);
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
          <button type="button" className="graph-reset" onClick={() => graph.current?.fit(undefined, 24)}>
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
            <p className="detail-name">{selected.id}</p>
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
