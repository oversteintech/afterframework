import type { Metadata } from "next";
import Link from "next/link";
import { standardHighlights } from "@/data/content";

export const metadata: Metadata = {
  title: "Platform Standard",
  description:
    "AfterArtificial Platform Standard — composition roots, adapters, CI gates, and Super App checklist.",
};

export default function StandardPage() {
  return (
    <main className="section-pad pt-28">
      <div className="container-max">
        <p className="eyebrow mb-4">Platform Standard · v1</p>
        <h1 className="display mb-4 text-4xl md:text-5xl">Rules for every Super App</h1>
        <p className="mb-14 max-w-2xl text-muted">
          Normative contract for After Framework products. SuperGarage is the
          flagship reference implementation.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {standardHighlights.map((item) => (
            <article key={item.title} className="surface-card p-6">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 surface-card p-8">
          <h2 className="font-mono text-sm text-accent">Checklist (excerpt)</h2>
          <ul className="mt-6 space-y-3 font-mono text-sm text-muted">
            <li>□ AppPlatformManifest unique package / bundle IDs</li>
            <li>□ create*Overrides() composition root</li>
            <li>□ Auth / analytics / push adapters behind After ports</li>
            <li>□ Entitlement matrix mapped to AfterUserPlan</li>
            <li>□ Theme base AfterThemeData + product accents</li>
            <li>□ CI: format, analyze, test, coverage ≥ 50%</li>
          </ul>
        </div>

        <Link href="/start" className="btn btn-primary mt-10">
          Implementation steps →
        </Link>
      </div>
    </main>
  );
}
