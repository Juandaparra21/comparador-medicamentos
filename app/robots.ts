import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/app/lib/siteUrl'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private or per-user routes that add no SEO value and shouldn't be crawled.
      disallow: ['/api/', '/carrito', '/lista', '/login', '/register', '/auth/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
