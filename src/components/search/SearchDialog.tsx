"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { searchEntries, type SearchEntry } from "@/lib/search";

export interface SearchLabels {
  search: string;
  placeholder: string;
  empty: string;
  emptyHint: string;
  error: string;
  loading: string;
  results: string;
  close: string;
  shortcut: string;
}

type Status = "loading" | "ready" | "error";

const cache = new Map<Locale, SearchEntry[]>();

export function SearchDialog({
  locale,
  labels,
  open,
  onClose,
}: {
  locale: Locale;
  labels: SearchLabels;
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<SearchEntry[] | null>(() => cache.get(locale) ?? null);
  const [status, setStatus] = useState<Status>(() => (cache.has(locale) ? "ready" : "loading"));
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open || cache.has(locale)) return;
    let cancelled = false;
    fetch(`/${locale}/search-index.json`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<SearchEntry[]>;
      })
      .then((data) => {
        if (cancelled) return;
        cache.set(locale, data);
        setEntries(data);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [open, locale]);

  const results = useMemo(() => (entries ? searchEntries(entries, query) : []), [entries, query]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      document.getElementById(`${listId}-${active}`)?.click();
    }
  }

  const activeId = results[active] ? `${listId}-${active}` : undefined;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      aria-label={labels.search}
      className="m-auto mt-[10vh] w-[min(40rem,calc(100vw-2rem))] rounded-xl border border-line-strong bg-bg-raised p-0 text-fg shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 border-b border-line px-3">
        <Icon name="search" size={18} className="text-subtle" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-label={labels.search}
          placeholder={labels.placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-subtle"
        />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle hover:bg-surface-2 hover:text-fg"
        >
          <Icon name="close" size={16} />
          <span className="sr-only">{labels.close}</span>
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto p-2">
        {status === "loading" ? (
          <p className="px-3 py-6 text-sm text-muted">{labels.loading}</p>
        ) : status === "error" ? (
          <p role="alert" className="px-3 py-6 text-sm text-warn">
            {labels.error}
          </p>
        ) : !query.trim() ? (
          <p className="px-3 py-6 text-sm text-muted">{labels.shortcut}</p>
        ) : results.length === 0 ? (
          <div className="px-3 py-6 text-sm">
            <p className="text-fg">{fmt(labels.empty, { query })}</p>
            <p className="mt-1 text-muted">{labels.emptyHint}</p>
          </div>
        ) : (
          <>
            <p className="sr-only" role="status">
              {fmt(labels.results, { count: results.length })}
            </p>
            <ul id={listId} role="listbox" aria-label={labels.search} className="space-y-0.5">
              {results.map((r, i) => (
                <li key={`${r.href}-${r.title}`} role="presentation">
                  <Link
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    href={r.href}
                    onClick={onClose}
                    onMouseMove={() => setActive(i)}
                    className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${i === active ? "bg-surface-2" : ""}`}
                  >
                    <Icon
                      name={r.kind === "api" ? "package" : r.kind === "term" ? "book" : r.kind === "section" ? "hash" : "layers"}
                      size={16}
                      className="mt-0.5 shrink-0 text-accent"
                    />
                    <span className="min-w-0">
                      <span className={`block truncate text-sm text-fg ${r.kind === "api" ? "font-mono" : ""}`}>{r.title}</span>
                      {r.context ? <span className="block truncate text-xs text-subtle">{r.context}</span> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </dialog>
  );
}
