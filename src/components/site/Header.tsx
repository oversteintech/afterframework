import Link from "next/link";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import type { SearchLabels } from "@/components/search/SearchDialog";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { repo } from "@/content/framework";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { Dictionary } from "@/i18n/types";
import { LanguageSelect } from "./LanguageSelect";
import { MobileMenu } from "./MobileMenu";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function searchLabels(d: Dictionary): SearchLabels {
  return {
    search: d.docs.ui.search,
    placeholder: d.docs.ui.searchPlaceholder,
    empty: d.docs.ui.searchEmpty,
    emptyHint: d.docs.ui.searchEmptyHint,
    error: d.docs.ui.searchError,
    loading: d.docs.ui.searchLoading,
    results: d.docs.ui.searchResults,
    close: d.docs.ui.closeSearch,
    shortcut: d.docs.ui.searchShortcut,
  };
}

export function navItems(locale: Locale, d: Dictionary) {
  const home = localePath(locale);
  return [
    { href: `${home}#architecture`, label: d.nav.architecture },
    { href: `${home}#factory`, label: d.nav.factory },
    { href: `${home}#packages`, label: d.nav.packages },
    { href: `${home}#workflow`, label: d.nav.workflow },
    { href: `${home}#products`, label: d.nav.products },
    { href: localePath(locale, "/docs"), label: d.nav.docs },
  ];
}

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = navItems(locale, dict);
  const themeLabels = { label: dict.theme.label, system: dict.theme.system, light: dict.theme.light, dark: dict.theme.dark };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_oklab,var(--bg)_86%,transparent)] backdrop-blur-md">
      <div className="container-x flex h-16 items-center gap-4">
        <Link href={localePath(locale)} className="flex shrink-0 items-center gap-2.5 text-fg">
          <LogoMark />
          <span className="font-display text-[0.95rem] font-semibold tracking-tight" style={{ fontStretch: "112%" }}>
            After Framework
          </span>
        </Link>

        <nav aria-label={dict.a11y.primaryNav} className="hidden flex-1 xl:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-md px-2.5 py-2 text-sm text-muted transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <SearchTrigger locale={locale} labels={searchLabels(dict)} />
          <div className="hidden lg:block">
            <LanguageSelect locale={locale} label={dict.language.label} />
          </div>
          <div className="hidden lg:block">
            <ThemeSwitcher labels={themeLabels} />
          </div>
          <a
            href={repo.supercore}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted hover:text-fg sm:inline-flex"
          >
            <Icon name="github" size={17} />
            <span className="sr-only">
              {dict.cta.source} {dict.a11y.newTab}
            </span>
          </a>
          <MobileMenu
            items={items}
            labels={{ open: dict.a11y.openMenu, close: dict.a11y.closeMenu, nav: dict.a11y.primaryNav }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <LanguageSelect locale={locale} label={dict.language.label} />
              <ThemeSwitcher labels={themeLabels} />
            </div>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
