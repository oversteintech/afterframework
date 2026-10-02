import type { MetadataRoute } from "next";
import { docPages, docPath } from "@/content/docs";
import { locales } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...docPages.map(docPath)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path === "/docs" ? 0.9 : 0.7,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
