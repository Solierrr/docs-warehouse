import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  GalleryShell,
  useGallery,
  type GalleryLocale,
  type GallerySection,
} from "@solaria.network/web-lib/gallery";
import {
  IconArrowsExchange,
  IconFolders,
  IconRoute,
  IconStack2,
  IconTopologyStar3,
  IconUsers,
  IconWorld,
  type TablerIcon,
} from "@tabler/icons-react";
import DiagramView from "./DiagramView";
import { diagrams, type DiagramGroup } from "./diagrams";
import RepositoryFlow from "./RepositoryFlow";
import ServiceGraph from "./ServiceGraph";
import { labels } from "./i18n";

type Section = "repositoryGroup" | DiagramGroup;

interface View {
  id: string;
  section: Section;
  icon: TablerIcon;
}

const groupIcons: Record<DiagramGroup, TablerIcon> = {
  architecture: IconWorld,
  sequence: IconArrowsExchange,
  flow: IconRoute,
  usecase: IconUsers,
};

const sectionTitles: Record<Section, Record<GalleryLocale, string>> = {
  architecture: { "pt-BR": "Arquitetura", "en-US": "Architecture", "es-ES": "Arquitectura" },
  repositoryGroup: { "pt-BR": "Repositório", "en-US": "Repository", "es-ES": "Repositorio" },
  usecase: { "pt-BR": "Casos de uso", "en-US": "Use cases", "es-ES": "Casos de uso" },
  flow: { "pt-BR": "Fluxos", "en-US": "Flows", "es-ES": "Flujos" },
  sequence: { "pt-BR": "Sequências", "en-US": "Sequences", "es-ES": "Secuencias" },
};

const diagramViews = (group: DiagramGroup): View[] =>
  diagrams
    .filter((entry) => entry.group === group)
    .map((entry) => ({ id: entry.id, section: group, icon: entry.id === "layers" ? IconStack2 : groupIcons[group] }));

// Do geral para o detalhe: visão da plataforma, organização do código, quem faz o quê, os processos e,
// por fim, as trocas de mensagens entre serviços.
const views: View[] = [
  ...diagramViews("architecture"),
  { id: "services", section: "architecture", icon: IconTopologyStar3 },
  { id: "repository", section: "repositoryGroup", icon: IconFolders },
  ...diagramViews("usecase"),
  ...diagramViews("flow"),
  ...diagramViews("sequence"),
];

const locales: GalleryLocale[] = ["pt-BR", "en-US", "es-ES"];

function viewLabel(id: string): Record<GalleryLocale, string> {
  if (id === "repository" || id === "services") {
    return Object.fromEntries(locales.map((code) => [code, labels[code][id]])) as Record<GalleryLocale, string>;
  }
  const title = diagrams.find((entry) => entry.id === id)?.title ?? id;
  return { "pt-BR": title, "en-US": title, "es-ES": title };
}

const sections: GallerySection[] = views.reduce<GallerySection[]>((groups, view) => {
  const item = {
    id: view.id,
    label: viewLabel(view.id),
    icon: <view.icon size={20} className="shrink-0" aria-hidden="true" />,
  };
  const last = groups[groups.length - 1];
  if (last?.id === view.section) last.items.push(item);
  else groups.push({ id: view.section, title: sectionTitles[view.section], items: [item] });
  return groups;
}, []);

function Viewer({ view }: Readonly<{ view: string }>) {
  const { locale } = useGallery();
  const { i18n } = useTranslation();
  const entry = diagrams.find((item) => item.id === view);
  const text = labels[locale];

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [i18n, locale]);

  let content = <ServiceGraph locale={locale} />;
  if (entry) content = <DiagramView entry={entry} locale={locale} />;
  else if (view === "repository") content = <RepositoryFlow locale={locale} />;

  return (
    <div className="gallery-workspace">
      {locale === "pt-BR" ? null : <p className="gallery-note">{text.note}</p>}
      <section className="diagram-area" aria-label={viewLabel(view)[locale]}>
        {content}
      </section>
    </div>
  );
}

export default function Gallery() {
  const [hash, setHash] = useState(location.hash);
  const view = views.find((item) => item.id === new URLSearchParams(hash.slice(1)).get("view"))?.id ?? views[0].id;

  useEffect(() => {
    const changed = () => setHash(location.hash);
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);

  return (
    <GalleryShell
      title={{
        "pt-BR": "Previews da arquitetura",
        "en-US": "Architecture previews",
        "es-ES": "Vistas previas de la arquitectura",
      }}
      repository="docs-warehouse"
      version={import.meta.env.VITE_VERSION}
      commit={import.meta.env.VITE_COMMIT}
      sections={sections}
      selectedId={view}
      onSelect={(id) => {
        location.hash = new URLSearchParams({ view: id }).toString();
      }}
    >
      <Viewer view={view} />
    </GalleryShell>
  );
}
