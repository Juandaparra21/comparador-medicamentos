import type { PharmacyResult } from '@/app/types'

export interface ProductGroup {
  key: string
  activeIngredient: string
  concentration: string
  presentation: string
  quantity: number
  imageUrl?: string
  results: PharmacyResult[]   // sorted: cheapest available first, unavailable last
  minPrice: number
  maxPrice: number
  minPricePerUnit: number
  maxPricePerUnit: number
  savings: number
  availableCount: number
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '').trim()
}

/**
 * Produces a canonical key from a product name so that the same product
 * formatted differently across pharmacies maps to the same key, while
 * different brands/labs (Coaspharma vs Memphis) remain distinct.
 *
 * Steps:
 *  1. Lowercase + remove accents
 *  2. Join split number+unit → "400 mg" → "400mg"
 *  3. Normalize decimal: "400,5" → "400.5"
 *  4. REMOVE pack-quantity expressions ("x 10", "100 tabletas") so different pack
 *     sizes of the same product share a base key. The real pack size is added by
 *     the caller via the authoritative parsed quantity, not the (often absent or
 *     inconsistent) number in the name.
 *  5. Remove presentation noise words
 *  6. Split into tokens, sort alphabetically, rejoin
 *
 * Result: "IBUPROFENO COASPHARMA 400MG X 10 TABLETAS" →  "400mg|coaspharma|ibuprofeno"
 *         "IBUPROFENO MEMPHIS 400MG X 10 TABLETAS"    →  "400mg|ibuprofeno|memphis"
 */
function makeKey(productName: string): string {
  let s = norm(productName)

  // Join number + unit (handle "400 mg" → "400mg")
  s = s.replace(/(\d+(?:[.,]\d+)?)\s*(mg|g|ml|mcg|ui|ug|%|ui\/ml|mg\/ml)/g, (_, n, u) =>
    n.replace(',', '.') + u
  )

  // Drop pack-quantity expressions so a 10-pack and a 100-pack of the SAME product
  // (often named identically, e.g. "ACETAMINOFEN 500 MG (GENFAR)") get the same
  // base key instead of being merged on name alone. Order matters: multipliers
  // first, then "x N" (but never "x 500mg"), then "N tabletas".
  s = s.replace(/(\d+)\s*blisters?\s*(?:[x×]|de)\s*\d+/g, ' ')
  s = s.replace(/[x×]\s*\d+(?![a-z0-9])/g, ' ')
  s = s.replace(/\b\d+\s*(?:tabletas?|capsulas?|comprimidos?|pastillas?|grageas?|sobres?|unidades?|und)\b/g, ' ')

  // Strip packaging/presentation noise words
  s = s.replace(
    /\b(?:tabletas?|capsulas?|comprimidos?|ampollas?|jeringas?|plumas?|viales?|jarabe|suspen[sc]ion|solucion|crema|gel|pomada|spray|aerosol|gotas|polvo|supositorio|parche|ovulo|inyectable|encapsulado|refrigerado|frasco|fco|caja|blister|sobre|sachet|ampolleta|unidades?|und)\b/g,
    ' '
  )

  // Tokenize: keep alphanumeric tokens of length >= 1
  const tokens = s.split(/[\s\-\/,.()+]+/).filter(t => /[a-z0-9]/.test(t))

  // Sort for order-independence across pharmacy naming conventions
  tokens.sort()

  return tokens.join('|')
}

function sortItems(items: PharmacyResult[]): PharmacyResult[] {
  return [...items].sort((a, b) => {
    const rank = (r: PharmacyResult) =>
      r.availability === 'unavailable' ? 2 : r.availability === 'limited' ? 1 : 0
    const dr = rank(a) - rank(b)
    return dr !== 0 ? dr : a.price - b.price
  })
}

export interface GroupedResults {
  /** Groups with 2+ distinct pharmacies — true cross-pharmacy comparisons */
  comparisons: ProductGroup[]
  /** Results with no equivalent in another pharmacy */
  singles: PharmacyResult[]
}

function deduplicateByPharmacy(items: PharmacyResult[]): PharmacyResult[] {
  // When the same pharmacy lists the same product (same group key) more than once,
  // keep the best offer: available over out-of-stock, then cheapest per unit, then
  // cheapest total. Keeping the first-seen entry could surface a pricier or
  // out-of-stock duplicate and hide the real best price.
  const availRank = (r: PharmacyResult) =>
    r.availability === 'unavailable' ? 2 : r.availability === 'limited' ? 1 : 0
  const best = new Map<string, PharmacyResult>()
  for (const r of items) {
    const cur = best.get(r.pharmacy)
    if (
      !cur ||
      availRank(r) < availRank(cur) ||
      (availRank(r) === availRank(cur) && r.pricePerUnit < cur.pricePerUnit) ||
      (availRank(r) === availRank(cur) && r.pricePerUnit === cur.pricePerUnit && r.price < cur.price)
    ) {
      best.set(r.pharmacy, r)
    }
  }
  return [...best.values()]
}

export function groupResults(results: PharmacyResult[]): GroupedResults {
  const map = new Map<string, PharmacyResult[]>()

  for (const r of results) {
    const base = makeKey(r.productName)
    if (!base) continue
    // Pack size is authoritative and kept out of the text key, so append it here.
    // This separates a 10-pack from a 100-pack of the same product while still
    // grouping equal-size packs across pharmacies.
    const key = `${base}|q${r.quantity}`
    const arr = map.get(key) ?? []
    arr.push(r)
    map.set(key, arr)
  }

  const comparisons: ProductGroup[] = []
  const singles: PharmacyResult[]   = []

  for (const [key, items] of map.entries()) {
    // Deduplicate: one result per pharmacy per group
    const deduped = deduplicateByPharmacy(items)
    const uniquePharmacies = deduped.length

    if (uniquePharmacies < 2) {
      singles.push(...deduped)
      continue
    }

    const sorted = sortItems(deduped)
    const avail  = sorted.filter(r => r.availability !== 'unavailable')
    const prices = avail.map(r => r.price)
    const min    = prices.length ? Math.min(...prices) : sorted[0].price
    const max    = prices.length ? Math.max(...prices) : sorted[0].price
    const unitPrices = avail.map(r => r.pricePerUnit)
    const minUnit    = unitPrices.length ? Math.min(...unitPrices) : sorted[0].pricePerUnit
    const maxUnit    = unitPrices.length ? Math.max(...unitPrices) : sorted[0].pricePerUnit

    // Pick the richest representative for display fields
    const rep = deduped.find(r => r.activeIngredient) ?? deduped[0]

    comparisons.push({
      key,
      activeIngredient: rep.activeIngredient,
      concentration:    rep.concentration,
      presentation:     rep.presentation,
      quantity:         rep.quantity,
      imageUrl:         deduped.find(r => r.imageUrl)?.imageUrl,
      results:          sorted,
      minPrice:         min,
      maxPrice:         max,
      minPricePerUnit:  minUnit,
      maxPricePerUnit:  maxUnit,
      savings:          avail.length > 1 ? max - min : 0,
      availableCount:   avail.length,
    })
  }

  comparisons.sort((a, b) =>
    b.availableCount !== a.availableCount
      ? b.availableCount - a.availableCount
      : a.minPrice - b.minPrice
  )

  return { comparisons, singles }
}
