import { useEffect, useRef, useState } from "react";
import { Icon, MenuItem, MenuList } from "@solaria.network/web-lib";
import { languages, labels, type Locale } from "./i18n";

export function LanguageSwitcher({
  value,
  onChange,
}: {
  value: Locale;
  onChange: (locale: Locale) => void;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const label = labels[value].language;

  useEffect(() => {
    if (!open) return;
    const root = container.current;
    root?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
    function outside(event: PointerEvent) {
      if (!root?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={container} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-label={label}
        title={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="gallery-languages"
        className="flex h-9 cursor-pointer items-center-safe gap-1 rounded-small px-2 transition-colors hover:bg-operational-hover focus-visible:outline-2 focus-visible:outline-operational-ink disabled:opacity-40"
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name="globe" size={20} />
        <Icon
          name="chevronDown"
          size={20}
          className={`transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <MenuList
          id="gallery-languages"
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-50 mt-1 min-w-40"
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            event.preventDefault();
            const options = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>(
                '[role="option"]',
              ),
            );
            const current = options.indexOf(
              document.activeElement as HTMLElement,
            );
            options[
              (current + (event.key === "ArrowDown" ? 1 : options.length - 1)) %
                options.length
            ]?.focus();
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              role="option"
              selected={value === language.code}
              onSelect={() => {
                onChange(language.code);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              {language.label}
            </MenuItem>
          ))}
        </MenuList>
      )}
    </div>
  );
}
