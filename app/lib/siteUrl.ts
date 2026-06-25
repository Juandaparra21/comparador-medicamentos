// Canonical absolute base URL of the deployed site. Used for sitemap, robots,
// canonical links and Open Graph tags. Resolution order:
//   1. NEXT_PUBLIC_SITE_URL        — set this when you connect a custom domain.
//   2. Vercel's production domain  — automatic, so *.vercel.app works with zero
//      config (e.g. https://farmii.vercel.app).
//   3. http://localhost:3000       — local development.
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`

  return 'http://localhost:3000'
}

export const SITE_URL = resolve()
