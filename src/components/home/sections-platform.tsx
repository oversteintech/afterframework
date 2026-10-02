import type { ReactNode } from "react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Icon } from "@/components/ui/Icon";
import type { CodeSampleId } from "@/content/code";
import { packages, type PackageId } from "@/content/framework";
import { dirFor, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { Dictionary } from "@/i18n/types";
import { ArchitectureMap } from "./ArchitectureMap";
import { PackageExplorer } from "./PackageExplorer";
import { SectionHeading } from "./SectionHeading";
import { Workflow } from "./Workflow";
import { workflowSteps, type WorkflowStep } from "./workflow-steps";

export function ArchitectureSection({ dict }: { dict: Dictionary }) {
  const a = dict.arch;
  return (
    <section id="architecture" aria-labelledby="architecture-title" className="section">
      <div className="container-x">
        <SectionHeading id="architecture" eyebrow={a.eyebrow} title={a.title} lead={a.lead} />
        <div className="mt-12">
          <ArchitectureMap
            labels={{
              mapLabel: a.mapLabel,
              selectHint: a.selectHint,
              ownedBy: a.ownedBy,
              dependsOn: a.dependsOn,
              usedBy: a.usedBy,
              sharedZone: a.sharedZone,
              productZone: a.productZone,
              adapterZone: a.adapterZone,
              noneDeps: dict.packages.none,
              noneUsers: dict.packages.noDependents,
              layers: a.layers,
            }}
          />
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="panel p-6">
            <h3 className="text-lg font-semibold">{a.reuseTitle}</h3>
            <p className="mt-3 leading-relaxed text-muted">{a.reuseBody}</p>
          </div>
          <div className="panel p-6">
            <h3 className="text-lg font-semibold">{a.rulesTitle}</h3>
            <ol className="mt-3 space-y-2.5">
              {a.rules.map((rule, i) => (
                <li key={i} className="flex gap-3 text-muted">
                  <span className="mt-0.5 font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

const factorySteps = ["idea", "domain", "modules", "shell", "deploy"] as const;

export function FactorySection({ dict }: { dict: Dictionary }) {
  const f = dict.factory;
  return (
    <section id="factory" aria-labelledby="factory-title" className="section overflow-hidden">
      <div className="blueprint fade-mask pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading id="factory" eyebrow={f.eyebrow} title={f.title} lead={f.lead} />
        <ol aria-label={f.flowLabel} className="mt-12 grid gap-3 md:grid-cols-5">
          {factorySteps.map((id, i) => (
            <li key={id} className="assemble relative">
              <div className={`panel h-full p-5 ${i === 1 ? "!border-[var(--accent-line)]" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {i < factorySteps.length - 1 ? (
                    <Icon name="arrow" size={16} className="flip-rtl hidden text-subtle md:block" />
                  ) : (
                    <Icon name="check" size={16} className="hidden text-accent md:block" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.steps[id].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.steps[id].body}</p>
              </div>
              {i < factorySteps.length - 1 ? (
                <span className="absolute start-1/2 -bottom-3 h-3 w-px bg-line-strong md:hidden" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="panel p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <span className="h-2.5 w-2.5 rounded-sm bg-signal" aria-hidden="true" />
              {f.ownsTitle}
            </h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {f.owns.map((item) => (
                <li key={item} className="rounded-md border border-line bg-surface-2 px-3 py-2 text-sm text-muted">{item}</li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <span className="h-2.5 w-2.5 rounded-sm bg-accent" aria-hidden="true" />
              {f.inheritsTitle}
            </h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {f.inherits.map((item) => (
                <li key={item} className="rounded-md border border-[var(--accent-line)] bg-accent-soft px-3 py-2 text-sm text-fg">{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-sm text-subtle">{f.note}</p>
      </div>
    </section>
  );
}

export function PackagesSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const p = dict.packages;
  const examples: Partial<Record<PackageId, ReactNode>> = {};
  for (const pkg of packages) {
    if (pkg.sample) examples[pkg.id] = <CodeBlock id={pkg.sample as CodeSampleId} dict={dict} />;
  }
  return (
    <section id="packages" aria-labelledby="packages-title" className="section">
      <div className="container-x">
        <SectionHeading id="packages" eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <div className="mt-12">
          <PackageExplorer
            labels={{
              listLabel: p.listLabel,
              dependsOn: p.dependsOn,
              usedBy: p.usedBy,
              none: p.none,
              noDependents: p.noDependents,
              keyApis: p.keyApis,
              external: p.external,
              example: p.example,
              openDocs: p.openDocs,
              openSource: p.openSource,
              graphLabel: p.graphLabel,
              newTab: dict.a11y.newTab,
              items: p.items,
            }}
            examples={examples}
            docsBase={localePath(locale, "/docs/packages")}
            mirror={dirFor(locale) === "rtl"}
          />
        </div>
      </div>
    </section>
  );
}

export function WorkflowSection({ dict }: { dict: Dictionary }) {
  const w = dict.workflow;
  const panels: Record<WorkflowStep, ReactNode> = {
    init: (
      <>
        <CodeBlock id="validate" dict={dict} title="validate_product_spec.ps1" />
        <CodeBlock id="generate" dict={dict} title="generate_product.ps1" />
        <CodeBlock id="afterGenerate" dict={dict} title="flutter" showSource={false} />
      </>
    ),
    compose: (
      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock id="consumerPubspec" dict={dict} title="pubspec.yaml · consumer" />
        <CodeBlock id="enterprisePubspec" dict={dict} title="pubspec.yaml · enterprise" />
      </div>
    ),
    configure: (
      <>
        <CodeBlock id="manifest" dict={dict} title="manifest.dart" />
        <CodeBlock id="bootstrapMode" dict={dict} title="after_bootstrap_mode.dart" />
      </>
    ),
    test: (
      <>
        <CodeBlock id="testing" dict={dict} title="dart format · flutter test · check_reuse_contract.ps1" />
      </>
    ),
    deploy: (
      <>
        <CodeBlock id="ciWorkflow" dict={dict} title=".github/workflows/ci.yml" />
        <CodeBlock id="signing" dict={dict} title="wire_play_release_signing.ps1" />
      </>
    ),
  };
  const steps = Object.fromEntries(workflowSteps.map((s) => [s, w.steps[s]])) as Record<WorkflowStep, { title: string; body: string }>;
  return (
    <section id="workflow" aria-labelledby="workflow-title" className="section">
      <div className="container-x">
        <SectionHeading id="workflow" eyebrow={w.eyebrow} title={w.title} lead={w.lead} />
        <div className="mt-12">
          <Workflow label={w.tabsLabel} steps={steps} panels={panels} />
        </div>
      </div>
    </section>
  );
}
