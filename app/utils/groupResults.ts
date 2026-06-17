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
 *  4. Collapse "x 10" / "× 10" quantity prefixes → just the number
 *  5. Remove presentation noise words
 *  6. Split into tokens, sort alphabetically, rejoin
 *
 * Result: "IBUPROFENO COASPHARMA 400MG X 10 TABLETAS" →  "10|400mg|coaspharma|ibuprofeno"
 *         "IBUPROFENO MEMPHIS 400MG X 10 TABLETAS"    →  "10|400mg|ibuprofeno|memphis"
 */
function makeKey(productName: string): string {
  let s = norm(productName)

  // Join number + unit (handle "400 mg" → "400mg")
  s = s.replace(/(\d+(?:[.,]\d+)?)\s*(mg|g|ml|mcg|ui|ug|%|ui\/ml|mg\/ml)/g, (_, n, u) =>
    n.replace(',', '.') + u
  )

  // Normalize quantity prefix: x10, x 10, ×10 → just the number
  s = s.replace(/[x×]\s*(\d+)/g, ' $1 ')

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

export function groupResults(results: PharmacyResult[]): GroupedResults {
  const map = new Map<string, PharmacyResult[]>()

  for (const r of results) {
    const key = makeKey(r.productName)
    if (!key) continue
    const arr = map.get(key) ?? []
    arr.push(r)
    map.set(key, arr)
  }

  const comparisons: ProductGroup[] = []
  const singles: PharmacyResult[]   = []

  for (const [key, items] of map.entries()) {
    const uniquePharmacies = new Set(items.map(r => r.pharmacy)).size

    if (uniquePharmacies < 2) {
      singles.push(...items)
      continue
    }

    const sorted = sortItems(items)
    const avail  = sorted.filter(r => r.availability !== 'unavailable')
    const prices = avail.map(r => r.price)
    const min    = prices.length ? Math.min(...prices) : sorted[0].price
    const max    = prices.length ? Math.max(...prices) : sorted[0].price

    // Pick the richest representative for display fields
    const rep = items.find(r => r.activeIngredient) ?? items[0]

    comparisons.push({
      key,
      activeIngredient: rep.activeIngredient,
      concentration:    rep.concentration,
      presentation:     rep.presentation,
      quantity:         rep.quantity,
      imageUrl:         items.find(r => r.imageUrl)?.imageUrl,
      results:          sorted,
      minPrice:         min,
      maxPrice:         max,
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
