import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, extractPackQuantity, LIQUID_PRESENTATIONS, classify, normalize } from './utils'

const ALGOLIA_URL = 'https://api-search.farmatodo.com/1/indexes/products/query'
const ALGOLIA_HEADERS = {
  'x-algolia-api-key': 'eb9544fe7bfe7ec4c1aa5e5bf7740feb',
  'x-algolia-application-id': 'VCOJEYD2PO',
  'content-type': 'application/json',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapHit(hit: Record<string, any>): ScrapedProduct | null {
  const name = (String(hit.description ?? hit.mediaDescription ?? '')).trim()
  if (!name) return null

  const fullPrice  = Number(hit.fullPrice)  || 0
  const offerPrice = Number(hit.offerPrice) || 0
  const offerText  = String(hit.offerText ?? '').trim()

  // offerPrice with offer=false and no offerText is a "Farmatodo Club" member price,
  // NOT a public promotional price. Only use offerPrice when there is explicit offer text.
  const hasPublicOffer = offerText.length > 0 && offerPrice > 0 && offerPrice < fullPrice
  const price    = hasPublicOffer ? Math.round(offerPrice) : Math.round(fullPrice)
  const refPrice = hasPublicOffer ? Math.round(fullPrice)  : undefined
  if (price <= 0 || price > 5_000_000) return null

  let discount: number | undefined
  const dm = offerText.match(/(\d+)/)
  if (dm) discount = parseInt(dm[1])
  if (!discount && refPrice) discount = Math.round((1 - price / refPrice) * 100)

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
  // measurePum stores the pack unit count (ml for liquids, tablets for solids).
  // Colombian law (Circular 04/2018) requires pharmacies to report PUM for all
  // current products. Solid products missing measurePum are stale catalog entries
  // that may have broken URLs — filter them out.
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

  return {
    pharmacyId:     'farmatodo',
    productName:    name,
    type:           classify(Boolean(hit.isGeneric || hit.generic), name),
    activeIngredient: ingredient,
    concentration:  extractConcentration(name),
    presentation,
    quantity:       Math.max(quantity, 1),
    price,
    pricePerUnit:   Math.round(price / Math.max(quantity, 1)),
    referencePrice: refPrice,
    discountPct:    discount,
    availability,
    url:       productId ? `https://www.farmatodo.com.co/product/${productId}` : '',
    imageUrl:  imageUrl || undefined,
  }
}

export async function searchFarmatodo(query: string): Promise<ScrapedProduct[]> {
  try {
    const res = await fetch(ALGOLIA_URL, {
      method: 'POST',
      headers: ALGOLIA_HEADERS,
      body: JSON.stringify({
        query,
        hitsPerPage: 60,
        filters: "categorie:'Salud y medicamentos' OR subCategory:'Drogueria'",
      }),
    })
    const data = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hits    = (data.hits ?? []) as Record<string, any>[]
    const all     = hits.flatMap(h => { const p = mapHit(h); return p ? [p] : [] })
    const q       = normalize(query)
    const results = all.filter(r =>
      normalize(r.productName).includes(q) || normalize(r.activeIngredient).includes(q)
    )
    console.log(`[farmatodo] '${query}' -> ${results.length} productos`)
    return results
  } catch (e) {
    console.error('[farmatodo] Error:', e)
    return []
  }
}
