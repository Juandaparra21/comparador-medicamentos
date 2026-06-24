import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, extractPackQuantity, LIQUID_PRESENTATIONS, classify, normalize } from './utils'
import { withCache } from './cache'

const SEARCH_URL = 'https://colsubsidio.myvtex.com/api/catalog_system/pub/products/search/'
const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Origin': 'https://tienda.colsubsidio.com',
  'Referer': 'https://tienda.colsubsidio.com/',
}

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

  const salePrice = Number(offer.Price) || 0
  if (!salePrice || salePrice <= 0 || salePrice > 5_000_000) return null

  const price     = Math.round(salePrice)
  const listPrice = Number(offer.ListPrice) || 0
  const refPrice  = listPrice > salePrice ? Math.round(listPrice) : undefined
  const discount  = refPrice ? Math.round((1 - price / refPrice) * 100) : undefined
  const rawQty    = offer.AvailableQuantity
  const availability: ScrapedProduct['availability'] =
    rawQty === undefined ? 'available' : Number(rawQty) === 0 ? 'unavailable' : Number(rawQty) < 5 ? 'limited' : 'available'

  // Colsubsidio myvtex fields use accented field names
  const ingredient     = spec(p, 'Principio Activo') || name.split(/\s/)[0]
  const presentation   = extractPresentation(name)
  // Presentación contains pack description e.g. "BLISTER X 10 TAB", "FRASCO X 120 ML"
  const specPresent    = spec(p, 'Presentación')

  let quantity: number
  if (LIQUID_PRESENTATIONS.has(presentation)) {
    // For liquids, look for ml in the name or spec presentation
    quantity = extractPackQuantity(specPresent || name, presentation)
    if (quantity <= 1) quantity = extractPackQuantity(name, presentation)
  } else {
    // For solids, extract from the pack description (e.g. "BLISTER X 10 TAB" → 10)
    const fromSpec = specPresent ? extractPackQuantity(specPresent, presentation) : 0
    quantity = fromSpec >= 2 ? fromSpec : extractPackQuantity(name, presentation)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstImage = (items[0] as any).images?.[0]?.imageUrl as string | undefined
  const linkText   = String(p.linkText ?? p.productId ?? '')

  return {
    pharmacyId:     'colsubsidio',
    productName:    name,
    type:           classify(false, name),
    activeIngredient: ingredient,
    concentration:  extractConcentration(name),
    presentation,
    quantity:       Math.max(quantity, 1),
    price,
    pricePerUnit:   Math.round(price / Math.max(quantity, 1)),
    referencePrice: refPrice,
    discountPct:    discount,
    availability,
    url:      linkText ? `https://www.drogueriascolsubsidio.com/${linkText}/p` : '',
    imageUrl: firstImage || undefined,
  }
}

export async function searchColsubsidio(query: string): Promise<ScrapedProduct[]> {
  return withCache('colsubsidio', query, async () => {
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
      console.error('[colsubsidio] Error:', e)
      if (results.length === 0) failed = true
    }
    if (failed) return null // failure -> serve stale cache

    const q = normalize(query)
    return results.filter(r =>
      normalize(r.productName).includes(q) || normalize(r.activeIngredient).includes(q)
    )
  })
}
