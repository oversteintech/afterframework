import type { Metadata } from "next";
import Link from "next/link";
import { links, startSteps, superAppFamily } from "@/data/content";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "How to add a new Super App on After Framework — packages, manifest, composition root, vertical features.",
};

export default function StartPage() {
  return (
    <main className="section-pad pt-28">
      <div className="container-max">
        <p className="eyebrow mb-4">Get started</p>
        <h1 className="display mb-4 text-4xl md:text-5xl">
          Add a Super App in four steps
        </h1>
        <p className="mb-14 max-w-2xl text-muted">
          Example: SuperHealth. Depend on After packages, set the manifest, wire
          adapters, ship vertical features only.
        </p>

        <ol className="space-y-4">
          {startSteps.map((item) => (
            <li key={item.step} className="surface-card flex gap-6 p-6 md:p-8">
              <span className="font-mono text-sm text-accent">{item.step}</span>
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <pre className="code-block mt-12">{`AfterFramework.ensureConfigured();
ProviderContainer(overrides: [
  ...bootstrapOverrides,
  ...AfterFramework.createProductOverrides(prefs),
]);`}</pre>

        <section className="mt-16">
          <h2 className="display mb-6 text-2xl">Active Super Apps</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {superAppFamily.map((app) => (
              <li key={app.name}>
                <a
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card flex items-center justify-between px-5 py-4 text-sm transition-colors hover:border-accent/30"
                >
                  <span className="font-semibold">{app.name}</span>
                  <span className="font-mono text-xs text-muted">{app.status}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={links.githubSuperCore}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            SuperCore packages ↗
          </a>
          <Link href="/packages" className="btn btn-ghost">
            Standard APIs
          </Link>
          <a
            href={links.afterArtificial}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Super Apps ↗
          </a>
        </div>
      </div>
    </main>
  );
}
