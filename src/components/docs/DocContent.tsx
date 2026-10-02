import Link from "next/link";
import type { ReactNode } from "react";
import { DependencyGraph } from "@/components/graph/DependencyGraph";
import { CodeBlock } from "@/components/ui/CodeBlock";
import type { CodeSampleId } from "@/content/code";
import { docSections, type DocPage } from "@/content/docs";
import {
  adrs,
  components,
  dependentsOf,
  designTokens,
  getPackage,
  layers,
  packages,
  repo,
  specBranding,
  toolchain,
  tools,
} from "@/content/framework";
import { dirFor, type Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { localePath } from "@/i18n/paths";
import type { Dictionary } from "@/i18n/types";
import { DocHeading } from "./DocHeading";

interface Ctx {
  locale: Locale;
  dict: Dictionary;
  page: DocPage;
}

function Bullets({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="bullets">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return <code dir="ltr">{children}</code>;
}

function AdrLink({ adr, dict }: { adr: (typeof adrs)[keyof typeof adrs]; dict: Dictionary }) {
  return (
    <p className="text-sm">
      <a href={`${repo.blob}/${adr.file}`} target="_blank" rel="noopener noreferrer" className="link font-mono">
        {adr.id}
        <span className="sr-only"> {dict.a11y.newTab}</span>
      </a>
    </p>
  );
}

function PackageLink({ id, locale }: { id: string; locale: Locale }) {
  return (
    <Link href={localePath(locale, `/docs/packages/${id}`)} className="link font-mono text-sm" dir="ltr">
      {id}
    </Link>
  );
}

function Section({ id, title, dict, children }: { id: string; title: string; dict: Dictionary; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <DocHeading id={id} title={title} anchorLabel={dict.a11y.linkToSection} />
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function graphLabel(dict: Dictionary) {
  return fmt(dict.packages.graphLabel, { name: "After Framework" });
}

function renderSection({ locale, dict, page }: Ctx, id: string): ReactNode {
  const p = dict.docs.pages;
  const mirror = dirFor(locale) === "rtl";

  switch (page.key) {
    case "overview":
      switch (id) {
        case "what":
          return <p>{p.overview.whatBody}</p>;
        case "layers":
          return (
            <>
              <p>{p.overview.layersBody}</p>
              <figure className="panel p-4">
                <DependencyGraph label={dict.a11y.heroGraph} withProducts mirror={mirror} />
              </figure>
              <div className="overflow-x-auto">
                <table className="table-docs">
                  <tbody>
                    {layers.map((l) => (
                      <tr key={l.id}>
                        <th scope="row">{dict.arch.layers[l.id].name}</th>
                        <td>
                          {l.packages.length ? (
                            <span className="flex flex-wrap gap-2">
                              {l.packages.map((pkg) => (
                                <PackageLink key={pkg} id={pkg} locale={locale} />
                              ))}
                            </span>
                          ) : (
                            <Mono>lib/features/&lt;vertical&gt;/</Mono>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          );
        case "doctrine":
          return <p>{p.overview.doctrineBody}</p>;
        case "ecosystem":
          return <p>{p.overview.ecosystemBody}</p>;
      }
      break;

    case "gettingStarted":
      switch (id) {
        case "requirements":
          return <p>{fmt(p.gettingStarted.requirementsBody, { dart: toolchain.dartSdk, flutter: toolchain.flutter })}</p>;
        case "sibling-checkout":
          return (
            <>
              <p>{p.gettingStarted.layoutBody}</p>
              <CodeBlock id="siblingLayout" dict={dict} />
            </>
          );
        case "dependencies":
          return (
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <p className="text-sm font-semibold !text-fg">{p.gettingStarted.consumerLabel}</p>
                <CodeBlock id="consumerPubspec" dict={dict} title="pubspec.yaml" />
              </div>
              <div className="min-w-0 space-y-2">
                <p className="text-sm font-semibold !text-fg">{p.gettingStarted.enterpriseLabel}</p>
                <CodeBlock id="enterprisePubspec" dict={dict} title="pubspec.yaml" />
              </div>
            </div>
          );
        case "composition-root":
          return (
            <>
              <p>{p.gettingStarted.compositionBody}</p>
              <CodeBlock id="consumerComposition" dict={dict} title="lib/app/platform/after_framework.dart" />
              <CodeBlock id="enterpriseComposition" dict={dict} title="lib/app/platform/after_framework.dart" />
            </>
          );
        case "checklist":
          return (
            <>
              <h3 className="!mt-2">{p.gettingStarted.mustLabel}</h3>
              <Bullets items={p.gettingStarted.must} />
              <h3>{p.gettingStarted.shouldLabel}</h3>
              <Bullets items={p.gettingStarted.should} />
            </>
          );
      }
      break;

    case "architecture":
      switch (id) {
        case "layers":
          return (
            <>
              <p>{p.architecture.layersBody}</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {layers.map((l) => (
                  <li key={l.id} className="panel p-4">
                    <p className="font-semibold !text-fg">{dict.arch.layers[l.id].name}</p>
                    <p className="mt-1 text-sm">{dict.arch.layers[l.id].body}</p>
                  </li>
                ))}
              </ul>
            </>
          );
        case "dependency-rule":
          return (
            <>
              <p>{p.architecture.ruleBody}</p>
              <figure className="panel p-4">
                <DependencyGraph label={graphLabel(dict)} mirror={mirror} />
              </figure>
            </>
          );
        case "principles":
          return <Bullets items={p.architecture.principles} />;
        case "app-shape":
          return (
            <>
              <p>{p.architecture.shapeBody}</p>
              <CodeBlock id="appShape" dict={dict} />
            </>
          );
      }
      break;

    case "enterprise": {
      const e = dict.enterprise.items;
      switch (id) {
        case "scope":
          return (
            <>
              <p>{e.scope.body}</p>
              <CodeBlock id="enterpriseScope" dict={dict} />
              <AdrLink adr={adrs.scope} dict={dict} />
            </>
          );
        case "rbac-audit":
          return (
            <>
              <p>{e.rbac.body}</p>
              <p>{e.audit.body}</p>
            </>
          );
        case "interop":
          return (
            <>
              <p>{e.interop.body}</p>
              <ol className="list-decimal space-y-1.5 ps-6">
                {p.enterprise.interopSteps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <AdrLink adr={adrs.interop} dict={dict} />
            </>
          );
        case "bootstrap":
          return (
            <>
              <p>{e.bootstrap.body}</p>
              <CodeBlock id="bootstrapMode" dict={dict} />
              <AdrLink adr={adrs.bootstrap} dict={dict} />
            </>
          );
        case "ports":
          return (
            <>
              <p>{e.modularity.body}</p>
              <ul className="flex flex-wrap gap-1.5" dir="ltr">
                {getPackage("after_enterprise")!.apis.map((api) => (
                  <li key={api} className="chip">{api}</li>
                ))}
              </ul>
              <CodeBlock id="enterpriseComposition" dict={dict} />
              <p className="rounded-lg border border-dashed border-line-strong p-4 text-sm">{dict.enterprise.disclaimer}</p>
            </>
          );
      }
      break;
    }

    case "packages":
      switch (id) {
        case "graph":
          return (
            <figure className="panel p-4">
              <DependencyGraph label={graphLabel(dict)} mirror={mirror} />
            </figure>
          );
        case "index":
          return (
            <div className="overflow-x-auto">
              <table className="table-docs">
                <thead>
                  <tr>
                    <th scope="col">{p.packages.colPackage}</th>
                    <th scope="col">{p.packages.colRole}</th>
                    <th scope="col">{p.packages.colDepends}</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td><PackageLink id={pkg.id} locale={locale} /></td>
                      <td>{dict.packages.items[pkg.id].role}</td>
                      <td className="font-mono text-xs" dir="ltr">{pkg.dependsOn.join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
      }
      break;

    case "packageDetail": {
      const pkg = getPackage(page.pkg!)!;
      const item = dict.packages.items[pkg.id];
      const users = dependentsOf(pkg.id);
      switch (id) {
        case "purpose":
          return (
            <>
              <p className="text-sm font-semibold !text-accent">{item.role}</p>
              <p>{item.purpose}</p>
            </>
          );
        case "dependencies":
          return (
            <>
              <figure className="panel p-4">
                <DependencyGraph label={fmt(dict.packages.graphLabel, { name: pkg.id })} selected={pkg.id} mirror={mirror} />
              </figure>
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-sm font-semibold text-fg">{dict.packages.dependsOn}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2 text-sm text-muted">
                    {pkg.dependsOn.length ? pkg.dependsOn.map((d) => <PackageLink key={d} id={d} locale={locale} />) : dict.packages.none}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-fg">{dict.packages.usedBy}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2 text-sm text-muted">
                    {users.length ? users.map((d) => <PackageLink key={d} id={d} locale={locale} />) : dict.packages.noDependents}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-fg">{dict.packages.external}</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5" dir="ltr">
                    {pkg.external.map((x) => (
                      <span key={x} className="chip">{x}</span>
                    ))}
                  </dd>
                </div>
              </dl>
            </>
          );
        case "apis":
          return (
            <ul className="grid gap-1.5 sm:grid-cols-2" dir="ltr">
              {pkg.apis.map((api) => (
                <li key={api} className="rounded-md border border-line bg-surface px-3 py-2 font-mono text-sm text-fg">{api}</li>
              ))}
            </ul>
          );
        case "example":
          return pkg.sample ? (
            <CodeBlock id={pkg.sample as CodeSampleId} dict={dict} />
          ) : (
            <p className="rounded-lg border border-dashed border-line-strong p-4 text-sm">{p.packageDetail.noExample}</p>
          );
      }
      break;
    }

    case "factory":
      switch (id) {
        case "pipeline":
          return (
            <>
              <p>{p.factory.pipelineBody}</p>
              <ol className="grid gap-2 sm:grid-cols-5">
                {(["idea", "domain", "modules", "shell", "deploy"] as const).map((s, i) => (
                  <li key={s} className="panel p-3">
                    <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-1 text-sm font-semibold !text-fg">{dict.factory.steps[s].title}</p>
                  </li>
                ))}
              </ol>
            </>
          );
        case "spec":
          return (
            <>
              <p>{p.factory.specBody}</p>
              <CodeBlock id="productSpec" dict={dict} title="super_airport.product.spec.yaml" />
            </>
          );
        case "ownership":
          return (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel p-4">
                <h3 className="!mt-0">{dict.factory.ownsTitle}</h3>
                <Bullets items={dict.factory.owns} />
              </div>
              <div className="panel p-4">
                <h3 className="!mt-0">{dict.factory.inheritsTitle}</h3>
                <Bullets items={dict.factory.inherits} />
              </div>
            </div>
          );
        case "commands":
          return (
            <>
              <CodeBlock id="validate" dict={dict} title="validate_product_spec.ps1" />
              <CodeBlock id="generate" dict={dict} title="generate_product.ps1" />
              <CodeBlock id="afterGenerate" dict={dict} title="flutter" />
            </>
          );
        case "regeneration":
          return <p>{dict.factory.note}</p>;
      }
      break;

    case "tooling":
      switch (id) {
        case "cli":
          return <p>{p.tooling.noCliBody}</p>;
        case "scripts":
          return (
            <div className="overflow-x-auto">
              <table className="table-docs">
                <thead>
                  <tr>
                    <th scope="col">{p.tooling.colScript}</th>
                    <th scope="col">{p.tooling.colPurpose}</th>
                  </tr>
                </thead>
                <tbody>
                  {tools.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <a href={`${repo.blob}/${t.file}`} target="_blank" rel="noopener noreferrer" className="link font-mono text-xs" dir="ltr">
                          {t.file}
                          <span className="sr-only"> {dict.a11y.newTab}</span>
                        </a>
                      </td>
                      <td>{p.tooling.scripts[t.id]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case "flutter":
          return (
            <>
              <CodeBlock id="afterGenerate" dict={dict} title="flutter" />
              <CodeBlock id="testing" dict={dict} title="dart format · flutter test · check_reuse_contract.ps1" />
            </>
          );
        case "package-tests":
          return <CodeBlock id="packageTests" dict={dict} />;
        case "ci":
          return (
            <>
              <CodeBlock id="ciWorkflow" dict={dict} title=".github/workflows/ci.yml" />
              <CodeBlock id="signing" dict={dict} title="wire_play_release_signing.ps1" />
            </>
          );
      }
      break;

    case "designSystem": {
      const ds = p.designSystem;
      switch (id) {
        case "theme":
          return (
            <>
              <p>{dict.packages.items.after_design_system.purpose}</p>
              <CodeBlock id="themeData" dict={dict} />
            </>
          );
        case "tokens": {
          const rows: [string, string][] = [
            ...designTokens.colors.map((c) => [c.token, c.value] as [string, string]),
            ...designTokens.spacing.map((s) => [`AfterSpacing.${s.token}`, `${s.value}`] as [string, string]),
            ...designTokens.radius.map((r) => [`AfterRadius · ${r.token}`, `${r.value}`] as [string, string]),
            ...designTokens.motion.map((m) => [`AfterMotion · ${m.token}`, `${m.value}ms`] as [string, string]),
          ];
          return (
            <div className="overflow-x-auto">
              <table className="table-docs">
                <thead>
                  <tr>
                    <th scope="col">{ds.colToken}</th>
                    <th scope="col">{ds.colValue}</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {rows.map(([token, value]) => (
                    <tr key={token}>
                      <td dir="ltr">{token}</td>
                      <td dir="ltr">
                        {value.startsWith("#") ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="h-3.5 w-3.5 rounded-sm border border-line" style={{ background: value }} aria-hidden="true" />
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        case "components":
          return (
            <>
              <p>{dict.design.componentsBody}</p>
              <ul className="flex flex-wrap gap-1.5" dir="ltr">
                {components.map((c) => (
                  <li key={c} className="chip">lib/src/components/{c}.dart</li>
                ))}
              </ul>
            </>
          );
        case "brand":
          return (
            <>
              <p>{dict.design.brandBody}</p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4" dir="ltr">
                {specBranding.map((b) => (
                  <li key={b.name} className="panel flex items-center gap-2 p-3">
                    <span className="h-6 w-6 rounded" style={{ background: b.accent }} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-fg">{b.name}</span>
                      <span className="block font-mono text-[0.6875rem] text-subtle">{b.accent} · {b.monogram}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          );
      }
      break;
    }
  }
  return null;
}

export function DocContent(ctx: Ctx) {
  const { dict, page } = ctx;
  const sections = docSections(page, dict);

  if (page.key === "glossary") {
    return (
      <dl className="space-y-3">
        {sections.map((s) => {
          const entry = dict.glossary[s.id as keyof Dictionary["glossary"]];
          return (
            <div key={s.id} id={s.id} className="docs-anchor-target panel p-5">
              <dt className="flex items-center font-semibold text-fg">
                {entry.term}
                <a href={`#${s.id}`} className="heading-anchor">
                  <span aria-hidden="true">#</span>
                  <span className="sr-only">
                    {dict.a11y.linkToSection}: {entry.term}
                  </span>
                </a>
              </dt>
              <dd className="mt-1.5 text-muted">{entry.def}</dd>
            </div>
          );
        })}
      </dl>
    );
  }

  return (
    <>
      {sections.map((s) => (
        <Section key={s.id} id={s.id} title={s.title} dict={dict}>
          {renderSection(ctx, s.id)}
        </Section>
      ))}
    </>
  );
}
