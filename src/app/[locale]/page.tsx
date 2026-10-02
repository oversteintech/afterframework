import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ArchitectureSection, FactorySection, PackagesSection, WorkflowSection } from "@/components/home/sections-platform";
import {
  ClosingCta,
  DesignSection,
  DocsPreviewSection,
  EnterpriseSection,
  ProductsSection,
} from "@/components/home/sections-products";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata({ locale, dict, path: "", description: dict.meta.description });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  const dict = await getDictionary(locale);
  return (
    <main>
      <Hero locale={locale} dict={dict} />
      <ArchitectureSection dict={dict} />
      <FactorySection dict={dict} />
      <PackagesSection locale={locale} dict={dict} />
      <WorkflowSection dict={dict} />
      <ProductsSection dict={dict} />
      <DesignSection dict={dict} />
      <DocsPreviewSection locale={locale} dict={dict} />
      <EnterpriseSection locale={locale} dict={dict} />
      <ClosingCta locale={locale} dict={dict} />
    </main>
  );
}
