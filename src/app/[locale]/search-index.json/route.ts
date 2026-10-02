import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildSearchIndex } from "@/lib/search-index";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: RouteContext<"/[locale]/search-index.json">) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  const dict = await getDictionary(locale);
  return Response.json(buildSearchIndex(locale, dict), {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
