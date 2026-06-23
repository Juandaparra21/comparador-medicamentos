import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, extractPackQuantity, classify, normalize } from './utils'

const BASE = 'https://www.drogueriascafam.com.co'

const SEARCH_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept':          'application/json, text/javascript, */*',
  'Accept-Language': 'es-CO,es;q=0.9',
  'Referer':         `${BASE}/`,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: Record<string, any>): ScrapedProduct | null {
  const name = String(p.name ?? '').trim()
  if (!name) return null

  // price_amount is the final price Cafam shows (verified to match the product
  // page). regular_price_amount is the pre-discount price. Both come straight
  // from Cafam's own search API — no fabricated discounts.
  const price = Number(p.price_amount) || 0
  if (price <= 0 || price > 5_000_000) return null

  const regular     = Number(p.regular_price_amount) || 0
  const hasDiscount = Boolean(p.has_discount) && regular > price
  const referencePrice = hasDiscount ? regular : undefined
  const discountPct    = hasDiscount ? Math.round((1 - price / regular) * 100) : undefined

  const presentation = extractPresentation(name)
  const quantity     = Math.max(extractPackQuantity(name, presentation), 1)

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
    quantity,
    price:            Math.round(price),
    pricePerUnit:     Math.round(price / quantity),
    referencePrice,
    discountPct,
    availability:     'available',
    url:              String(p.canonical_url ?? p.url ?? ''),
    imageUrl:         imageUrl ?? undefined,
  }
}

// Single search request, hardened: Cloudflare occasionally serves an HTML
// challenge instead of JSON, so detect non-JSON and retry once before giving up.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchSearchJSON(query: string, attempt = 0): Promise<Record<string, any> | null> {
  try {
    const params = new URLSearchParams({
      controller:     'search',
      s:              query,
      ajax:           '1',
      resultsPerPage: '24',
    })
    const res = await fetch(`${BASE}/index.php?${params}`, {
      headers: SEARCH_HEADERS,
      signal:  AbortSignal.timeout(9_000),
    })
    if (!res.ok) throw new Error(`status ${res.status}`)

    const text = await res.text()
    if (!text.trimStart().startsWith('{')) throw new Error('non-JSON response (Cloudflare?)')
    return JSON.parse(text)
  } catch (e) {
    if (attempt < 1) {
      await new Promise((r) => setTimeout(r, 600))
      return fetchSearchJSON(query, attempt + 1)
    }
    console.error('[cafam] search failed:', (e as Error).message)
    return null
  }
}

export async function searchCafam(query: string): Promise<ScrapedProduct[]> {
  const data = await fetchSearchJSON(query)
  if (!data) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (data.products ?? []) as Record<string, any>[]
  const products: ScrapedProduct[] = []
  for (const p of raw) {
    const product = mapProduct(p)
    if (product) products.push(product)
  }

  const q = normalize(query)
  const matched = products.filter((r) =>
    normalize(r.productName).includes(q) || normalize(r.activeIngredient).includes(q),
  )

  console.log(`[cafam] '${query}' -> ${matched.length} productos`)
  return matched
}
