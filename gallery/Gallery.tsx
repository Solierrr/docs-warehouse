import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GitHubIcon, GroupAction, Surface, SurfaceGroup } from "@solaria.network/web-lib";
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
import { LanguageSwitcher } from "./LanguageSwitcher";
import RepositoryFlow from "./RepositoryFlow";
import ServiceGraph from "./ServiceGraph";
import { languages, labels, repository, type Labels, type Locale } from "./i18n";

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

const views: View[] = [
  { id: "repository", section: "repositoryGroup", icon: IconFolders },
  ...diagrams
    .filter((entry) => entry.group === "architecture")
    .map((entry) => ({ id: entry.id, section: entry.group, icon: entry.id === "layers" ? IconStack2 : groupIcons.architecture })),
  { id: "services", section: "architecture", icon: IconTopologyStar3 },
  ...diagrams
    .filter((entry) => entry.group !== "architecture")
    .map((entry) => ({ id: entry.id, section: entry.group, icon: groupIcons[entry.group] })),
];

const sections: Section[] = ["repositoryGroup", "architecture", "sequence", "flow", "usecase"];

function viewLabel(id: string, text: Labels) {
  if (id === "repository" || id === "services") return text[id];
  return diagrams.find((entry) => entry.id === id)?.title ?? id;
}

const actionClass =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-small text-operational-ink transition-colors hover:bg-operational-hover focus-visible:outline-2 focus-visible:outline-operational-ink motion-reduce:transition-none";

export default function Gallery() {
  const { i18n } = useTranslation();
  const [hash, setHash] = useState(location.hash);
  const params = new URLSearchParams(hash.slice(1));
  const locale: Locale =
    languages.find((language) => language.code === params.get("locale"))?.code ?? "pt-BR";
  const view = views.find((item) => item.id === params.get("view"))?.id ?? "repository";
  const entry = diagrams.find((item) => item.id === view);
  const text = labels[locale];

  useEffect(() => {
    const changed = () => setHash(location.hash);
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
  }, [i18n, locale]);

  let content = <ServiceGraph locale={locale} />;
  if (entry) content = <DiagramView entry={entry} locale={locale} />;
  else if (view === "repository") content = <RepositoryFlow locale={locale} />;

  function navigate(nextView: string, language: Locale) {
    location.hash = new URLSearchParams({ view: nextView, locale: language }).toString();
  }

  return (
    <div className="gallery-shell flex h-dvh min-h-0 flex-col bg-operational-shell">
      <header className="navbar-frame z-30 w-full justify-between gap-2 bg-operational-shell!">
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <a
            href={repository}
            aria-label={text.github}
            title="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className={actionClass}
          >
            <GitHubIcon size={20} />
          </a>
          <LanguageSwitcher value={locale} onChange={(language) => navigate(view, language)} />
        </div>
      </header>
      <main className="gallery-workspace gallery-workspace-wide">
        <nav aria-label={text.views} className="flex min-h-0 min-w-0 items-start">
          <SurfaceGroup className="gallery-templates" contentClassName="gallery-template-list scrollbar-none">
            {sections.map((section) => (
              <section key={section} aria-label={text[section]} className="gallery-section">
                <p className="gallery-section-title">{text[section]}</p>
                {views
                  .filter((item) => item.section === section)
                  .map((item) => {
                    const Glyph = item.icon;
                    const label = viewLabel(item.id, text);
                    return (
                      <GroupAction
                        key={item.id}
                        label={label}
                        content={label}
                        glyph={<Glyph size={20} className="shrink-0" aria-hidden="true" />}
                        active={view === item.id}
                        onClick={() => navigate(item.id, locale)}
                      />
                    );
                  })}
              </section>
            ))}
            <p className="p-4 text-sm text-operational-muted">{text.note}</p>
          </SurfaceGroup>
        </nav>
        <section className="diagram-area" aria-label={viewLabel(view, text)}>
          {content}
        </section>
      </main>
    </div>
  );
}
