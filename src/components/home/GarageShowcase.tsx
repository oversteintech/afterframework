"use client";

import Image from "next/image";
import { useTabs } from "@/components/ui/useTabs";
import { garageShots, type GarageShotId } from "@/content/framework";
import { fmt } from "@/i18n/format";

const ids = garageShots.map((s) => s.id);

export function GarageShowcase({
  labels,
}: {
  labels: {
    showcase: string;
    platform: string;
    product: string;
    screenshot: string;
    shots: Record<GarageShotId, { title: string; caption: string }>;
  };
}) {
  const { active, tabProps, panelProps } = useTabs(ids, "health");

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
      <div className="order-2 lg:order-1">
        <div role="tablist" aria-label={labels.showcase} aria-orientation="vertical" className="grid gap-2">
          {garageShots.map((shot, i) => {
            const selected = active === shot.id;
            return (
              <button
                key={shot.id}
                {...tabProps(shot.id)}
                className={`rounded-lg border p-4 text-start transition-colors ${
                  selected ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-line-strong"
                }`}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold text-fg">{labels.shots[shot.id].title}</span>
                </span>
                <span className="mt-1.5 block text-sm text-muted">{labels.shots[shot.id].caption}</span>
                {selected ? (
                  <span className="mt-3 grid gap-2 sm:grid-cols-2">
                    {shot.platform.length ? (
                      <span className="block">
                        <span className="block text-[0.6875rem] font-semibold text-fg">{labels.platform}</span>
                        <span className="mt-1 flex flex-wrap gap-1" dir="ltr">
                          {shot.platform.map((api) => (
                            <span key={api} className="chip chip-accent">{api}</span>
                          ))}
                        </span>
                      </span>
                    ) : null}
                    <span className="block">
                      <span className="block text-[0.6875rem] font-semibold text-fg">{labels.product}</span>
                      <span className="mt-1 flex flex-wrap gap-1" dir="ltr">
                        {shot.product.map((p) => (
                          <span key={p} className="chip">{p}</span>
                        ))}
                      </span>
                    </span>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="order-1 mx-auto w-full max-w-[19rem] lg:order-2">
        <div className="relative rounded-[2.2rem] border border-line-strong bg-surface-2 p-2.5 shadow-[var(--shadow)]">
          {garageShots.map((shot) => (
            <div key={shot.id} {...panelProps(shot.id)} className="relative overflow-hidden rounded-[1.7rem] outline-none">
              <Image
                src={shot.src}
                alt={fmt(labels.screenshot, { caption: labels.shots[shot.id].caption })}
                width={476}
                height={1024}
                sizes="(min-width: 1024px) 18rem, 70vw"
                className="fade-swap block h-auto w-full"
                priority={false}
              />
              <span className="pointer-events-none absolute inset-0 rounded-[1.7rem] ring-1 ring-inset ring-[var(--accent-line)]" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
