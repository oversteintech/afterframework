"use client";

import { useCallback, useId, useRef, useState, type KeyboardEvent } from "react";

/** WAI-ARIA tabs with roving tabindex. Arrow keys follow the document direction. */
export function useTabs<T extends string>(ids: readonly T[], initial?: T, orientation: "horizontal" | "vertical" = "horizontal") {
  const [active, setActive] = useState<T>(initial ?? ids[0]);
  const refs = useRef(new Map<T, HTMLButtonElement | null>());
  const base = useId();

  const focusTab = useCallback(
    (id: T) => {
      setActive(id);
      refs.current.get(id)?.focus();
    },
    [],
  );

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const idx = ids.indexOf(active);
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const nextKeys = orientation === "vertical" ? ["ArrowDown"] : [rtl ? "ArrowLeft" : "ArrowRight"];
    const prevKeys = orientation === "vertical" ? ["ArrowUp"] : [rtl ? "ArrowRight" : "ArrowLeft"];
    if (orientation === "vertical") {
      nextKeys.push(rtl ? "ArrowLeft" : "ArrowRight");
      prevKeys.push(rtl ? "ArrowRight" : "ArrowLeft");
    }
    let next: number | null = null;
    if (nextKeys.includes(e.key)) next = (idx + 1) % ids.length;
    else if (prevKeys.includes(e.key)) next = (idx - 1 + ids.length) % ids.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ids.length - 1;
    if (next !== null) {
      e.preventDefault();
      focusTab(ids[next]);
    }
  }

  function tabProps(id: T) {
    const selected = id === active;
    return {
      id: `${base}-tab-${id}`,
      role: "tab" as const,
      type: "button" as const,
      "aria-selected": selected,
      "aria-controls": `${base}-panel-${id}`,
      tabIndex: selected ? 0 : -1,
      onClick: () => setActive(id),
      onKeyDown,
      ref: (el: HTMLButtonElement | null) => {
        refs.current.set(id, el);
      },
    };
  }

  function panelProps(id: T) {
    return {
      id: `${base}-panel-${id}`,
      role: "tabpanel" as const,
      "aria-labelledby": `${base}-tab-${id}`,
      hidden: id !== active,
      tabIndex: 0,
    };
  }

  return { active, setActive, tabProps, panelProps };
}
