import type { Metadata } from "next";
import { defaultLocale, locales, localeTags, ogLocales, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { Dictionary } from "@/i18n/types";

export const siteUrl = "https://www.afterframework.com";

export function absoluteUrl(path: string) {
  return `${siteUrl}${path}`;
}

/** hreflang map for a locale-independent path ("" = home, "/docs/…"). */
export function languageAlternates(path: string): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const locale of locales) entries[localeTags[locale]] = absoluteUrl(localePath(locale, path));
  entries["x-default"] = absoluteUrl(localePath(defaultLocale, path));
  return entries;
}

export function pageMetadata({
  locale,
  dict,
  path,
  title,
  description,
  type = "website",
}: {
  locale: Locale;
  dict: Dictionary;
  path: string;
  title?: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(localePath(locale, path));
  const fullTitle = title ? `${title} · ${dict.meta.siteName}` : dict.meta.title;
  return {
    metadataBase: new URL(siteUrl),
    title: title ? title : { absolute: dict.meta.title },
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: dict.meta.siteName,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function organizationJsonLd(dict: Dictionary, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#org`,
        name: "Overstein Labs",
        url: "https://www.overstein.com",
        email: "hello@overstein.com",
        sameAs: ["https://github.com/oversteintech"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: dict.meta.siteName,
        url: siteUrl,
        inLanguage: localeTags[locale],
        description: dict.meta.description,
        publisher: { "@id": `${siteUrl}/#org` },
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${siteUrl}/#supercore`,
        name: "supercore",
        codeRepository: "https://github.com/oversteintech/supercore",
        programmingLanguage: ["Dart", "Flutter"],
        description: dict.meta.description,
        author: { "@id": `${siteUrl}/#org` },
      },
    ],
  };
}

export function docsJsonLd({
  locale,
  path,
  title,
  description,
  crumbs,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  crumbs: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: title,
        description,
        inLanguage: localeTags[locale],
        url: absoluteUrl(localePath(locale, path)),
        isPartOf: { "@id": `${siteUrl}/#website` },
        publisher: { "@id": `${siteUrl}/#org` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: absoluteUrl(localePath(locale, c.path)),
        })),
      },
    ],
  };
}

/** Serializes JSON-LD safely for inline <script> tags. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
