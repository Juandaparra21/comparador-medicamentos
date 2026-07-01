import { NextResponse } from 'next/server'
import { getAllMedicineSlugs } from '@/app/utils/medicineInfo'
import { SITE_URL } from '@/app/lib/siteUrl'

export const maxDuration = 15

// IndexNow key. The same value must be served as a plain-text file at
// /<key>.txt (see public/e22f7cf2c619462418842fae5483edc0.txt) so search
// engines can verify ownership before accepting the submitted URLs.
const INDEXNOW_KEY = 'e22f7cf2c619462418842fae5483edc0'

// Every indexable URL of the site (mirrors sitemap.ts). Notifying IndexNow gets
// these into Bing/Yandex (and DuckDuckGo/Ecosia) almost immediately. Google does
// not use IndexNow — that still goes through Search Console.
function allUrls(): string[] {
  const slugs = getAllMedicineSlugs()
  const staticRoutes = ['/', '/cercanas', '/sobre-nosotros', '/contacto', '/terminos', '/privacidad']
  const precio = slugs.map((s) => `/precio/${s}`)
  const med = slugs.map((s) => `/medicamento/${s}`)
  return [...staticRoutes, ...precio, ...med].map((p) => `${SITE_URL}${p}`)
}

// Visit /api/indexnow (or run it from a cron) to (re)notify search engines of
// every URL — useful after adding medications or updating the sitemap.
export async function GET() {
  const urlList = allUrls()
  const body = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  }

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    })
    return NextResponse.json({ ok: res.ok, status: res.status, submitted: urlList.length })
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 })
  }
}
