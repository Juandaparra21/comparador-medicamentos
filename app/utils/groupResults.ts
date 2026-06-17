import type { PharmacyResult } from '@/app/types'

export interface ProductGroup {
  key: string
  activeIngredient: string
  concentration: string
  presentation: string
  quantity: number
  brand: string
  imageUrl?: string
  /** All results sorted: cheapest available first, unavailable last */
  results: PharmacyResult[]
  minPrice: number
  maxPrice: number
  savings: number
  availableCount: number
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '').trim()
}

/**
 * Strips ingredient, concentration, quantity and presentation words from a
 * product name to isolate the manufacturer/brand label.
 * e.g. "IBUPROFENO COASPHARMA 400MG X 10 TABLETAS" → "coaspharma"
 */
function extractBrand(productName: string, activeIngredient: string): string {
  let s = norm(productName)

  // Remove active ingredient words
  const ing = norm(activeIngredient)
  if (ing) {
    s = s.replace(new RegExp(ing.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
  }

  // Remove concentration (e.g. 400mg, 500.5 mcg)
  s = s.replace(/\d+(?:[.,]\d+)?\s*(?:mg|g|ml|mcg|ui|%|ug)\b/g, '')

  // Remove quantity patterns (x10, x 10, 10 tabletas, 30 caps)
  s = s.replace(/\bx\s*\d+\b/g, '')
  s = s.replace(/\d+\s*(?:tabletas?|capsulas?|comprimidos?|ampollas?|jeringas?|unidades?|caps?|und)\b/g, '')
  s = s.replace(/\b\d+\b/g, '')

  // Remove presentation words
  s = s.replace(/\b(?:tabletas?|capsulas?|comprimidos?|ampollas?|jeringas?|plumas?|viales?|jarabe|suspen[sc]ion|solucion|crema|gel|pomada|spray|aerosol|gotas|polvo|supositorio|parche|ovulo|inyectable|encapsulado|refrigerado)\b/g, '')

  // Clean up — only letters remain
  return s.replace(/[^a-z]/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Returns a group key only when ALL required fields are present and non-empty,
 * AND including the extracted brand/lab so that Coaspharma ≠ Memphis.
 */
function makeKey(r: PharmacyResult): string {
  const ing   = norm(r.activeIngredient)
  const conc  = r.concentration.trim()
  const pres  = norm(r.presentation)
  const qty   = r.quantity
  const brand = extractBrand(r.productName, r.activeIngredient)

  // All four spec fields must be meaningful
  if (!ing || !conc || !pres || qty < 1) return `__solo__${r.id}`

  return `${ing}|${conc}|${pres}|${qty}|${brand}`
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
  /** Groups with 2+ pharmacies — true cross-pharmacy comparisons */
  comparisons: ProductGroup[]
  /** Results with no match in other pharmacies */
  singles: PharmacyResult[]
}

export function groupResults(results: PharmacyResult[]): GroupedResults {
  const map = new Map<string, PharmacyResult[]>()

  for (const r of results) {
    const key = makeKey(r)
    const arr = map.get(key) ?? []
    arr.push(r)
    map.set(key, arr)
  }

  const comparisons: ProductGroup[] = []
  const singles: PharmacyResult[]   = []

  for (const [key, items] of map.entries()) {
    const uniquePharmacies = new Set(items.map(r => r.pharmacy)).size
    if (key.startsWith('__solo__') || uniquePharmacies < 2) {
      singles.push(...items)
      continue
    }

    const sorted = sortItems(items)
    const avail  = sorted.filter(r => r.availability !== 'unavailable')
    const prices = avail.map(r => r.price)
    const min    = prices.length ? Math.min(...prices) : sorted[0].price
    const max    = prices.length ? Math.max(...prices) : sorted[0].price
    const brand  = extractBrand(items[0].productName, items[0].activeIngredient)

    comparisons.push({
      key,
      activeIngredient: items[0].activeIngredient,
      concentration:    items[0].concentration,
      presentation:     items[0].presentation,
      quantity:         items[0].quantity,
      brand,
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
