import type { PharmacyResult } from '@/app/types'

export interface ProductGroup {
  key: string
  activeIngredient: string
  concentration: string
  presentation: string
  quantity: number
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
 * Returns a group key only when ALL required fields are present and non-empty.
 * If any required field is missing the result cannot be reliably compared,
 * so it falls back to a solo key (never merged with other results).
 */
function makeKey(r: PharmacyResult): string {
  const ing  = norm(r.activeIngredient)
  const conc = r.concentration.trim()
  const pres = norm(r.presentation)
  const qty  = r.quantity

  // All four fields must be meaningful
  if (!ing || !conc || !pres || qty < 1) return `__solo__${r.id}`

  return `${ing}|${conc}|${pres}|${qty}`
}

function sortResults(items: PharmacyResult[]): PharmacyResult[] {
  return [...items].sort((a, b) => {
    const rank = (r: PharmacyResult) =>
      r.availability === 'unavailable' ? 2 : r.availability === 'limited' ? 1 : 0
    const dr = rank(a) - rank(b)
    return dr !== 0 ? dr : a.price - b.price
  })
}

export interface GroupedResults {
  /** Groups with 2+ pharmacies — these are true comparisons */
  comparisons: ProductGroup[]
  /** Results that have no match in other pharmacies — shown as regular cards */
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
    // Solo keys or only one pharmacy → individual card
    const uniquePharmacies = new Set(items.map(r => r.pharmacy)).size
    if (key.startsWith('__solo__') || uniquePharmacies < 2) {
      singles.push(...items)
      continue
    }

    const sorted = sortResults(items)
    const avail  = sorted.filter(r => r.availability !== 'unavailable')
    const prices = avail.map(r => r.price)
    const min    = prices.length ? Math.min(...prices) : sorted[0].price
    const max    = prices.length ? Math.max(...prices) : sorted[0].price

    comparisons.push({
      key,
      activeIngredient: items[0].activeIngredient,
      concentration:    items[0].concentration,
      presentation:     items[0].presentation,
      quantity:         items[0].quantity,
      imageUrl:         items.find(r => r.imageUrl)?.imageUrl,
      results:          sorted,
      minPrice:         min,
      maxPrice:         max,
      savings:          avail.length > 1 ? max - min : 0,
      availableCount:   avail.length,
    })
  }

  // Sort comparisons: most pharmacies first, then cheapest
  comparisons.sort((a, b) =>
    b.availableCount !== a.availableCount
      ? b.availableCount - a.availableCount
      : a.minPrice - b.minPrice
  )

  return { comparisons, singles }
}
