import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { links, repo } from "@/content/framework";
import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { localePath } from "@/i18n/paths";
import type { Dictionary } from "@/i18n/types";
import { navItems } from "./Header";

function External({ href, children, newTab }: { href: string; children: React.ReactNode; newTab: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
      {children}
      <span className="sr-only"> {newTab}</span>
    </a>
  );
}

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-bg-raised">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href={localePath(locale)} className="inline-flex items-center gap-2.5 text-fg">
            <LogoMark />
            <span className="font-semibold">After Framework</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{dict.footer.tagline}</p>
        </div>
        <nav aria-label={dict.a11y.footerNav}>
          <h2 className="text-sm font-semibold text-fg">{dict.footer.site}</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {navItems(locale, dict).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold text-fg">{dict.footer.ecosystem}</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><External href={links.afterArtificial} newTab={dict.a11y.newTab}>{dict.footer.afterArtificial}</External></li>
            <li><External href={links.overstein} newTab={dict.a11y.newTab}>{dict.footer.overstein}</External></li>
            <li><External href={links.founder} newTab={dict.a11y.newTab}>{dict.footer.founder}</External></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-fg">{dict.footer.source}</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><External href={repo.supercore} newTab={dict.a11y.newTab}><span className="font-mono">oversteintech/supercore</span></External></li>
            <li><External href={repo.site} newTab={dict.a11y.newTab}><span className="font-mono">oversteintech/afterframework</span></External></li>
            <li>
              <a href={`mailto:${links.email}`} className="hover:text-fg">
                {links.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-xs text-subtle sm:flex-row sm:justify-between">
        <p>{fmt(dict.footer.rights, { year })}</p>
        <p>{dict.footer.builtBy}</p>
      </div>
    </footer>
  );
}
