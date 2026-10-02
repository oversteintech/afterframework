"use client";

import { useState } from "react";
import { Icon } from "./Icon";

type State = "idle" | "copied" | "failed";

export function CopyButton({
  text,
  labels,
}: {
  text: string;
  labels: { copy: string; copied: string; failed: string };
}) {
  const [state, setState] = useState<State>("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 1800);
  }

  const label = state === "copied" ? labels.copied : state === "failed" ? labels.failed : labels.copy;

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-line px-2 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
      >
        <Icon name={state === "copied" ? "check" : "copy"} size={14} />
        <span>{label}</span>
      </button>
      <span className="sr-only" role="status">
        {state === "idle" ? "" : label}
      </span>
    </>
  );
}
