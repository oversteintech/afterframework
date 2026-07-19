import type { Metadata } from "next";
import Link from "next/link";
import { links, modules, packages } from "@/data/content";

export const metadata: Metadata = {
  title: "Packages & standard APIs",
  description:
    "after_core and after_design_system — shared standard APIs for every AfterArtificial Super App.",
};

const ports = [
  "afterAuthRepositoryProvider",
  "afterAnalyticsProvider",
  "afterRemotePushProvider",
  "afterEntitlementProvider",
  "afterHttpPolicyProvider / afterDioProvider",
  "afterFeatureFlagsProvider",
  "afterRemoteConfigProvider",
  "afterAiCredentialVaultProvider",
  "afterLocalNotificationsProvider",
  "afterDeepLinkServiceProvider",
];

export default function PackagesPage() {
  return (
    <main className="section-pad pt-28">
      <div className="container-max">
        <p className="eyebrow mb-4">Packages · Standard APIs</p>
        <h1 className="display mb-4 text-4xl md:text-5xl">
          One API surface. Every Super App.
        </h1>
        <p className="mb-14 max-w-2xl text-muted">
          After Framework (SuperCore) is the shared place for standard platform
          APIs. Super Apps override ports with adapters — they never fork auth,
          networking, AI, or premium kits.
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

        <section className="mt-16">
          <h2 className="display mb-6 text-2xl md:text-3xl">Modules</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <div key={m.id} className="surface-card px-5 py-4 font-mono text-sm">
                {m.label}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="display mb-4 text-2xl md:text-3xl">Composition bootstrap</h2>
          <p className="mb-6 max-w-2xl text-sm text-muted">
            Every Super App starts with{" "}
            <code className="text-accent">AfterStandardOverrides.create(...)</code>{" "}
            then adds product adapters.
          </p>
          <pre className="code-block">{`AfterFramework.ensureConfigured();
ProviderScope(
  overrides: [
    ...AfterStandardOverrides.create(
      preferences: prefs,
      userAgent: 'SuperNews/0.1.0',
    ),
    // product auth / analytics / push / entitlements
  ],
  child: App(),
);`}</pre>
        </section>

        <section className="mt-16">
          <h2 className="display mb-6 text-2xl md:text-3xl">Ports to override</h2>
          <ul className="space-y-2 font-mono text-sm text-muted">
            {ports.map((p) => (
              <li key={p} className="surface-card px-5 py-3">
                {p}
              </li>
            ))}
          </ul>
        </section>

        <pre className="code-block mt-12">{`dependencies:
  after_core:
    path: ../supercore/packages/after_core
  after_design_system:
    path: ../supercore/packages/after_design_system`}</pre>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/start" className="btn btn-primary">
            Start a Super App
          </Link>
          <a
            href={links.githubSuperCore}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            SuperCore on GitHub ↗
          </a>
        </div>
      </div>
    </main>
  );
}
