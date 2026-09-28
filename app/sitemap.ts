import type { MetadataRoute } from 'next'
import { getAllPriceEntries } from '@/app/utils/priceCatalog'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { SITE_URL } from '@/app/lib/siteUrl'

// Se regenera cada 6 horas (como las paginas /precio), asi lastModified refleja
// la fecha real del ultimo precio guardado y no la del ultimo deploy.
export const revalidate = 21600

// query -> ultimo snapshot con precios (tracked_medications.last_snapshot_at).
// null si la base no esta disponible: en ese caso se listan todas las paginas.
async function lastSnapshotByQuery(): Promise<Map<string, string> | null> {
  const db = getAdminClient()
  if (!db) return null
  const { data, error } = await db
    .from('tracked_medications')
    .select('query, last_snapshot_at')
    .not('last_snapshot_at', 'is', null)
  if (error || !data) return null
  return new Map(data.map((r) => [r.query as string, r.last_snapshot_at as string]))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static, indexable pages. /buscar, /carrito, /lista and auth routes are
  // intentionally excluded (dynamic or per-user, see robots.ts).
  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: `${SITE_URL}/`,                      priority: 1.0,  changeFrequency: 'daily'   },
    { url: `${SITE_URL}/medicamentos-baratos`,  priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${SITE_URL}/ofertas`,               priority: 0.7,  changeFrequency: 'daily'   },
    { url: `${SITE_URL}/cercanas`,        priority: 0.7,  changeFrequency: 'weekly'  },
    { url: `${SITE_URL}/sobre-nosotros`,  priority: 0.4,  changeFrequency: 'monthly' },
    { url: `${SITE_URL}/contacto`,        priority: 0.4,  changeFrequency: 'monthly' },
    { url: `${SITE_URL}/terminos`,        priority: 0.3,  changeFrequency: 'yearly'  },
    { url: `${SITE_URL}/privacidad`,      priority: 0.3,  changeFrequency: 'yearly'  },
  ] as const).map((r) => ({ ...r, lastModified: now }))

  const snapshots = await lastSnapshotByQuery()

  // Transactional "precio de X en Colombia" pages, highest intent.
  // Solo las que ya tienen precios guardados: las demas se sirven con noindex
  // (ver app/precio/[slug]/page.tsx) y entran solas cuando el cron las llena.
  // /medicamento/[slug] is intentionally excluded: it 308-redirects to /precio.
  const precioRoutes: MetadataRoute.Sitemap = getAllPriceEntries()
    .filter((e) => !snapshots || snapshots.has(e.query))
    .map((e) => {
      const last = snapshots?.get(e.query)
      return {
        url: `${SITE_URL}/precio/${e.slug}`,
        lastModified: last ? new Date(last) : now,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }
    })

  return [...staticRoutes, ...precioRoutes]
}
