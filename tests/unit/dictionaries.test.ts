import { describe, expect, it } from "vitest";
import ar from "@/i18n/dictionaries/ar";
import de from "@/i18n/dictionaries/de";
import en from "@/i18n/dictionaries/en";
import es from "@/i18n/dictionaries/es";
import fr from "@/i18n/dictionaries/fr";
import itDict from "@/i18n/dictionaries/it";
import ja from "@/i18n/dictionaries/ja";
import ko from "@/i18n/dictionaries/ko";
import pt from "@/i18n/dictionaries/pt";
import tr from "@/i18n/dictionaries/tr";
import { errorMessages } from "@/i18n/error-messages";
import { locales } from "@/i18n/config";

const dictionaries = { en, tr, de, fr, es, pt, it: itDict, ar, ja, ko } as const;

type Leaf = { path: string; value: string };

function leaves(node: unknown, path = ""): Leaf[] {
  if (typeof node === "string") return [{ path, value: node }];
  if (Array.isArray(node)) return node.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  throw new Error(`Unexpected value at ${path}: ${String(node)}`);
}

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

/**
 * Strings that are legitimately identical to English: brand names, identifiers,
 * and short technical labels that every locale keeps in English.
 */
const sameAsEnglishAllowed = new Set([
  "meta.siteName",
  "hero.quickDocs",
  "footer.founder",
  "footer.rights",
  "docs.ui.versionValue",
  "docs.pages.factory.specTitle",
  "docs.pages.enterprise.scopeTitle",
  "glossary.byok.term",
]);

const latinLocales = new Set(["tr", "de", "fr", "es", "pt", "it"]);

describe("dictionaries", () => {
  const enLeaves = leaves(en);
  const enMap = new Map(enLeaves.map((l) => [l.path, l.value]));

  it("cover every supported locale", () => {
    expect(Object.keys(dictionaries).sort()).toEqual([...locales].sort());
  });

  for (const locale of locales) {
    const dict = dictionaries[locale];

    describe(locale, () => {
      const localeLeaves = leaves(dict);

      it("has exactly the same keys and array lengths as en", () => {
        expect(localeLeaves.map((l) => l.path)).toEqual(enLeaves.map((l) => l.path));
      });

      it("has no empty strings", () => {
        expect(localeLeaves.filter((l) => !l.value.trim()).map((l) => l.path)).toEqual([]);
      });

      it("preserves every {placeholder}", () => {
        const broken = localeLeaves.filter((l) => placeholders(l.value).join() !== placeholders(enMap.get(l.path) ?? "").join());
        expect(broken.map((l) => l.path)).toEqual([]);
      });

      it("uses its own error messages", () => {
        expect(dict.error).toBe(errorMessages[locale]);
      });

      if (locale !== "en") {
        it("leaves no English sentences untranslated", () => {
          const untranslated = localeLeaves.filter((l) => {
            if (sameAsEnglishAllowed.has(l.path)) return false;
            const source = enMap.get(l.path) ?? "";
            // Short labels that are the same technical word in many languages (e.g. "Workflow", "Design system").
            if (latinLocales.has(locale) && !source.includes(" ")) return false;
            return source === l.value && /[a-z]{3,}\s+[a-z]{3,}/i.test(source);
          });
          expect(untranslated.map((l) => `${l.path}: ${l.value}`)).toEqual([]);
        });
      }

      if (locale === "ar" || locale === "ja" || locale === "ko") {
        it("is written in its own script", () => {
          const script = { ar: /\p{Script=Arabic}/u, ja: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u, ko: /\p{Script=Hangul}/u }[locale];
          const prose = localeLeaves.filter((l) => /\s/.test(enMap.get(l.path) ?? "") && (enMap.get(l.path) ?? "").length > 24);
          const latinOnly = prose.filter((l) => !script.test(l.value));
          expect(latinOnly.map((l) => l.path)).toEqual([]);
        });
      }
    });
  }
});
