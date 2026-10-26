import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GitHubIcon, GroupAction, Surface, SurfaceGroup } from "@solaria.network/web-lib";
import { IconFolders, IconTopologyStar3, type TablerIcon } from "@tabler/icons-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import RepositoryFlow from "./RepositoryFlow";
import ServiceGraph from "./ServiceGraph";
import { languages, labels, repository, type Locale } from "./i18n";

type View = "repository" | "services";

const views: { id: View; icon: TablerIcon }[] = [
  { id: "repository", icon: IconFolders },
  { id: "services", icon: IconTopologyStar3 },
];

const actionClass =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-small text-operational-ink transition-colors hover:bg-operational-hover focus-visible:outline-2 focus-visible:outline-operational-ink motion-reduce:transition-none";

export default function Gallery() {
  const { i18n } = useTranslation();
  const [hash, setHash] = useState(location.hash);
  const params = new URLSearchParams(hash.slice(1));
  const locale: Locale =
    languages.find((language) => language.code === params.get("locale"))?.code ?? "pt-BR";
  const view: View = views.find((item) => item.id === params.get("view"))?.id ?? "repository";
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

  function navigate(nextView: View, language: Locale) {
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
            {views.map((item) => {
              const Glyph = item.icon;
              return (
                <GroupAction
                  key={item.id}
                  label={text[item.id]}
                  content={text[item.id]}
                  glyph={<Glyph size={20} className="shrink-0" aria-hidden="true" />}
                  active={view === item.id}
                  onClick={() => navigate(item.id, locale)}
                />
              );
            })}
            <p className="p-4 text-sm text-operational-muted">{text.note}</p>
          </SurfaceGroup>
        </nav>
        <section className="diagram-area" aria-label={text[view]}>
          {view === "repository" ? <RepositoryFlow locale={locale} /> : <ServiceGraph locale={locale} />}
        </section>
      </main>
    </div>
  );
}
