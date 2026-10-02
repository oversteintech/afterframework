"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

export type ThemePref = "system" | "light" | "dark";

export const themeStorageKey = "af-theme";

function resolve(pref: ThemePref): "light" | "dark" {
  if (pref !== "system") return pref;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function apply(pref: ThemePref) {
  const root = document.documentElement;
  root.dataset.theme = resolve(pref);
  root.dataset.themePref = pref;
}

const options: { value: ThemePref; icon: IconName }[] = [
  { value: "system", icon: "monitor" },
  { value: "light", icon: "sun" },
  { value: "dark", icon: "moon" },
];

export function ThemeSwitcher({
  labels,
}: {
  labels: { label: string; system: string; light: string; dark: string };
}) {
  const [pref, setPref] = useState<ThemePref>("system");

  useEffect(() => {
    const stored = document.documentElement.dataset.themePref;
    // Sync with the value the pre-hydration script applied.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "light" || stored === "dark") setPref(stored);
  }, []);

  useEffect(() => {
    if (pref !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => apply("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [pref]);

  function choose(next: ThemePref) {
    setPref(next);
    try {
      if (next === "system") localStorage.removeItem(themeStorageKey);
      else localStorage.setItem(themeStorageKey, next);
    } catch {
      /* storage unavailable: theme still applies for this page view */
    }
    apply(next);
  }

  return (
    <div role="group" aria-label={labels.label} className="inline-flex rounded-lg border border-line bg-surface p-0.5">
      {options.map((opt) => {
        const selected = pref === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            aria-label={labels[opt.value]}
            title={labels[opt.value]}
            onClick={() => choose(opt.value)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              selected ? "bg-surface-3 text-fg" : "text-subtle hover:text-fg"
            }`}
          >
            <Icon name={opt.icon} size={16} />
          </button>
        );
      })}
    </div>
  );
}

/** Runs before first paint: stored preference, else system preference with dark as default. */
export const themeInitScript = `(function(){try{var d=document.documentElement,s=localStorage.getItem('${themeStorageKey}');var p=s==='light'||s==='dark'?s:'system';var t=p==='system'?(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):p;d.dataset.theme=t;d.dataset.themePref=p;}catch(e){document.documentElement.dataset.theme='dark';}})();`;
