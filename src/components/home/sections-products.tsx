import Image from "next/image";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  components,
  designTokens,
  garageCapabilities,
  links,
  products,
  repo,
  specBranding,
} from "@/content/framework";
import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { localePath } from "@/i18n/paths";
import type { Dictionary } from "@/i18n/types";
import { GarageShowcase } from "./GarageShowcase";
import { MotionDemo } from "./MotionDemo";
import { SectionHeading } from "./SectionHeading";

function StatusBadge({ status, label }: { status: "shipping" | "scaffold" | "planned"; label: string }) {
  const tone =
    status === "shipping"
      ? "border-[var(--accent-line)] bg-accent-soft text-fg"
      : status === "scaffold"
        ? "border-line-strong bg-surface-2 text-muted"
        : "border-dashed border-line-strong text-subtle";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium ${tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "shipping" ? "bg-accent" : "bg-line-strong"}`} aria-hidden="true" />
      {label}
    </span>
  );
}

export function ProductsSection({ dict }: { dict: Dictionary }) {
  const p = dict.products;
  return (
    <section id="products" aria-labelledby="products-title" className="section">
      <div className="container-x">
        <SectionHeading id="products" eyebrow={p.eyebrow} title={p.title} lead={p.lead} />

        <div className="mt-12">
          <GarageShowcase
            labels={{
              showcase: p.showcaseLabel,
              platform: p.platformLayer,
              product: p.productLayer,
              screenshot: dict.a11y.screenshot,
              shots: p.shots,
            }}
          />
        </div>

        <div className="mt-14 panel p-6">
          <h3 className="text-lg font-semibold">{p.capabilityMap}</h3>
          <p className="mt-1 text-sm text-subtle">{p.capabilityNote}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {garageCapabilities.map((group) => (
              <div
                key={group.pkg}
                className={`rounded-lg border p-4 ${group.pkg === "product" ? "border-signal bg-signal-soft" : "border-[var(--accent-line)] bg-accent-soft"}`}
              >
                <p className="font-mono text-xs font-semibold text-fg" dir={group.pkg === "product" ? undefined : "ltr"}>
                  {group.pkg === "product" ? p.productFeatures : group.pkg}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5" dir="ltr">
                  {group.items.map((item) => (
                    <li key={item} className="chip">{group.pkg === "product" ? `features/${item}` : item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h3 className="text-xl font-semibold">{p.familyTitle}</h3>
          <p className="mt-1 text-sm text-subtle">{p.familyNote}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((prod) => (
              <li key={prod.id} className="panel flex flex-col p-4">
                <div className="flex items-start gap-3">
                  <Image
                    src={`/products/icons/${prod.icon}.webp`}
                    alt={fmt(dict.a11y.productIcon, { name: prod.name })}
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-xl border border-line object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-fg" dir="ltr">{prod.name}</p>
                    <p className="mt-0.5 text-xs text-subtle">
                      {p.lines[prod.line]}
                      {prod.reference ? ` · ${p.reference}` : ""}
                      {prod.role === "os_shell" ? ` · ${p.osShell}` : ""}
                    </p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.domains[prod.id as keyof typeof p.domains]}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <StatusBadge status={prod.status} label={p.status[prod.status]} />
                  {prod.repo ? (
                    <a href={prod.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
                      <Icon name="github" size={14} />
                      <span className="sr-only">{prod.name} {dict.a11y.newTab}</span>
                    </a>
                  ) : null}
                </div>
                {prod.packages ? (
                  <p className="mt-3 border-t border-line pt-3 font-mono text-[0.6875rem] leading-relaxed text-subtle" dir="ltr">
                    {prod.packages.join(" · ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function DesignSection({ dict }: { dict: Dictionary }) {
  const d = dict.design;
  const maxSpace = Math.max(...designTokens.spacing.map((s) => s.value));
  return (
    <section id="design-system" aria-labelledby="design-system-title" className="section">
      <div className="container-x">
        <SectionHeading id="design-system" eyebrow={d.eyebrow} title={d.title} lead={d.lead} />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <div className="panel p-6 lg:col-span-2">
            <h3 className="font-semibold">{d.tokensTitle}</h3>
            <p className="mt-1 text-sm text-muted">{d.tokensBody}</p>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-fg">{d.colorLabel}</p>
                <ul className="mt-3 grid grid-cols-3 gap-2">
                  {designTokens.colors.map((c) => (
                    <li key={c.token} className="min-w-0">
                      <span className="block h-10 rounded-md border border-line" style={{ background: c.value }} aria-hidden="true" />
                      <span className="mt-1 block truncate font-mono text-[0.625rem] text-subtle" dir="ltr" title={c.token}>
                        {c.token.replace("AfterColors.", "")}
                      </span>
                      <span className="block font-mono text-[0.625rem] text-muted" dir="ltr">{c.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-7">
                <div>
                  <p className="text-xs font-semibold text-fg">{d.spacingLabel}</p>
                  <ul className="mt-3 space-y-1.5">
                    {designTokens.spacing.map((s) => (
                      <li key={s.token} className="grid grid-cols-[4rem_1fr_2.5rem] items-center gap-3 text-xs">
                        <span className="font-mono text-subtle" dir="ltr">{s.token}</span>
                        <span className="h-2 rounded-sm bg-signal" style={{ width: `${(s.value / maxSpace) * 100}%` }} aria-hidden="true" />
                        <span className="text-end font-mono text-muted">{s.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-fg">{d.radiusLabel}</p>
                  <ul className="mt-3 flex flex-wrap gap-3">
                    {designTokens.radius.map((r) => (
                      <li key={r.token} className="text-center">
                        <span className="block h-12 w-12 border border-accent bg-accent-soft" style={{ borderRadius: r.value }} aria-hidden="true" />
                        <span className="mt-1 block font-mono text-[0.625rem] text-subtle">{r.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <MotionDemo label={d.motionLabel} replay={d.replayMotion} />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="panel p-6">
              <h3 className="font-semibold">{d.componentsTitle}</h3>
              <p className="mt-1 text-sm text-muted">{d.componentsBody}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" dir="ltr">
                {components.map((c) => (
                  <li key={c} className="chip">{c}.dart</li>
                ))}
              </ul>
            </div>
            <div className="panel p-6">
              <h3 className="font-semibold">{d.a11yTitle}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{d.a11yBody}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="panel p-6">
            <h3 className="font-semibold">{d.responsiveTitle}</h3>
            <p className="mt-1 text-sm text-muted">{d.responsiveBody}</p>
            <div className="mt-4 overflow-x-auto">
              <table className="table-docs">
                <thead>
                  <tr>
                    <th scope="col">{d.responsiveWidth}</th>
                    <th scope="col">{d.responsiveMax}</th>
                    <th scope="col">{d.responsivePadding}</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {designTokens.responsive.map((r) => (
                    <tr key={r.width}>
                      <td dir="ltr">{r.width}</td>
                      <td dir="ltr">{r.max}</td>
                      <td dir="ltr">{r.padding}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel p-6">
            <h3 className="font-semibold">{d.brandTitle}</h3>
            <p className="mt-1 text-sm text-muted">{d.brandBody}</p>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specBranding.map((b) => (
                <li key={b.name} className="rounded-lg border border-line bg-surface-2 p-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-sm font-bold text-[#0b0c0f]"
                    style={{ background: b.accent }}
                    aria-hidden="true"
                  >
                    {b.monogram}
                  </span>
                  <span className="mt-2 block truncate text-sm font-semibold" dir="ltr">{b.name}</span>
                  <span className="block font-mono text-[0.6875rem] text-subtle" dir="ltr">{b.accent}</span>
                  <span className="mt-2 flex gap-1" aria-hidden="true">
                    <span className="h-1.5 flex-1 rounded-full" style={{ background: b.accent }} />
                    <span className="h-1.5 flex-1 rounded-full bg-line-strong" />
                    <span className="h-1.5 flex-1 rounded-full bg-line" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DocsPreviewSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const d = dict.docsPreview;
  const pages = dict.docs.pages;
  return (
    <section id="docs" aria-labelledby="docs-title" className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading id="docs" eyebrow={d.eyebrow} title={d.title} lead={d.lead} />
          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {d.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-sm text-muted">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-accent" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link href={localePath(locale, "/docs")} className="btn btn-primary mt-9">
            {d.cta}
            <Icon name="arrow" size={16} className="flip-rtl" />
          </Link>
        </div>
        <div className="panel corner-marks overflow-hidden" aria-hidden="true">
          <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="ms-3 flex-1 truncate rounded bg-bg px-2 py-1 font-mono text-[0.6875rem] text-subtle" dir="ltr">
              afterframework.com/{locale}/docs/architecture
            </span>
          </div>
          <div className="grid grid-cols-[8.5rem_1fr] sm:grid-cols-[10rem_1fr_8rem]">
            <div className="space-y-1 border-e border-line p-3 text-xs">
              {[pages.overview.title, pages.gettingStarted.title, pages.architecture.title, pages.enterprise.title, pages.packages.title, pages.factory.title, pages.tooling.title].map((t, i) => (
                <p key={t} className={`truncate rounded px-2 py-1 ${i === 2 ? "bg-accent-soft text-fg" : "text-subtle"}`}>{t}</p>
              ))}
            </div>
            <div className="min-w-0 space-y-3 p-4">
              <p className="text-base font-semibold text-fg">{pages.architecture.title}</p>
              <p className="text-xs leading-relaxed text-muted">{pages.architecture.layersBody}</p>
              <div className="code-frame">
                <pre className="!p-3 !text-[0.6875rem]"><code><span style={{ color: "var(--shiki-token-keyword)" }}>enum</span> <span style={{ color: "var(--shiki-token-function)" }}>AfterBootstrapMode</span> {"{"}{"\n"}  scaffold,{"\n"}  production,{"\n"}{"}"}</code></pre>
              </div>
            </div>
            <div className="hidden space-y-1.5 border-s border-line p-3 text-[0.6875rem] sm:block">
              <p className="font-semibold text-fg">{dict.docs.ui.onThisPage}</p>
              {[pages.architecture.layersTitle, pages.architecture.ruleTitle, pages.architecture.principlesTitle, pages.architecture.shapeTitle].map((t, i) => (
                <p key={t} className={`truncate ${i === 1 ? "text-accent" : "text-subtle"}`}>{t}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const enterpriseItems: { id: keyof Dictionary["enterprise"]["items"]; icon: IconName }[] = [
  { id: "scope", icon: "lock" },
  { id: "rbac", icon: "key" },
  { id: "audit", icon: "audit" },
  { id: "interop", icon: "link" },
  { id: "bootstrap", icon: "bolt" },
  { id: "modularity", icon: "grid" },
];

export function EnterpriseSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const e = dict.enterprise;
  return (
    <section id="enterprise" aria-labelledby="enterprise-title" className="section">
      <div className="container-x">
        <SectionHeading id="enterprise" eyebrow={e.eyebrow} title={e.title} lead={e.lead} />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_minmax(0,30rem)]">
          <ul className="grid gap-3 sm:grid-cols-2">
            {enterpriseItems.map((item) => (
              <li key={item.id} className="panel p-5">
                <Icon name={item.icon} size={20} className="text-accent" />
                <h3 className="mt-3 font-semibold">{e.items[item.id].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{e.items[item.id].body}</p>
              </li>
            ))}
          </ul>
          <div className="min-w-0 space-y-4">
            <CodeBlock id="enterpriseScope" dict={dict} title="enterprise_scope.dart" />
            <p className="flex gap-2.5 rounded-lg border border-dashed border-line-strong p-4 text-sm text-muted">
              <Icon name="shield" size={18} className="mt-0.5 shrink-0 text-warn" />
              <span>{e.disclaimer}</span>
            </p>
            <Link href={localePath(locale, "/docs/enterprise")} className="link inline-flex items-center gap-1.5 text-sm">
              {dict.docs.pages.enterprise.title}
              <Icon name="arrow" size={14} className="flip-rtl" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClosingCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.cta;
  return (
    <section aria-labelledby="cta-title" className="section overflow-hidden">
      <div className="blueprint fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative text-center">
        <h2 id="cta-title" className="display mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl">{c.title}</h2>
        <p className="lead mx-auto mt-6 max-w-2xl">{c.lead}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={localePath(locale, "/docs")} className="btn btn-primary">
            {c.docs}
            <Icon name="arrow" size={16} className="flip-rtl" />
          </Link>
          <a href={repo.supercore} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <Icon name="github" size={16} />
            {c.source}
            <span className="sr-only">{dict.a11y.newTab}</span>
          </a>
          <a href={`mailto:${links.email}`} className="btn btn-ghost">
            <Icon name="mail" size={16} />
            {c.contact}
          </a>
          <a href={links.afterArtificial} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            {c.ecosystem}
            <Icon name="external" size={15} />
            <span className="sr-only">{dict.a11y.newTab}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
