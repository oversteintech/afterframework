import { describe, expect, it } from "vitest";
import { dirFor, isLocale, matchAcceptLanguage } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { localePath, stripLocale, switchLocalePath } from "@/i18n/paths";

describe("locale config", () => {
  it("recognizes supported locales only", () => {
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("zz")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("marks Arabic as right-to-left", () => {
    expect(dirFor("ar")).toBe("rtl");
    expect(dirFor("ja")).toBe("ltr");
  });

  it("matches Accept-Language by quality and base tag", () => {
    expect(matchAcceptLanguage("de-DE,de;q=0.9,en;q=0.8")).toBe("de");
    expect(matchAcceptLanguage("zh-CN,ja;q=0.7,en;q=0.9")).toBe("en");
    expect(matchAcceptLanguage("pt-BR")).toBe("pt");
    expect(matchAcceptLanguage("xx, yy;q=0.5")).toBe("en");
    expect(matchAcceptLanguage(null)).toBe("en");
  });
});

describe("locale paths", () => {
  it("builds prefixed paths", () => {
    expect(localePath("en")).toBe("/en");
    expect(localePath("tr", "/docs")).toBe("/tr/docs");
    expect(localePath("ar", "docs/packages")).toBe("/ar/docs/packages");
  });

  it("switches the locale segment and keeps the rest", () => {
    expect(switchLocalePath("/en/docs/packages/after_core", "ja")).toBe("/ja/docs/packages/after_core");
    expect(switchLocalePath("/de", "fr")).toBe("/fr");
    expect(switchLocalePath("/docs", "ko")).toBe("/ko/docs");
  });

  it("strips the locale prefix", () => {
    expect(stripLocale("/es/docs/tooling")).toBe("/docs/tooling");
    expect(stripLocale("/es")).toBe("");
  });
});

describe("fmt", () => {
  it("replaces named placeholders and leaves unknown ones", () => {
    expect(fmt("{count} results for {query}", { count: 3, query: "core" })).toBe("3 results for core");
    expect(fmt("Hello {name}", {})).toBe("Hello {name}");
  });
});
