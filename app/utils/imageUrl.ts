// Shrink pharmacy product images before they reach the browser.
//
// The real image hosts in our data (Cruz Verde's beta1.cruzverde.com.co, Google
// Cloud Storage / Firebase, Farmatodo's CDN) do NOT resize on origin, so a search
// page was shipping dozens of full-resolution 60-300 KB PNGs (~4 MB total).
//
// We route every image through wsrv.nl (a free image CDN/proxy): it fetches the
// source, resizes it and re-encodes it as WebP, so a typical product image drops
// to ~2-6 KB. The source URL is url-encoded because several of these hosts add
// their own query strings. The onError fallbacks in each card already cover the
// rare case where the proxy can't fetch a source.
export function thumbnailUrl(url: string | undefined, size = 160): string {
  if (!url) return ''
  // Local assets and already-proxied URLs pass through untouched.
  if (url.startsWith('/') || url.startsWith('data:') || url.includes('wsrv.nl')) return url
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${size}&output=webp&q=55`
}
