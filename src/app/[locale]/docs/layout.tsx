import { DocsNav, type DocsNavGroup } from "@/components/docs/DocsNav";
import { Icon } from "@/components/ui/Icon";
import { docGroups, docPages, docPath, docTitle } from "@/content/docs";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";

export default async function DocsLayout({ children, params }: LayoutProps<"/[locale]/docs">) {
  const locale = (await params).locale as Locale;
  const dict = await getDictionary(locale);
  const groups: DocsNavGroup[] = docGroups.map((g) => ({
    id: g,
    title: dict.docs.ui.groups[g],
    items: docPages
      .filter((p) => p.group === g)
      .map((p) => ({ href: localePath(locale, docPath(p)), title: docTitle(p, dict), mono: p.key === "packageDetail" })),
  }));

  return (
    <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-8 py-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-12">
      <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
        <details className="group panel lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold">
            {dict.docs.ui.title}
            <Icon name="menu" size={18} className="text-subtle group-open:hidden" />
            <Icon name="close" size={18} className="hidden text-subtle group-open:block" />
          </summary>
          <div className="border-t border-line p-2">
            <DocsNav label={dict.a11y.docsNav} groups={groups} />
          </div>
        </details>
        <div className="hidden lg:block">
          <DocsNav label={dict.a11y.docsNav} groups={groups} />
        </div>
      </aside>
      {children}
    </div>
  );
}
