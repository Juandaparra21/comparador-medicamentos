import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, classify, normalize } from './utils'

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
  const offer = ((sellers[0] as any).commertialOffer ?? {}) as Record<string, number>

  const salePrice = Number(offer.Price) || 0
  if (salePrice <= 0 || salePrice > 5_000_000) return null

  const price = Math.round(salePrice)
  const listPrice = Number(offer.ListPrice) || 0
  const refPrice = listPrice > salePrice ? Math.round(listPrice) : undefined
  const discount = refPrice ? Math.round((1 - price / refPrice) * 100) : undefined
  // AvailableQuantity absent means the API didn't report it — product in search results = assume available.
  const rawQty = offer.AvailableQuantity
  const availability: ScrapedProduct['availability'] =
    rawQty === undefined ? 'available' : Number(rawQty) === 0 ? 'unavailable' : Number(rawQty) < 5 ? 'limited' : 'available'

  const ingredient = spec(p, 'Principio activo') || spec(p, 'Principio Activo') || name.split(/\s/)[0]
  const presentation = spec(p, 'Presentacion') || extractPresentation(name)

  let quantity = 1
  const qtyStr = spec(p, 'Cantidadunidadesmedida')
  if (qtyStr) { const n = parseInt(qtyStr); if (n > 0) quantity = n }

  // La Rebaja indica RX con spec; no-RX tiende a ser genérico
  const isRx = spec(p, 'Producto RX').toUpperCase() === 'SI'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstImage = (items[0] as any).images?.[0]?.imageUrl as string | undefined

  return {
    pharmacyId: 'la-rebaja',
    productName: name,
    type: classify(!isRx, name),
    activeIngredient: ingredient,
    concentration: extractConcentration(name),
    presentation,
    quantity: Math.max(quantity, 1),
    price,
    pricePerUnit: Math.round(price / Math.max(quantity, 1)),
    referencePrice: refPrice,
    discountPct: discount,
    availability,
    url: (p.link as string) || `https://www.larebajavirtual.com/${p.linkText ?? ''}/p`,
    imageUrl: firstImage || undefined,
  }
}

export async function searchLaRebaja(query: string): Promise<ScrapedProduct[]> {
  const results: ScrapedProduct[] = []
  try {
    for (let offset = 0; offset < 100; offset += 50) {
      const params = new URLSearchParams({ ft: query, _from: String(offset), _to: String(offset + 49) })
      const res = await fetch(`${SEARCH_URL}?${params}`, { headers: BASE_HEADERS })
      if (res.status !== 200 && res.status !== 206) break
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const products = (await res.json()) as Record<string, any>[]
      if (!Array.isArray(products) || !products.length) break
      for (const p of products) {
        const product = mapProduct(p)
        if (product) results.push(product)
      }
      if (products.length < 50) break
    }
  } catch (e) {
    console.error('[la-rebaja] Error:', e)
  }

  const q = normalize(query)
  const filtered = results.filter(r =>
    normalize(r.productName).includes(q) || normalize(r.activeIngredient).includes(q)
  )
  console.log(`[la-rebaja] '${query}' -> ${filtered.length} productos`)
  return filtered
}
