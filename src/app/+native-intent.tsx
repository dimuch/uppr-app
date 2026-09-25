/**
 * Maps website URLs (universal links / shared links) onto app routes, so
 * https://uppr.com.ua/blog/articles/<slug> opens the native reader.
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    const url = new URL(path, 'uppr://app');
    const p = url.pathname.replace(/\/+$/, '');
    const article = p.match(/^\/(?:blog\/)?articles\/([^/]+?)(?:\.html)?$/);
    if (article) return `/article/${article[1]}`;
    if (p.startsWith('/blog')) return '/blog';
    if (p.startsWith('/downloads')) return '/downloads';
    if (p.startsWith('/case-study')) return '/case-studies';
    if (p === '/test') return '/test';
    return path;
  } catch {
    return '/';
  }
}
