import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Surface } from "@solaria.network/web-lib";
import { IconExternalLink } from "@tabler/icons-react";
import data from "./data/repository.json";
import { labels, repository, type Locale } from "./i18n";

interface RepoNode {
  id: string;
  label: string;
  path: string;
  kind: "root" | "folder" | "file";
  column: number;
  y: number;
  files: number;
  folders: number;
  description: string;
  children: string[];
}

const items = data.nodes as RepoNode[];

const gapY = 64;
const parentOf = new Map<string, string>(data.edges.map((edge) => [edge.target, edge.source]));

function layout(expanded: Set<string>) {
  const visible: { item: RepoNode; y: number }[] = [];
  let cursor = 0;
  const top = items.filter((item) => item.column === 1);
  for (const item of top) {
    const children = expanded.has(item.id)
      ? items.filter((child) => parentOf.get(child.id) === item.id)
      : [];
    const span = Math.max(children.length, 1);
    visible.push({ item, y: cursor + ((span - 1) * gapY) / 2 });
    children.forEach((child, index) => visible.push({ item: child, y: cursor + index * gapY }));
    cursor += span * gapY;
  }
  visible.unshift({ item: items[0], y: (cursor - gapY) / 2 });
  return visible;
}

function Flow({ locale }: { locale: Locale }) {
  const text = labels[locale];
  const { fitView } = useReactFlow();
  const [selectedId, setSelectedId] = useState<string>(".");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const visible = useMemo(() => layout(expanded), [expanded]);

  useEffect(() => {
    const timer = setTimeout(() => void fitView({ padding: 0.15, duration: 300 }), 80);
    return () => clearTimeout(timer);
  }, [expanded, fitView]);

  const nodes = useMemo<Node[]>(
    () =>
      visible.map(({ item, y }) => ({
        id: item.id,
        position: { x: data.columnX[item.column], y },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          label: (
            <div className="repo-node-body">
              <span className="repo-node-name">{item.label}</span>
              {item.kind !== "file" && (
                <span className="repo-node-count">
                  {item.files} {text.filesUnit}
                </span>
              )}
            </div>
          ),
        },
        className: `repo-node repo-node-${item.kind}${item.id === selectedId ? " repo-node-selected" : ""}`,
        draggable: false,
      })),
    [visible, selectedId, text.filesUnit, expanded],
  );

  const edges = useMemo<Edge[]>(
    () =>
      data.edges
        .filter((edge) => visible.some(({ item }) => item.id === edge.target))
        .map((edge) => ({
        id: `${edge.source}->${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: edge.source === selectedId || edge.target === selectedId,
      })),
    [visible, selectedId],
  );

  const treeUrl = selected.path
    ? `${repository}/${selected.kind === "file" ? "blob" : "tree"}/main/${selected.path}`
    : repository;

  return (
    <div className="diagram-layout">
      <Surface className="diagram-canvas" contentClassName="diagram-canvas-content">
        <p className="diagram-hint">{text.repositoryHint}</p>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodesConnectable={false}
          nodesDraggable={false}
          minZoom={0.2}
          onNodeClick={(_, node) => {
            setSelectedId(node.id);
            const item = items.find((entry) => entry.id === node.id);
            if (!item || item.column !== 1 || item.folders === 0) return;
            setExpanded((current) => {
              const next = new Set(current);
              if (!next.delete(item.id)) next.add(item.id);
              return next;
            });
          }}
          proOptions={{ hideAttribution: true }}
          aria-label={text.repository}
        >
          <Background />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </Surface>
      <Surface className="diagram-details" contentClassName="diagram-details-content">
        <h2 className="detail-title">{text.details}</h2>
        <p className="detail-name">{selected.id === "." ? "docs-warehouse" : selected.path}</p>
        <p className="detail-text">{selected.description || text.empty}</p>
        <dl className="detail-list">
          <dt>{text.files}</dt>
          <dd>{selected.files}</dd>
          {selected.folders > 0 && (
            <>
              <dt>{text.folders}</dt>
              <dd>{selected.children.map((child) => `${child}/`).join("  ")}</dd>
            </>
          )}
        </dl>
        <a className="detail-link" href={treeUrl} target="_blank" rel="noopener noreferrer">
          <IconExternalLink size={16} aria-hidden="true" />
          {text.open}
        </a>
      </Surface>
    </div>
  );
}

export default function RepositoryFlow({ locale }: { locale: Locale }) {
  return (
    <ReactFlowProvider>
      <Flow locale={locale} />
    </ReactFlowProvider>
  );
}
