"use client";

import { useState } from "react";
import { layers, packages, type LayerId } from "@/content/framework";

export interface ArchitectureLabels {
  mapLabel: string;
  selectHint: string;
  ownedBy: string;
  dependsOn: string;
  usedBy: string;
  sharedZone: string;
  productZone: string;
  adapterZone: string;
  noneDeps: string;
  noneUsers: string;
  layers: Record<LayerId, { name: string; body: string }>;
}

const productStack: LayerId[] = ["ecosystem", "ai", "consumer", "enterprise", "kernel", "design"];

function layerOfPackage(id: string): LayerId | undefined {
  return layers.find((l) => l.packages.includes(id as never))?.id;
}

function dependsOn(layer: LayerId): LayerId[] {
  if (layer === "product") return productStack;
  const pkgs = layers.find((l) => l.id === layer)?.packages ?? [];
  const out = new Set<LayerId>();
  for (const pkg of pkgs) {
    for (const dep of packages.find((p) => p.id === pkg)?.dependsOn ?? []) {
      const l = layerOfPackage(dep);
      if (l) out.add(l);
    }
  }
  return [...out];
}

function usedBy(layer: LayerId): LayerId[] {
  return layers.map((l) => l.id).filter((other) => other !== layer && dependsOn(other).includes(layer));
}

export function ArchitectureMap({ labels }: { labels: ArchitectureLabels }) {
  const [selected, setSelected] = useState<LayerId>("kernel");
  const deps = new Set(dependsOn(selected));
  const users = new Set(usedBy(selected));
  const current = layers.find((l) => l.id === selected)!;

  const rows = [0, 1, 2, 3, 4].map((row) => layers.filter((l) => l.row === row));
  const zoneFor = (row: number) => (row === 0 ? labels.productZone : row === 4 ? labels.adapterZone : labels.sharedZone);

  function tone(id: LayerId) {
    if (id === selected) return "border-accent bg-accent-soft text-fg shadow-[var(--glow)]";
    if (deps.has(id)) return "border-[var(--accent-line)] bg-surface text-fg";
    if (users.has(id)) return "border-signal bg-signal-soft text-fg";
    return "border-line bg-surface text-muted hover:border-line-strong hover:text-fg";
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
      <div role="group" aria-label={labels.mapLabel} className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="assemble">
            {i === 0 || i === 1 || i === 4 ? (
              <p className="mb-2 font-mono text-[0.6875rem] tracking-wide text-subtle">{zoneFor(i)}</p>
            ) : null}
            <div className={`grid gap-3 ${row.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {row.map((layer) => (
                <button
                  key={layer.id}
                  type="button"
                  aria-pressed={selected === layer.id}
                  onClick={() => setSelected(layer.id)}
                  onMouseEnter={() => setSelected(layer.id)}
                  onFocus={() => setSelected(layer.id)}
                  className={`group relative flex min-h-[4.5rem] flex-col items-start justify-center rounded-lg border px-4 py-3 text-start transition-[border-color,background-color,box-shadow,color] duration-200 ${tone(layer.id)} ${
                    layer.id === "firebase" ? "border-dashed" : ""
                  }`}
                >
                  <span className="text-[0.95rem] font-semibold">{labels.layers[layer.id].name}</span>
                  <span className="mt-1 font-mono text-xs text-subtle" dir="ltr">
                    {layer.packages.length ? layer.packages.join(" · ") : "lib/features/<vertical>/"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="pt-1 text-sm text-subtle">{labels.selectHint}</p>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div key={selected} className="panel fade-swap p-6" aria-live="polite">
          <p className="font-mono text-xs text-accent" dir="ltr">
            {current.packages.length ? current.packages.join(" · ") : "lib/features/<vertical>/"}
          </p>
          <h3 className="mt-2 text-xl font-semibold">{labels.layers[selected].name}</h3>
          <p className="mt-3 leading-relaxed text-muted">{labels.layers[selected].body}</p>
          <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-fg">
                <span className="h-2 w-2 rounded-sm bg-accent" aria-hidden="true" />
                {labels.dependsOn}
              </dt>
              <dd className="mt-2 text-sm text-muted">
                {deps.size ? [...deps].map((l) => labels.layers[l].name).join(" · ") : labels.noneDeps}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold text-fg">
                <span className="h-2 w-2 rounded-sm bg-signal" aria-hidden="true" />
                {labels.usedBy}
              </dt>
              <dd className="mt-2 text-sm text-muted">
                {users.size ? [...users].map((l) => labels.layers[l].name).join(" · ") : labels.noneUsers}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
