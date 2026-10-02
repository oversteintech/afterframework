"use client";

import { usePathname, useRouter } from "next/navigation";
import { useId } from "react";
import { Icon } from "@/components/ui/Icon";
import { localeCookie, localeNames, locales, localeTags, type Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/paths";

export function LanguageSelect({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const id = useId();

  function onChange(next: Locale) {
    document.cookie = `${localeCookie}=${next}; path=/; max-age=31536000; samesite=lax`;
    const hash = window.location.hash;
    router.push(`${switchLocalePath(pathname, next)}${hash}`);
  }

  return (
    <div className="relative inline-flex items-center">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon name="globe" size={16} className="pointer-events-none absolute start-2.5 text-subtle" />
      <select
        id={id}
        value={locale}
        onChange={(e) => onChange(e.target.value as Locale)}
        className="h-9 appearance-none rounded-lg border border-line bg-surface ps-8 pe-3 text-sm text-fg hover:border-line-strong"
      >
        {locales.map((l) => (
          <option key={l} value={l} lang={localeTags[l]}>
            {localeNames[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
