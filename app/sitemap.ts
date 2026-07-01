import type { MetadataRoute } from 'next'
import { getAllMedicineSlugs } from '@/app/utils/medicineInfo'
import { SITE_URL } from '@/app/lib/siteUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static, indexable pages. /buscar, /carrito, /lista and auth routes are
  // intentionally excluded (dynamic or per-user — see robots.ts).
  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: `${SITE_URL}/`,                priority: 1.0,  changeFrequency: 'daily'   },
    { url: `${SITE_URL}/cercanas`,        priority: 0.7,  changeFrequency: 'weekly'  },
    { url: `${SITE_URL}/sobre-nosotros`,  priority: 0.4,  changeFrequency: 'monthly' },
    { url: `${SITE_URL}/contacto`,        priority: 0.4,  changeFrequency: 'monthly' },
    { url: `${SITE_URL}/terminos`,        priority: 0.3,  changeFrequency: 'yearly'  },
    { url: `${SITE_URL}/privacidad`,      priority: 0.3,  changeFrequency: 'yearly'  },
  ] as const).map((r) => ({ ...r, lastModified: now }))

  const slugs = getAllMedicineSlugs()

  // Transactional "precio de X en Colombia" pages — highest-intent, so top priority.
  const precioRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/precio/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  // Informational medication pages (usos, dosis, advertencias).
  const medRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/medicamento/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...precioRoutes, ...medRoutes]
}
