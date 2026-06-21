import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, extractPackQuantity, classify, normalize } from './utils'

const BASE = 'https://www.drogueriascafam.com.co'

const SEARCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept':     'application/json, text/javascript, */*',
  'Referer':    `${BASE}/`,
}

const PAGE_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9',
  'Referer':         `${BASE}/`,
}

interface PagePrice {
  price:     number
  available: boolean
  refPrice?: number
  discount?: number
}

async function fetchPagePrice(url: string): Promise<PagePrice | null> {
  try {
    const res = await fetch(url, {
      headers: PAGE_HEADERS,
      signal:  AbortSignal.timeout(5_000),
    })
    if (!res.ok) return null
    const html = await res.text()

    // <span itemprop="price" content="25550">$ 22.995</span>
    // The displayed text is the real price (includes group/promo reductions).
    const m = html.match(/itemprop="price"\s+content="(\d+)"[^>]*>\s*\$\s*([\d. ]+)/)
    if (!m) return null

    const catalogPrice  = parseInt(m[1])
    const displayedText = m[2].replace(/\s/g, '').replace(/\./g, '')
    const displayedPrice = parseInt(displayedText)
    if (!displayedPrice || displayedPrice <= 0) return null

    const avail = html.match(/itemprop="availability"\s+href="https:\/\/schema\.org\/(InStock|OutOfStock)"/)
    const available = avail?.[1] !== 'OutOfStock'

    const hasDiscount  = html.includes('has-discount') && displayedPrice < catalogPrice
    const refPrice     = hasDiscount ? catalogPrice : undefined
    const discountPct  = hasDiscount ? Math.round((1 - displayedPrice / catalogPrice) * 100) : undefined

    return { price: displayedPrice, available, refPrice, discount: discountPct }
  } catch {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: Record<string, any>): ScrapedProduct | null {
  const name = String(p.name ?? '').trim()
  if (!name) return null

  const catalogPrice = Number(p.price_amount) || 0
  if (catalogPrice <= 0 || catalogPrice > 5_000_000) return null

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
    price:            Math.round(catalogPrice),
    pricePerUnit:     Math.round(catalogPrice / Math.max(quantity, 1)),
    referencePrice:   undefined,
    discountPct:      undefined,
    availability:     'available',
    url:              String(p.canonical_url ?? p.url ?? ''),
    imageUrl:         imageUrl ?? undefined,
  }
}

export async function searchCafam(query: string): Promise<ScrapedProduct[]> {
  let products: ScrapedProduct[] = []
  try {
    const params = new URLSearchParams({
      controller:     'search',
      s:              query,
      ajax:           '1',
      resultsPerPage: '20',
    })
    const res = await fetch(`${BASE}/index.php?${params}`, {
      headers: SEARCH_HEADERS,
      signal:  AbortSignal.timeout(7_000),
    })
    if (!res.ok) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw  = (data.products ?? []) as Record<string, any>[]
    for (const p of raw) {
      const product = mapProduct(p)
      if (product) products.push(product)
    }
  } catch (e) {
    console.error('[cafam] search error:', e)
    return []
  }

  // Filter by query relevance before fetching pages
  const q       = normalize(query)
  const matched = products.filter(r =>
    normalize(r.productName).includes(q) || normalize(r.activeIngredient).includes(q)
  )

  // Fetch real prices from product pages in parallel (max 10 to limit latency)
  const batch = matched.slice(0, 10)
  const pageResults = await Promise.all(
    batch.map(p => p.url ? fetchPagePrice(p.url) : Promise.resolve(null))
  )

  const final = batch.map((p, i) => {
    const real = pageResults[i]
    if (!real) return p
    const qty = Math.max(p.quantity, 1)
    return {
      ...p,
      price:          real.price,
      pricePerUnit:   Math.round(real.price / qty),
      referencePrice: real.refPrice,
      discountPct:    real.discount,
      availability:   real.available ? p.availability : ('unavailable' as const),
    }
  })

  console.log(`[cafam] '${query}' -> ${final.length} productos (${pageResults.filter(Boolean).length} con precio real)`)
  return final
}
