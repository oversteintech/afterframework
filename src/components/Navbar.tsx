import Link from "next/link";
import { nav, site } from "@/data/content";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav
        className="container-max flex h-14 items-center justify-between"
        aria-label="Main"
      >
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-[10px] font-bold tracking-tight text-[#041018] ring-1 ring-inset ring-[#041018]/25"
            aria-hidden
          >
            AF
          </span>
          {site.name}
        </Link>
        <ul className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/start" className="btn btn-primary !px-4 !py-2 text-xs md:text-sm">
          Get started
        </Link>
      </nav>
    </header>
  );
}
