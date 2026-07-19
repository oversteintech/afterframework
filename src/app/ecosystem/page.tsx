import type { Metadata } from "next";
import { ecosystem } from "@/data/content";

export const metadata: Metadata = {
  title: "Ecosystem",
  description:
    "Brand stack: Ayhan Uzundal → AfterArtificial → After Framework → Overstein Labs.",
};

export default function EcosystemPage() {
  return (
    <main className="section-pad pt-28">
      <div className="container-max">
        <p className="eyebrow mb-4">Ecosystem</p>
        <h1 className="display mb-4 text-4xl md:text-5xl">Brand stack</h1>
        <p className="mb-10 max-w-2xl text-muted">
          One founder. One product company. One framework. One engineering lab.
        </p>

        <pre className="code-block mb-14">{`Ayhan Uzundal
  └── AfterArtificial          # product company
        └── Super* Apps
              └── Powered by After Framework   ← you are here
                    └── Built by Overstein Labs`}</pre>

        <div className="grid gap-4 sm:grid-cols-2">
          {ecosystem.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target={item.url.startsWith("http") ? "_blank" : undefined}
              rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="surface-card block p-6 transition-colors hover:border-accent/30"
            >
              <p className="eyebrow text-accent">{item.role}</p>
              <h2 className="mt-2 text-xl font-semibold">{item.name}</h2>
              <p className="mt-3 text-sm text-muted">{item.body}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
