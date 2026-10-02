export const locales = ["en", "tr", "de", "fr", "es", "pt", "it", "ar", "ja", "ko"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeCookie = "af_locale";

export const rtlLocales: ReadonlySet<Locale> = new Set<Locale>(["ar"]);

/** Endonyms — always shown in their own language in the selector. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  pt: "Português",
  it: "Italiano",
  ar: "العربية",
  ja: "日本語",
  ko: "한국어",
};

/** BCP-47 tags used for `hreflang`, `<html lang>` and `Intl`. */
export const localeTags: Record<Locale, string> = {
  en: "en",
  tr: "tr",
  de: "de",
  fr: "fr",
  es: "es",
  pt: "pt",
  it: "it",
  ar: "ar",
  ja: "ja",
  ko: "ko",
};

export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  tr: "tr_TR",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
  pt: "pt_BR",
  it: "it_IT",
  ar: "ar_SA",
  ja: "ja_JP",
  ko: "ko_KR",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}

/** Picks the best supported locale from an Accept-Language header. */
export function matchAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}
