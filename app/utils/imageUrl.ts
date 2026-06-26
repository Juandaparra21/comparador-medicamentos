// Request a small thumbnail from VTEX-based pharmacy image CDNs (most Colombian
// pharmacies: La Rebaja, Cruz Verde, Farmatodo, Olimpica...). VTEX serves resized
// images by inserting WIDTH-HEIGHT into the "/arquivos/ids/{id}/" path, which cuts
// a typical 60-140 KB product PNG down to ~5-10 KB. URLs that don't match the VTEX
// pattern (or are already resized) are returned unchanged so nothing ever breaks.
export function thumbnailUrl(url: string | undefined, size = 200): string {
  if (!url) return ''
  return url.replace(/(\/arquivos\/ids\/\d+)(\/)/, `$1-${size}-${size}$2`)
}
