"use client";

import { useParams } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { errorMessages } from "@/i18n/error-messages";

export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const t = errorMessages[locale];
  return (
    <main className="container-x flex min-h-[60vh] flex-col justify-center py-24">
      <h1 className="display text-3xl sm:text-4xl" role="alert">
        {t.title}
      </h1>
      <p className="lead mt-4 max-w-xl">{t.body}</p>
      <div className="mt-8">
        <button type="button" onClick={reset} className="btn btn-primary">
          {t.retry}
        </button>
      </div>
    </main>
  );
}
