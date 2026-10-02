"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/i18n/config";
import type { SearchLabels } from "./SearchDialog";

const SearchDialog = dynamic(() => import("./SearchDialog").then((m) => m.SearchDialog), { ssr: false });

export function SearchTrigger({ locale, labels }: { locale: Locale; labels: SearchLabels }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const show = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        show();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        show();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-keyshortcuts="/ Control+K Meta+K"
        className="inline-flex h-9 w-9 min-w-0 items-center justify-center gap-2 rounded-lg border border-line bg-surface text-sm text-muted hover:border-line-strong hover:text-fg md:w-52 md:justify-start md:px-3 md:text-subtle"
      >
        <Icon name="search" size={16} className="shrink-0" />
        <span className="sr-only md:not-sr-only md:min-w-0 md:flex-1 md:truncate md:text-start">{labels.search}</span>
        <kbd className="hidden rounded border border-line px-1.5 font-mono text-[0.6875rem] text-subtle md:inline" aria-hidden="true">/</kbd>
      </button>
      {mounted ? <SearchDialog locale={locale} labels={labels} open={open} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
