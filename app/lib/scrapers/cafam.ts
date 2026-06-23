import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, extractPackQuantity, classify, normalize } from './utils'
import { getCache, setCache } from './cache'

const BASE = 'https://www.drogueriascafam.com.co'

// Full Chrome-like headers: Cafam is behind Cloudflare, which is stricter with
// datacenter IPs (e.g. Vercel). A complete, consistent browser fingerprint gives
// the best chance of getting JSON instead of a bot challenge.
const SEARCH_HEADERS = {
  'User-Agent':         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept':             'application/json, text/javascript, */*; q=0.01',
  'Accept-Language':    'es-CO,es;q=0.9,en;q=0.8',
  'X-Requested-With':   'XMLHttpRequest',
  'sec-ch-ua':          '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  'sec-ch-ua-mobile':   '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest':     'empty',
  'sec-fetch-mode':     'cors',
  'sec-fetch-site':     'same-origin',
  'Referer':            `${BASE}/`,
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

// Single search request (no retry): Cafam is the slowest source, so keep it
// within the per-scraper budget instead of retrying and dragging the whole
// search. Cloudflare challenges are detected (non-JSON) and just skip Cafam.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchSearchJSON(query: string): Promise<Record<string, any> | null> {
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
    console.error('[cafam] search failed:', (e as Error).message)
    return null
  }
}

export async function searchCafam(query: string): Promise<ScrapedProduct[]> {
  const cacheKey = normalize(query)

  // Fast path: recent cache avoids hitting Cafam/Cloudflare at all.
  const cached = await getCache('cafam', cacheKey)
  if (cached?.fresh) {
    console.log(`[cafam] '${query}' -> ${cached.results.length} (cache)`)
    return cached.results
  }

  const data = await fetchSearchJSON(query)
  if (!data) {
    // Live request failed (Cloudflare/timeout). Serve stale cache so Cafam does
    // not vanish from results just because one request got blocked.
    if (cached) {
      console.log(`[cafam] '${query}' -> ${cached.results.length} (stale cache; live failed)`)
      return cached.results
    }
    return []
  }

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

  await setCache('cafam', cacheKey, matched)
  console.log(`[cafam] '${query}' -> ${matched.length} productos`)
  return matched
}
