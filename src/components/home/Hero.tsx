import Link from "next/link";
import { DependencyGraph } from "@/components/graph/DependencyGraph";
import { Icon, type IconName } from "@/components/ui/Icon";
import { dirFor, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { Dictionary } from "@/i18n/types";
import { HeroVideo } from "./HeroVideo";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.hero;
  const quick: { href: string; label: string; icon: IconName }[] = [
    { href: localePath(locale, "/docs"), label: h.quickDocs, icon: "book" },
    { href: localePath(locale, "/docs/packages"), label: h.quickPackages, icon: "package" },
    { href: localePath(locale, "/docs/tooling"), label: h.quickCli, icon: "terminal" },
    { href: localePath(locale, "/docs/product-factory"), label: h.quickFactory, icon: "factory" },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <HeroVideo />
        <div className="hero-video-scrim absolute inset-0" />
      </div>
      <div className="blueprint fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative grid items-center gap-12 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-24 lg:pb-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-md border border-[var(--accent-line)] bg-accent-soft px-3 py-1.5 text-sm font-medium text-fg">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {h.strap}
          </p>
          <h1 id="hero-title" className="display mt-6 text-[2.6rem] sm:text-6xl lg:text-[4.25rem]">
            {h.title}
          </h1>
          <p className="lead mt-6 max-w-xl">{h.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`${localePath(locale)}#architecture`} className="btn btn-primary">
              {h.ctaPrimary}
              <Icon name="arrow" size={16} className="flip-rtl" />
            </Link>
            <Link href={localePath(locale, "/docs/architecture")} className="btn btn-ghost">
              {h.ctaSecondary}
            </Link>
          </div>
          <nav aria-label={h.quickLabel} className="mt-10">
            <p className="font-mono text-xs text-subtle">{h.quickLabel}</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {quick.map((q) => (
                <li key={q.href}>
                  <Link
                    href={q.href}
                    className="group flex h-full items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-muted transition-colors hover:border-[var(--accent-line)] hover:text-fg"
                  >
                    <Icon name={q.icon} size={16} className="shrink-0 text-accent" />
                    <span>{q.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <figure className="panel corner-marks relative p-3 sm:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3 font-mono text-[0.6875rem] text-subtle">
            <span dir="ltr">supercore/packages</span>
            <span>{h.facts}</span>
          </div>
          <DependencyGraph
            label={dict.a11y.heroGraph}
            withProducts
            animate
            interactive
            mirror={dirFor(locale) === "rtl"}
            className="mt-2"
          />
          <figcaption className="flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-3 text-xs text-subtle">
            <span className="sr-only">{dict.a11y.legend}:</span>
            <span className="inline-flex items-center gap-2">
              <svg width="22" height="6" aria-hidden="true"><path d="M0 3h22" stroke="var(--line-strong)" strokeWidth="1.6" /></svg>
              {h.legendPubspec}
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="22" height="6" aria-hidden="true"><path d="M0 3h22" stroke="var(--line-strong)" strokeWidth="1.6" strokeDasharray="5 4" /></svg>
              {h.legendDocumented}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
