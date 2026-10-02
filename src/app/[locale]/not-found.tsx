import Link from "next/link";
import { locale as rootLocale } from "next/root-params";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";

export default async function NotFound() {
  const value = await rootLocale();
  const locale = isLocale(value) ? value : defaultLocale;
  const dict = await getDictionary(locale);
  return (
    <main className="blueprint relative">
      <div className="container-x flex min-h-[70vh] flex-col justify-center py-24">
        <p className="eyebrow">404</p>
        <h1 className="display mt-4 max-w-2xl text-4xl sm:text-5xl">{dict.notFound.title}</h1>
        <p className="lead mt-5 max-w-xl">{dict.notFound.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={localePath(locale)} className="btn btn-primary">
            {dict.notFound.home}
          </Link>
          <Link href={localePath(locale, "/docs")} className="btn btn-ghost">
            {dict.notFound.docs}
          </Link>
        </div>
      </div>
    </main>
  );
}
