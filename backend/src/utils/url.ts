import type { Source } from '../config/sources.js';

/** Returns the URL without tracking parameters, or null when it is not a web address. */
export function normalizeUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.username || url.password) return null;

  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith('utm_')) url.searchParams.delete(key);
  }
  url.hash = '';
  return url.toString();
}

function isUnder(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function findSource(url: string, sources: Source[]): Source | undefined {
  const { hostname, pathname } = new URL(url);
  return sources.find(
    ({ domain, pathPrefix, excludePaths }) =>
      (hostname === domain || hostname.endsWith(`.${domain}`)) &&
      (!pathPrefix || isUnder(pathname, pathPrefix)) &&
      !excludePaths?.some((path) => isUnder(pathname, path)),
  );
}

export function stripLinks(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\(?\b(?:https?:\/\/|www\.)[^\s)]+\)?/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
