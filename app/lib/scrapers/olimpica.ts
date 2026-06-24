import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, extractPackQuantity, LIQUID_PRESENTATIONS, classify, normalize } from './utils'
import { withCache } from './cache'

const SEARCH_URL = 'https://www.olimpica.com/api/catalog_system/pub/products/search/'
const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Origin': 'https://www.olimpica.com',
  'Referer': 'https://www.olimpica.com/',
}

const GENERIC_BRANDS = new Set(['', 'GENERICO', 'MK', 'GENFAR', 'LAPROF', 'PROCAPS', 'COASPHARMA'])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function spec(p: Record<string, any>, key: string): string {
  const values = p[key]
  if (Array.isArray(values) && values.length > 0) return String(values[0]).trim()
  return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: Record<string, any>): ScrapedProduct | null {
  const name = (String(p.productName ?? '')).trim()
  if (!name) return null

  const items = (p.items ?? []) as Record<string, unknown>[]
  if (!items.length) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sellers = ((items[0] as any).sellers ?? []) as Record<string, unknown>[]
  if (!sellers.length) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const offer = ((sellers[0] as any).commertialOffer ?? {}) as Record<string, number>

  // Skip products with no price (field absent, null, or zero)
  const salePrice = Number(offer.Price) || 0
  if (!salePrice || salePrice <= 0 || salePrice > 5_000_000) return null

  const price     = Math.round(salePrice)
  const listPrice = Number(offer.ListPrice) || 0
  const refPrice  = listPrice > salePrice ? Math.round(listPrice) : undefined
  const discount  = refPrice ? Math.round((1 - price / refPrice) * 100) : undefined
  const rawQty    = offer.AvailableQuantity
  const availability: ScrapedProduct['availability'] =
    rawQty === undefined ? 'available' : Number(rawQty) === 0 ? 'unavailable' : Number(rawQty) < 5 ? 'limited' : 'available'

  const presentation = extractPresentation(name)

  // unit_multiplier from Olimpica spec can mean pack size or volume — apply same
  // liquid/solid split as other VTEX scrapers.
  let quantity: number
  if (LIQUID_PRESENTATIONS.has(presentation)) {
    quantity = extractPackQuantity(name, presentation)
  } else {
    const raw = spec(p, 'unit_multiplier')
    const specQty = raw ? Math.round(parseFloat(raw)) : 0
    if (specQty >= 2 && specQty <= 1000) {
      quantity = specQty
    } else {
      quantity = extractPackQuantity(name, presentation)
    }
  }

  const brand       = (String(p.brand ?? '')).trim().toUpperCase()
  const isBrandName = Boolean(brand) && !GENERIC_BRANDS.has(brand)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstImage  = (items[0] as any).images?.[0]?.imageUrl as string | undefined

  return {
    pharmacyId:     'olimpica',
    productName:    name,
    type:           classify(!isBrandName, name),
    activeIngredient: name.split(/\s/)[0] ?? '',
    concentration:  extractConcentration(name),
    presentation,
    quantity:       Math.max(quantity, 1),
    price,
    pricePerUnit:   Math.round(price / Math.max(quantity, 1)),
    referencePrice: refPrice,
    discountPct:    discount,
    availability,
    url:      (p.link as string) || `https://www.olimpica.com/${p.linkText ?? ''}/p`,
    imageUrl: firstImage || undefined,
  }
}

export async function searchOlimpica(query: string): Promise<ScrapedProduct[]> {
  return withCache('olimpica', query, async () => {
    const results: ScrapedProduct[] = []
    let failed = false
    try {
      // Single page of 50 — enough for relevance and keeps the request fast.
      const params = new URLSearchParams({ ft: query, _from: '0', _to: '49' })
      const res = await fetch(`${SEARCH_URL}?${params}`, { headers: BASE_HEADERS, signal: AbortSignal.timeout(7_000) })
      if (res.status !== 200 && res.status !== 206) {
        failed = true
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const products = (await res.json()) as Record<string, any>[]
        if (Array.isArray(products)) {
          for (const p of products) {
            const product = mapProduct(p)
            if (product) results.push(product)
          }
        }
      }
    } catch (e) {
      console.error('[olimpica] Error:', e)
      if (results.length === 0) failed = true
    }
    if (failed) return null // failure -> serve stale cache

    const q = normalize(query)
    return results.filter(r =>
      normalize(r.productName).includes(q) || normalize(r.activeIngredient).includes(q)
    )
  })
}
