import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocContent } from "@/components/docs/DocContent";
import { Toc } from "@/components/docs/Toc";
import { Icon } from "@/components/ui/Icon";
import { docDescription, docPages, docPath, docSections, docTitle, findDocPage } from "@/content/docs";
import { repo } from "@/content/framework";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { docsJsonLd, jsonLdString, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    docPages.map((p) => ({ locale, slug: p.slug ? p.slug.split("/") : [] })),
  );
}

async function resolve(params: PageProps<"/[locale]/docs/[[...slug]]">["params"]) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return null;
  const page = findDocPage((slug ?? []).join("/"));
  if (!page) return null;
  return { locale, page, dict: await getDictionary(locale) };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/docs/[[...slug]]">): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  const title = r.page.slug ? docTitle(r.page, r.dict) : r.dict.meta.docsTitle;
  const description = r.page.slug ? docDescription(r.page, r.dict) : r.dict.meta.docsDescription;
  return pageMetadata({ locale: r.locale, dict: r.dict, path: docPath(r.page), title, description, type: "article" });
}

export default async function DocPageRoute({ params }: PageProps<"/[locale]/docs/[[...slug]]">) {
  const r = await resolve(params);
  if (!r) notFound();
  const { locale, page, dict } = r;
  const ui = dict.docs.ui;
  const title = docTitle(page, dict);
  const description = docDescription(page, dict);
  const sections = docSections(page, dict);
  const index = docPages.indexOf(page);
  const prev = docPages[index - 1];
  const next = docPages[index + 1];
  const isPackage = page.key === "packageDetail";

  const crumbs = [
    { name: dict.nav.home, path: "" },
    { name: ui.title, path: "/docs" },
    ...(isPackage ? [{ name: dict.docs.pages.packages.title, path: "/docs/packages" }] : []),
    ...(page.slug ? [{ name: title, path: docPath(page) }] : []),
  ];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_13rem]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(docsJsonLd({ locale, title, description, path: docPath(page), crumbs })) }}
      />
      <main id="docs-content" className="min-w-0">
        <nav aria-label={dict.a11y.breadcrumb} className="text-sm text-subtle">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 ? <Icon name="arrow" size={12} className="flip-rtl" /> : null}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className={isPackage && c.path === docPath(page) ? "font-mono" : undefined}>{c.name}</span>
                ) : (
                  <Link href={localePath(locale, c.path)} className="hover:text-fg">{c.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="mt-6 border-b border-line pb-8">
          <h1 className={`display text-3xl sm:text-4xl ${isPackage ? "font-mono !tracking-tight" : ""}`} dir={isPackage ? "ltr" : undefined}>
            {title}
          </h1>
          <p className="lead mt-4 max-w-3xl">{description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="chip chip-accent" title={ui.versionNote}>
              {ui.versionLabel}: <span dir="ltr">{ui.versionValue}</span>
            </span>
          </div>
        </header>

        <div className="prose-docs mt-2 max-w-3xl [&>section:first-child_h2]:mt-8">
          <DocContent locale={locale} dict={dict} page={page} />
        </div>

        {page.sources.length ? (
          <aside className="mt-12 max-w-3xl rounded-lg border border-line bg-surface p-4 text-sm">
            <p className="font-semibold text-fg">{ui.sourceOfTruth}</p>
            <ul className="mt-2 space-y-1">
              {page.sources.map((s) => (
                <li key={s}>
                  <a
                    href={`${s.includes(".") ? repo.blob : repo.tree}/${s}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-muted [overflow-wrap:anywhere] hover:text-fg"
                    dir="ltr"
                  >
                    <Icon name="github" size={13} />
                    supercore/{s}
                    <span className="sr-only"> {dict.a11y.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-subtle">{ui.versionNote}</p>
          </aside>
        ) : null}

        <nav aria-label={`${ui.previous} / ${ui.next}`} className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={localePath(locale, docPath(prev))} className="panel group p-4 hover:border-line-strong">
              <span className="flex items-center gap-1.5 text-xs text-subtle">
                <Icon name="arrow" size={12} className="rotate-180 rtl:rotate-0" />
                {ui.previous}
              </span>
              <span className={`mt-1 block font-semibold ${prev.key === "packageDetail" ? "font-mono text-sm" : ""}`}>{docTitle(prev, dict)}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={localePath(locale, docPath(next))} className="panel group p-4 text-end hover:border-line-strong">
              <span className="flex items-center justify-end gap-1.5 text-xs text-subtle">
                {ui.next}
                <Icon name="arrow" size={12} className="flip-rtl" />
              </span>
              <span className={`mt-1 block font-semibold ${next.key === "packageDetail" ? "font-mono text-sm" : ""}`}>{docTitle(next, dict)}</span>
            </Link>
          ) : null}
        </nav>
      </main>

      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <Toc label={ui.onThisPage} sections={sections} />
        </div>
      </aside>
    </div>
  );
}
