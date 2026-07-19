import type { Metadata } from "next";
import Link from "next/link";
import { packages } from "@/data/content";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "after_core and after_design_system — the two packages that make up After Framework.",
};

export default function PackagesPage() {
  return (
    <main className="section-pad pt-28">
      <div className="container-max">
        <p className="eyebrow mb-4">Packages</p>
        <h1 className="display mb-4 text-4xl md:text-5xl">after_core + after_design_system</h1>
        <p className="mb-14 max-w-2xl text-muted">
          Product UI belongs in the design system. Cross-cutting services live in
          after_core. Business screens stay in each Super App.
        </p>

        <div className="space-y-6">
          {packages.map((pkg) => (
            <article key={pkg.name} className="surface-card p-8 md:p-10">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-mono text-2xl font-semibold">{pkg.name}</h2>
                <span className="eyebrow text-accent">{pkg.role}</span>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                {pkg.description}
              </p>
            </article>
          ))}
        </div>

        <pre className="code-block mt-12">{`dependencies:
  after_core:
    path: packages/after_core
  after_design_system:
    path: packages/after_design_system`}</pre>

        <Link href="/start" className="btn btn-primary mt-10">
          Start a Super App
        </Link>
      </div>
    </main>
  );
}
