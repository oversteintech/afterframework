import { isLocale, type Locale } from "./config";

/** Builds a locale-prefixed path. `path` must start with "/" (or be empty for the home page). */
export function localePath(locale: Locale, path = ""): string {
  if (!path || path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Replaces the locale segment of a pathname, preserving the rest. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    segments[1] = next;
    return segments.join("/") || `/${next}`;
  }
  return localePath(next, pathname);
}

/** Strips the locale prefix, returning a path that starts with "/" (or "" for home). */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "";
  }
  return pathname;
}
