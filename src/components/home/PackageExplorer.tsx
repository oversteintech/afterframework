"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { DependencyGraph } from "@/components/graph/DependencyGraph";
import { Icon } from "@/components/ui/Icon";
import { useTabs } from "@/components/ui/useTabs";
import { dependentsOf, packageIds, packages, repo, type PackageId } from "@/content/framework";
import { fmt } from "@/i18n/format";

export interface PackageExplorerLabels {
  listLabel: string;
  dependsOn: string;
  usedBy: string;
  none: string;
  noDependents: string;
  keyApis: string;
  external: string;
  example: string;
  openDocs: string;
  openSource: string;
  graphLabel: string;
  newTab: string;
  items: Record<PackageId, { role: string; purpose: string }>;
}

export function PackageExplorer({
  labels,
  examples,
  docsBase,
  mirror,
}: {
  labels: PackageExplorerLabels;
  examples: Partial<Record<PackageId, ReactNode>>;
  docsBase: string;
  mirror: boolean;
}) {
  const { active, setActive, tabProps, panelProps } = useTabs(packageIds, "after_core", "vertical");

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
      <div role="tablist" aria-label={labels.listLabel} aria-orientation="vertical" className="flex flex-col gap-1.5">
        {packages.map((p) => {
          const selected = active === p.id;
          return (
            <button
              key={p.id}
              {...tabProps(p.id)}
              className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-3 text-start transition-colors ${
                selected ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-line-strong"
              }`}
            >
              <span className="min-w-0">
                <span className="block font-mono text-sm text-fg" dir="ltr">{p.id}</span>
                <span className="mt-0.5 block text-xs text-subtle">{labels.items[p.id].role}</span>
              </span>
              <Icon name="arrow" size={14} className={`flip-rtl shrink-0 ${selected ? "text-accent" : "text-subtle"}`} />
            </button>
          );
        })}
      </div>

      <div className="min-w-0">
        {packages.map((p) => {
          const users = dependentsOf(p.id);
          return (
            <div key={p.id} {...panelProps(p.id)} className="panel min-w-0 p-5 outline-none sm:p-7">
              <div className="grid gap-6 xl:grid-cols-[1fr_minmax(0,22rem)]">
                <div className="min-w-0">
                  <p className="eyebrow">{labels.items[p.id].role}</p>
                  <h3 className="mt-2 font-mono text-2xl font-semibold" dir="ltr">{p.id}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{labels.items[p.id].purpose}</p>

                  <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold text-fg">
                        <span className="h-2 w-2 rounded-sm bg-accent" aria-hidden="true" />
                        {labels.dependsOn}
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {p.dependsOn.length ? (
                          p.dependsOn.map((d) => (
                            <button key={d} type="button" onClick={() => setActive(d)} className="chip chip-accent hover:border-accent" dir="ltr">
                              {d}
                            </button>
                          ))
                        ) : (
                          <span className="text-sm text-subtle">{labels.none}</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold text-fg">
                        <span className="h-2 w-2 rounded-sm bg-signal" aria-hidden="true" />
                        {labels.usedBy}
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {users.length ? (
                          users.map((u) => (
                            <button key={u} type="button" onClick={() => setActive(u)} className="chip hover:border-signal" dir="ltr">
                              {u}
                            </button>
                          ))
                        ) : (
                          <span className="text-sm text-subtle">{labels.noDependents}</span>
                        )}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <p className="text-xs font-semibold text-fg">{labels.keyApis}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5" dir="ltr">
                      {p.apis.slice(0, 10).map((api) => (
                        <li key={api} className="chip">{api}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5">
                    <p className="text-xs font-semibold text-fg">{labels.external}</p>
                    <p className="mt-2 font-mono text-xs leading-relaxed text-subtle" dir="ltr">{p.external.join(" · ")}</p>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="hairline bg-bg p-2">
                    <DependencyGraph label={fmt(labels.graphLabel, { name: p.id })} selected={p.id} mirror={mirror} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`${docsBase}/${p.id}`} className="btn btn-ghost !min-h-9 !px-3 !py-1.5 text-sm">
                      <Icon name="book" size={15} />
                      {labels.openDocs}
                    </Link>
                    <a
                      href={`${repo.tree}/${p.sourcePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost !min-h-9 !px-3 !py-1.5 text-sm"
                    >
                      <Icon name="github" size={15} />
                      {labels.openSource}
                      <span className="sr-only">{labels.newTab}</span>
                    </a>
                  </div>
                </div>
              </div>

              {examples[p.id] ? (
                <div className="mt-6 min-w-0">
                  <p className="mb-2 text-xs font-semibold text-fg">{labels.example}</p>
                  {examples[p.id]}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
