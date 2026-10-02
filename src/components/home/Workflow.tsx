"use client";

import type { ReactNode } from "react";
import { useTabs } from "@/components/ui/useTabs";
import { workflowSteps, type WorkflowStep } from "./workflow-steps";

export function Workflow({
  label,
  steps,
  panels,
}: {
  label: string;
  steps: Record<WorkflowStep, { title: string; body: string }>;
  panels: Record<WorkflowStep, ReactNode>;
}) {
  const { active, tabProps, panelProps } = useTabs(workflowSteps, "init");

  return (
    <div>
      <div role="tablist" aria-label={label} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {workflowSteps.map((id, i) => {
          const selected = active === id;
          return (
            <button
              key={id}
              {...tabProps(id)}
              className={`relative rounded-lg border px-3 py-3 text-start transition-colors ${
                selected ? "border-accent bg-accent-soft text-fg" : "border-line bg-surface text-muted hover:border-line-strong hover:text-fg"
              }`}
            >
              <span className="block font-mono text-[0.6875rem] text-subtle">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-1 block text-sm font-semibold">{steps[id].title}</span>
              {selected ? <span className="absolute inset-x-3 -bottom-px h-0.5 rounded bg-accent" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
      {workflowSteps.map((id) => (
        <div key={id} {...panelProps(id)} className="mt-5 grid gap-5 outline-none lg:grid-cols-[minmax(0,20rem)_1fr]">
          <div className="fade-swap">
            <h3 className="text-xl font-semibold">{steps[id].title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{steps[id].body}</p>
          </div>
          <div className="fade-swap min-w-0 space-y-4">{panels[id]}</div>
        </div>
      ))}
    </div>
  );
}
