import { describe, expect, it } from "vitest";
import { packageIds } from "@/content/framework";
import ar from "@/i18n/dictionaries/ar";
import en from "@/i18n/dictionaries/en";
import { normalize, searchEntries, type SearchEntry } from "@/lib/search";
import { buildSearchIndex } from "@/lib/search-index";

describe("normalize", () => {
  it("folds case, diacritics and identifier separators", () => {
    expect(normalize("Ürün_Spec")).toBe("urun spec");
    expect(normalize("after_core")).toBe("after core");
  });
});

describe("searchEntries", () => {
  const entries: SearchEntry[] = [
    { kind: "page", title: "after_core", href: "/en/docs/packages/after_core" },
    { kind: "api", title: "EnterpriseScope", context: "after_enterprise", href: "/en/docs/packages/after_enterprise#apis" },
    { kind: "section", title: "Dependency rule", context: "Architecture", href: "/en/docs/architecture#dependency-rule", text: "Dependencies point downward only." },
  ];

  it("ranks title matches first", () => {
    expect(searchEntries(entries, "after")[0].title).toBe("after_core");
  });

  it("requires every token to match", () => {
    expect(searchEntries(entries, "dependency nothing")).toEqual([]);
  });

  it("matches body text and identifiers without separators", () => {
    expect(searchEntries(entries, "downward")[0].title).toBe("Dependency rule");
    expect(searchEntries(entries, "aftercore")[0].title).toBe("after_core");
  });

  it("prefers an API over a section with the same title", () => {
    const withSection: SearchEntry[] = [
      { kind: "section", title: "EnterpriseScope", context: "Enterprise boundaries", href: "/en/docs/enterprise#scope" },
      ...entries,
    ];
    expect(searchEntries(withSection, "EnterpriseScope")[0].href).toBe("/en/docs/packages/after_enterprise#apis");
  });

  it("returns nothing for a blank query", () => {
    expect(searchEntries(entries, "   ")).toEqual([]);
  });
});

describe("search index", () => {
  it("indexes every package page and API in each locale", () => {
    for (const [locale, dict] of [["en", en], ["ar", ar]] as const) {
      const index = buildSearchIndex(locale, dict);
      for (const id of packageIds) {
        expect(index.some((e) => e.kind === "page" && e.href === `/${locale}/docs/packages/${id}`)).toBe(true);
      }
      expect(index.some((e) => e.kind === "api" && e.title === "EnterpriseScope")).toBe(true);
      expect(index.every((e) => e.href.startsWith(`/${locale}`))).toBe(true);
    }
  });
});
