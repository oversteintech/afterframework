import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { themeInitScript } from "@/components/site/ThemeSwitcher";
import { dirFor, isLocale, locales, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { jsonLdString, organizationJsonLd, pageMetadata, siteUrl } from "@/lib/seo";
import "../globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0d12" },
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
  ],
  colorScheme: "dark light",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return { metadataBase: new URL(siteUrl) };
  const dict = await getDictionary(locale);
  return {
    ...pageMetadata({ locale, dict, path: "", description: dict.meta.description }),
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s · ${dict.meta.siteName}` },
    applicationName: dict.meta.siteName,
    authors: [{ name: "Overstein Labs", url: "https://www.overstein.com" }],
    creator: "Overstein Labs",
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <html
      lang={localeTags[locale]}
      dir={dirFor(locale)}
      data-theme="dark"
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrains.variable} ${plexArabic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd(dict, locale)) }}
        />
      </head>
      <body className="min-h-screen">
        <a href="#main" className="skip-link">
          {dict.a11y.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <div id="main" tabIndex={-1} className="outline-none">
          {children}
        </div>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
