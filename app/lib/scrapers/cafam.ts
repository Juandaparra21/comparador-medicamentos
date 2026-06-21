import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, extractPackQuantity, classify, normalize } from './utils'

const SEARCH_URL = 'https://www.drogueriascafam.com.co/index.php'
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept':     'application/json, text/javascript, */*',
  'Referer':    'https://www.drogueriascafam.com.co/',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: Record<string, any>): ScrapedProduct | null {
  const name = String(p.name ?? '').trim()
  if (!name) return null

  const catalogPrice = Number(p.price_amount) || 0
  if (catalogPrice <= 0 || catalogPrice > 5_000_000) return null

  // Cafam's PrestaShop search API returns the catalog price without applying
  // the visitor-group reduction (10% off). The product pages show the reduced
  // price. Apply the factor so our price matches what users actually pay.
  const CAFAM_GROUP_REDUCTION = 0.9
  const price    = Math.round(catalogPrice * CAFAM_GROUP_REDUCTION)
  const refPrice = Math.round(catalogPrice)
  const discount = 10

  const presentation = extractPresentation(name)
  const quantity     = extractPackQuantity(name, presentation)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imgSizes = (p.cover?.bySize ?? {}) as Record<string, any>
  const imageUrl =
    imgSizes.home_default?.url   ??
    imgSizes.medium_default?.url ??
    imgSizes.cart_default?.url   ??
    imgSizes.small_default?.url  as string | undefined

  return {
    pharmacyId:       'cafam',
    productName:      name,
    type:             classify(false, name),
    activeIngredient: name.split(/\s/)[0] ?? '',
    concentration:    extractConcentration(name),
    presentation,
    quantity:         Math.max(quantity, 1),
    price:            Math.round(price),
    pricePerUnit:     Math.round(price / Math.max(quantity, 1)),
    referencePrice:   refPrice,
    discountPct:      discount,
    availability:     'available',
    url:              String(p.canonical_url ?? p.url ?? ''),
    imageUrl:         imageUrl ?? undefined,
  }
}

export async function searchCafam(query: string): Promise<ScrapedProduct[]> {
  const results: ScrapedProduct[] = []
  try {
    const params = new URLSearchParams({
      controller:     'search',
      s:              query,
      ajax:           '1',
      resultsPerPage: '48',
    })
    const res = await fetch(`${SEARCH_URL}?${params}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(7_000),
    })
    if (!res.ok) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = (data.products ?? []) as Record<string, any>[]
    for (const p of products) {
      const product = mapProduct(p)
      if (product) results.push(product)
    }
  } catch (e) {
    console.error('[cafam] Error:', e)
  }

  const q        = normalize(query)
  const filtered = results.filter(r =>
    normalize(r.productName).includes(q) || normalize(r.activeIngredient).includes(q)
  )
  console.log(`[cafam] '${query}' -> ${filtered.length} productos`)
  return filtered
}
