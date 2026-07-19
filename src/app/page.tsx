import Link from "next/link";
import { links, modules, packages, site, stack } from "@/data/content";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(56,189,248,0.08), transparent 70%)",
          }}
        />
        <div className="container-max relative">
          <p className="eyebrow mb-6 text-accent">After Framework · v1</p>
          <h1 className="display max-w-3xl text-4xl sm:text-5xl md:text-6xl">
            Shared Super App OS.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {site.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/start" className="btn btn-primary">
              Start a Super App
            </Link>
            <Link href="/packages" className="btn btn-ghost">
              Explore packages
            </Link>
            <a
              href={links.overstein}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Overstein Labs ↗
            </a>
          </div>
          <pre className="code-block mt-14 max-w-2xl">{`packages/
  after_core/              # engine
  after_design_system/     # UI tokens + components
# Flagship reference: SuperGarage`}</pre>
        </div>
      </section>

      <section className="section-pad border-t border-border">
        <div className="container-max">
          <p className="eyebrow mb-4">Architecture</p>
          <h2 className="display mb-4 text-3xl md:text-4xl">
            Build once. Launch verticals faster.
          </h2>
          <p className="mb-12 max-w-2xl text-muted">
            Every module below the product line is shared. Every Super App above
            it inherits the full foundation.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <div key={m.id} className="surface-card px-5 py-4 font-mono text-sm">
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border">
        <div className="container-max">
          <p className="eyebrow mb-4">Packages</p>
          <h2 className="display mb-10 text-3xl md:text-4xl">Two packages. One OS.</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {packages.map((pkg) => (
              <article key={pkg.name} className="surface-card p-8">
                <p className="eyebrow text-accent">{pkg.role}</p>
                <h3 className="mt-3 font-mono text-xl font-semibold">{pkg.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {pkg.description}
                </p>
              </article>
            ))}
          </div>
          <Link href="/packages" className="mt-8 inline-flex text-sm text-accent hover:underline">
            Package details →
          </Link>
        </div>
      </section>

      <section className="section-pad border-t border-border">
        <div className="container-max">
          <p className="eyebrow mb-4">Stack</p>
          <h2 className="display mb-8 text-3xl md:text-4xl">Production-grade defaults</h2>
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-xs text-muted"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/standard" className="btn btn-ghost">
              Platform Standard
            </Link>
            <a
              href={links.afterArtificial}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Super Apps on AfterArtificial ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
