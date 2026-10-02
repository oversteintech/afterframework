import { docDescription, docPages, docPath, docSections, docTitle } from "@/content/docs";
import { packages } from "@/content/framework";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { Dictionary } from "@/i18n/types";
import type { SearchEntry } from "./search";

export function buildSearchIndex(locale: Locale, d: Dictionary): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const page of docPages) {
    const base = localePath(locale, docPath(page));
    const title = docTitle(page, d);
    entries.push({ kind: "page", title, href: base, text: docDescription(page, d) });
    if (page.key === "glossary") continue;
    for (const section of docSections(page, d)) {
      entries.push({ kind: "section", title: section.title, context: title, href: `${base}#${section.id}` });
    }
  }

  for (const pkg of packages) {
    const href = localePath(locale, `/docs/packages/${pkg.id}`);
    for (const api of pkg.apis) {
      entries.push({ kind: "api", title: api, context: pkg.id, href: `${href}#apis` });
    }
  }

  const glossaryHref = localePath(locale, "/docs/glossary");
  for (const [id, entry] of Object.entries(d.glossary)) {
    entries.push({ kind: "term", title: entry.term, context: d.docs.pages.glossary.title, href: `${glossaryHref}#${id}`, text: entry.def });
  }

  return entries;
}
