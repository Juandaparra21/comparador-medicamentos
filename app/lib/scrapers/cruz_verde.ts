import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, classify } from './utils'

const LOGIN_URL = 'https://api.cruzverde.com.co/customer-service/login'
const SEARCH_URL = 'https://api.cruzverde.com.co/product-service/products/search'

const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Origin': 'https://www.cruzverde.com.co',
  'Referer': 'https://www.cruzverde.com.co/',
  'Accept': 'application/json, text/plain, */*',
}

async function getSessionCookie(): Promise<string> {
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { ...BASE_HEADERS, 'Content-Type': 'application/json' },
    body: '{}',
  })
  // Node 18+ with undici supports getSetCookie(); fallback to get()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const h = res.headers as any
  const setCookies: string[] = typeof h.getSetCookie === 'function'
    ? h.getSetCookie()
    : [res.headers.get('set-cookie') ?? ''].filter(Boolean)
  return setCookies.map(c => c.split(';')[0]).join('; ')
}

function extractIngredient(name: string, brand: string): string {
  const m = name.match(/^(\p{L}+(?:\s+\p{L}+)?)/u)
  if (m) {
    const ingredient = m[1].trim()
    if (brand && ingredient.toLowerCase() === brand.toLowerCase()) return ''
    return ingredient
  }
  return name.split(/\s/)[0] ?? ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapHit(hit: Record<string, any>): ScrapedProduct | null {
  const name = (String(hit.productName ?? '')).trim()
  if (!name) return null

  const prices = (hit.prices ?? {}) as Record<string, number>
  const listPrice = Number(prices['price-list-col']) || 0
  const salePrice = Number(prices['price-sale-col']) || 0

  let price: number, refPrice: number | undefined, discount: number | undefined
  if (salePrice > 0 && salePrice < listPrice) {
    price = Math.round(salePrice)
    refPrice = Math.round(listPrice)
    discount = Math.round((1 - price / refPrice) * 100)
  } else {
    price = Math.round(listPrice)
  }
  if (price <= 0 || price > 5_000_000) return null

  const brand = (String(hit.brand ?? '')).trim()
  const slug = String(hit.pageURL ?? '')
  const productId = String(hit.productId ?? '')

  const availability: ScrapedProduct['availability'] =
    (hit.homeDelivery || hit.storePickup) ? 'available' : 'unavailable'

  return {
    pharmacyId: 'cruz-verde',
    productName: name,
    type: classify(false, name),
    activeIngredient: extractIngredient(name, brand),
    concentration: extractConcentration(name),
    presentation: extractPresentation(name),
    quantity: 1,
    price,
    pricePerUnit: price,
    referencePrice: refPrice,
    discountPct: discount,
    availability,
    url: slug
      ? `https://www.cruzverde.com.co/${slug}`
      : `https://www.cruzverde.com.co/producto/${productId}`,
  }
}

export async function searchCruzVerde(query: string): Promise<ScrapedProduct[]> {
  try {
    const cookie = await getSessionCookie()
    const params = new URLSearchParams({ limit: '60', offset: '0', sort: '', q: query })
    const res = await fetch(`${SEARCH_URL}?${params}`, {
      headers: { ...BASE_HEADERS, Cookie: cookie },
    })
    if (!res.ok) return []
    const data = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hits = (data.hits ?? []) as Record<string, any>[]
    const results = hits.flatMap(h => { const p = mapHit(h); return p ? [p] : [] })
    console.log(`[cruz-verde] '${query}' -> ${results.length} productos`)
    return results
  } catch (e) {
    console.error('[cruz-verde] Error:', e)
    return []
  }
}
