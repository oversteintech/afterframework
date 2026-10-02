"use client";

import { useState } from "react";
import { designTokens } from "@/content/framework";

export function MotionDemo({ label, replay }: { label: string; replay: string }) {
  const [run, setRun] = useState(0);
  const max = Math.max(...designTokens.motion.map((m) => m.value));
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-fg">{label}</p>
        <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-md border border-line px-2 py-1 text-xs text-muted hover:text-fg">
          {replay}
        </button>
      </div>
      <ul className="mt-3 space-y-2" key={run}>
        {designTokens.motion.map((m) => (
          <li key={m.token} className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3 text-xs">
            <span className="truncate font-mono text-subtle" dir="ltr">{m.token}</span>
            <span className="h-2 overflow-hidden rounded-full bg-surface-3">
              <span
                className="motion-bar block h-full rounded-full bg-accent"
                style={{ width: `${(m.value / max) * 100}%`, ["--dur" as string]: `${m.value}ms` }}
              />
            </span>
            <span className="text-end font-mono text-subtle">{m.value}ms</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
