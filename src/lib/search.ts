export type SearchKind = "page" | "section" | "api" | "term";

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  /** Parent page title, shown as context for sections and APIs. */
  context?: string;
  href: string;
  text?: string;
}

export function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase()
    .replace(/[_\-./]+/g, " ")
    .trim();
}

export interface ScoredEntry extends SearchEntry {
  score: number;
}

/** Breaks score ties so an API identifier outranks a section that shares its name. */
const kindRank: Record<SearchKind, number> = { page: 0, api: 1, term: 2, section: 3 };

/** Every query token must match; titles weigh more than body text. */
export function searchEntries(entries: SearchEntry[], query: string, limit = 12): ScoredEntry[] {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const compactQuery = q.replace(/\s+/g, "");
  const results: ScoredEntry[] = [];

  for (const entry of entries) {
    const title = normalize(entry.title);
    const context = normalize(entry.context ?? "");
    const text = normalize(entry.text ?? "");
    const compactTitle = title.replace(/\s+/g, "");
    let score = 0;
    let matchedAll = true;

    for (const token of tokens) {
      if (title.startsWith(token)) score += 10;
      else if (title.includes(token)) score += 6;
      else if (context.includes(token)) score += 3;
      else if (text.includes(token)) score += 1;
      else {
        matchedAll = false;
        break;
      }
    }
    if (!matchedAll && compactTitle.includes(compactQuery)) {
      matchedAll = true;
      score = 8;
    }
    if (!matchedAll) continue;
    if (title === q) score += 20;
    if (entry.kind === "page") score += 2;
    results.push({ ...entry, score });
  }

  return results
    .sort((a, b) => b.score - a.score || kindRank[a.kind] - kindRank[b.kind] || a.title.localeCompare(b.title))
    .slice(0, limit);
}
