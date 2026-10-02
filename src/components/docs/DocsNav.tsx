"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface DocsNavGroup {
  id: string;
  title: string;
  items: { href: string; title: string; mono?: boolean }[];
}

export function DocsNav({ label, groups }: { label: string; groups: DocsNavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="text-sm">
      {groups.map((g) => (
        <div key={g.id} className="mb-6">
          <p className="mb-2 px-3 text-xs font-semibold text-fg">{g.title}</p>
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const current = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`block rounded-md px-3 py-1.5 transition-colors ${item.mono ? "font-mono text-[0.8125rem]" : ""} ${
                      current ? "bg-accent-soft text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
