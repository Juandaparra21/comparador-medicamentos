import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, extractPackQuantity, LIQUID_PRESENTATIONS, classify, matchesQuery } from './utils'
import { withCache } from './cache'

const SEARCH_URL = 'https://www.larebajavirtual.com/api/catalog_system/pub/products/search/'
const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Origin': 'https://www.larebajavirtual.com',
  'Referer': 'https://www.larebajavirtual.com/',
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
  if (salePrice <= 0 || salePrice > 5_000_000) return null

  const price     = Math.round(salePrice)
  const listPrice = Number(offer.ListPrice) || 0
  const refPrice  = listPrice > salePrice ? Math.round(listPrice) : undefined
  const discount  = refPrice ? Math.round((1 - price / refPrice) * 100) : undefined
  const rawQty    = offer.AvailableQuantity
  const availability: ScrapedProduct['availability'] =
    rawQty === undefined ? 'available' : Number(rawQty) === 0 ? 'unavailable' : Number(rawQty) < 5 ? 'limited' : 'available'

  const ingredient = spec(p, 'Principio activo') || spec(p, 'Principio Activo') || name.split(/\s/)[0]

  // The "Presentacion" spec is frequently the packaging ("CAJA"), not the dosage
  // form. Prefer the form parsed from the name; only use the spec if it is itself
  // a real dosage form (running it through extractPresentation drops "caja" etc.).
  const presentation = extractPresentation(name) || extractPresentation(spec(p, 'Presentacion'))

  // Numeric part of the concentration (e.g. 500 from "500mg") so we can detect
  // when a spec wrongly reports the dose as the unit count.
  const concNum = parseInt(extractConcentration(name, presentation)) || 0

  // Cantidadunidadesmedida means different things per form:
  //  - volume forms (jarabe, crema, frasco): the ml/g CONTENT of one container
  //  - solids: the unit COUNT in the pack
  const specVal = parseInt(spec(p, 'Cantidadunidadesmedida')) || 0
  let quantity: number
  if (LIQUID_PRESENTATIONS.has(presentation)) {
    // Show the net content in ml/g. Cremas/lociones carry no ml in the name, so the
    // spec is the only source; prefer the name when it does state the volume.
    const fromName = extractPackQuantity(name, presentation)
    quantity = fromName > 1 ? fromName : (specVal >= 2 && specVal <= 5000 ? specVal : 1)
  } else {
    // Solids: trust the count only when sane and not just an echo of the dose number.
    if (specVal >= 2 && specVal <= 1000 && specVal !== concNum) {
      quantity = specVal
    } else {
      quantity = extractPackQuantity(name, presentation)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstImage = (items[0] as any).images?.[0]?.imageUrl as string | undefined

  return {
    pharmacyId:     'la-rebaja',
    productName:    name,
    type:           classify({ name }),
    activeIngredient: ingredient,
    concentration:  extractConcentration(name, presentation),
    presentation,
    quantity:       Math.max(quantity, 1),
    price,
    pricePerUnit:   Math.round(price / Math.max(quantity, 1)),
    referencePrice: refPrice,
    discountPct:    discount,
    availability,
    url:      (p.link as string) || `https://www.larebajavirtual.com/${p.linkText ?? ''}/p`,
    imageUrl: firstImage || undefined,
  }
}

export async function searchLaRebaja(query: string): Promise<ScrapedProduct[]> {
  return withCache('la-rebaja', query, async () => {
    const results: ScrapedProduct[] = []
    let failed = false
    try {
      // Single page of 50 is plenty for relevance and avoids a second sequential
      // round-trip (each request can take several seconds).
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
      console.error('[la-rebaja] Error:', e)
      if (results.length === 0) failed = true
    }
    if (failed) return null // failure -> serve stale cache

    return results.filter(r => matchesQuery(query, r.productName, r.activeIngredient))
  })
}
