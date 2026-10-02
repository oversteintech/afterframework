import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./types";

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  tr: () => import("./dictionaries/tr").then((m) => m.default),
  de: () => import("./dictionaries/de").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
  es: () => import("./dictionaries/es").then((m) => m.default),
  pt: () => import("./dictionaries/pt").then((m) => m.default),
  it: () => import("./dictionaries/it").then((m) => m.default),
  ar: () => import("./dictionaries/ar").then((m) => m.default),
  ja: () => import("./dictionaries/ja").then((m) => m.default),
  ko: () => import("./dictionaries/ko").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}
