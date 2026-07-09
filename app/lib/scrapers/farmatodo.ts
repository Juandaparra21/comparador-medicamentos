import type { ScrapedProduct } from './types'
import {
  extractConcentration,
  extractPresentation,
  extractPackQuantity,
  LIQUID_PRESENTATIONS,
  classify,
  matchesQuery,
} from './utils'
import { withCache } from './cache'

const ALGOLIA_URL = 'https://api-search.farmatodo.com/1/indexes/products/query'
const ALGOLIA_HEADERS = {
  'x-algolia-api-key':        'eb9544fe7bfe7ec4c1aa5e5bf7740feb',
  'x-algolia-application-id': 'VCOJEYD2PO',
  'content-type':             'application/json',
  'accept':                   'application/json',
}

// Fallback host if the custom proxy is down
const ALGOLIA_FALLBACK = 'https://VCOJEYD2PO-dsn.algolia.net/1/indexes/products/query'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapHit(hit: Record<string, any>): ScrapedProduct | null {
  const name = String(hit.description ?? hit.mediaDescription ?? '').trim()
  if (!name) return null

  const fullPrice  = Number(hit.fullPrice)  || 0
  // offerPrice in Algolia can be stale (expired promotions) — always use fullPrice
  // as the primary price to match what the user will actually pay on the site.
  const price = Math.round(fullPrice)
  if (price <= 0 || price > 5_000_000) return null

  let discount: number | undefined
  const offerText = String(hit.offerText ?? '').trim()
  const dm = offerText.match(/(\d+)/)
  if (dm) discount = parseInt(dm[1])

  const largDesc = String(hit.large_description ?? '')
  const supDesc  = String(hit.sup_description  ?? '')

  let ingredient = ''
  if (largDesc) {
    const m = largDesc.match(/Principio\s+Activo:\s*(.+?)(?:\s*\d|\s*$)/i)
    if (m) ingredient = m[1].trim()
  }
  if (!ingredient && supDesc) ingredient = supDesc.split(/\s/)[0]?.trim() ?? ''
  if (!ingredient) ingredient = name.split(/\s/)[0] ?? ''

  const presentation = extractPresentation(name)
  const pumQty = Number(hit.measurePum) || 0
  if (hit.measurePum == null && !LIQUID_PRESENTATIONS.has(presentation) && presentation !== '') {
    return null
  }
  const quantity = pumQty >= 2 ? pumQty : extractPackQuantity(name, presentation)

  const withoutStock = Boolean(hit.without_stock ?? false)
  const stock        = parseInt(String(hit.stock ?? 0)) || 0
  let availability: ScrapedProduct['availability'] = 'available'
  if (withoutStock) availability = 'unavailable'
  else if (stock > 0 && stock < 5) availability = 'limited'

  const productId = String(hit.id ?? '')
  const imageUrl  = String(hit.mediaImageUrl ?? hit.imageURL ?? '')

  // hit.url contains the pre-built slug: "{id}-{slug}" (e.g. "1004009-ibuprofeno-genfar-800mg-...").
  // Fall back to generating it from the product name when the field is absent.
  const urlSlug = hit.url
    ? String(hit.url)
    : productId
    ? `${productId}-${toSlug(name)}`
    : ''

  return {
    pharmacyId:       'farmatodo',
    productName:      name,
    type:             classify({ name, isGeneric: Boolean(hit.isGeneric || hit.generic) }),
    activeIngredient: ingredient,
    concentration:    extractConcentration(name, presentation),
    presentation,
    quantity:         Math.max(quantity, 1),
    price,
    pricePerUnit:     Math.round(price / Math.max(quantity, 1)),
    referencePrice:   undefined,
    discountPct:      discount,
    availability,
    url:      urlSlug ? `https://www.farmatodo.com.co/producto/${urlSlug}` : '',
    imageUrl: imageUrl || undefined,
  }
}

async function queryAlgolia(url: string, query: string): Promise<ScrapedProduct[] | null> {
  const res = await fetch(url, {
    method:  'POST',
    headers: ALGOLIA_HEADERS,
    body: JSON.stringify({
      query,
      hitsPerPage: 60,
      filters: "categorie:'Salud y medicamentos' OR subCategory:'Drogueria'",
    }),
    signal: AbortSignal.timeout(7_000),
  })
  if (!res.ok) return null
  const data = await res.json() as { hits?: Record<string, unknown>[] }
  if (!Array.isArray(data.hits)) return null
  return data.hits.flatMap(h => {
    const p = mapHit(h as Record<string, unknown>)
    return p ? [p] : []
  })
}

export async function searchFarmatodo(query: string): Promise<ScrapedProduct[]> {
  return withCache('farmatodo', query, async () => {
    try {
      // Try primary host first, fall back to standard Algolia DSN
      let hits = await queryAlgolia(ALGOLIA_URL, query)
      if (!hits) hits = await queryAlgolia(ALGOLIA_FALLBACK, query)
      if (!hits) {
        console.error('[farmatodo] Both Algolia hosts failed')
        return null // failure -> serve stale cache
      }

      return hits.filter(r => matchesQuery(query, r.productName, r.activeIngredient))
    } catch (e) {
      console.error('[farmatodo] Error:', e)
      return null
    }
  })
}
