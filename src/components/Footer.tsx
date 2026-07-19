import Link from "next/link";
import { ecosystem, links, nav, site } from "@/data/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border section-pad !pb-10 !pt-16" role="contentinfo">
      <div className="container-max">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-mono text-sm font-semibold">{site.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {site.tagline}. Built by Overstein Labs for AfterArtificial Super Apps.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4">Site</p>
            <ul className="space-y-2 text-sm text-muted">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Ecosystem</p>
            <ul className="space-y-2 text-sm text-muted">
              {ecosystem.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Source</p>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a
                  href={links.githubOrg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  GitHub · oversteintech
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-foreground"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>
            © {year} Overstein Labs · {site.name}
          </p>
          <p>Powering AfterArtificial Super Apps</p>
        </div>
      </div>
    </footer>
  );
}
