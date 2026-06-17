import type { PharmacyResult } from '@/app/types'

export interface ProductGroup {
  key: string
  displayName: string
  activeIngredient: string
  concentration: string
  quantity: number
  presentation: string
  imageUrl?: string
  results: PharmacyResult[]  // sorted: available by price asc, unavailable last
  minPrice: number
  maxPrice: number
  savings: number
  pharmacyCount: number      // how many pharmacies carry it
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '').trim()
}

function makeKey(r: PharmacyResult): string {
  const ing = norm(r.activeIngredient)
  // Fall back to individual id if no ingredient — can't meaningfully group
  if (!ing) return `__solo__${r.id}`
  return `${ing}|${r.concentration}|${r.quantity}`
}

export function groupResults(results: PharmacyResult[]): ProductGroup[] {
  const map = new Map<string, PharmacyResult[]>()

  for (const r of results) {
    const key = makeKey(r)
    const arr = map.get(key) ?? []
    arr.push(r)
    map.set(key, arr)
  }

  const groups: ProductGroup[] = []

  for (const [key, items] of map.entries()) {
    const sorted = [...items].sort((a, b) => {
      const aUnavail = a.availability === 'unavailable' ? 1 : 0
      const bUnavail = b.availability === 'unavailable' ? 1 : 0
      if (aUnavail !== bUnavail) return aUnavail - bUnavail
      return a.price - b.price
    })

    const available = sorted.filter(r => r.availability !== 'unavailable')
    const prices    = available.map(r => r.price)
    const minPrice  = prices.length ? Math.min(...prices) : sorted[0].price
    const maxPrice  = prices.length ? Math.max(...prices) : sorted[0].price

    // Pick shortest product name as display (usually the cleanest generic name)
    const displayName = items.reduce(
      (best, r) => r.productName.length < best.length ? r.productName : best,
      items[0].productName,
    )

    groups.push({
      key,
      displayName,
      activeIngredient: items[0].activeIngredient,
      concentration:    items[0].concentration,
      quantity:         items[0].quantity,
      presentation:     items[0].presentation,
      imageUrl:         items.find(r => r.imageUrl)?.imageUrl,
      results:          sorted,
      minPrice,
      maxPrice,
      savings:          available.length > 1 ? maxPrice - minPrice : 0,
      pharmacyCount:    available.length,
    })
  }

  // Sort groups: most pharmacies first (best comparison opportunity), then by min price
  return groups.sort((a, b) => {
    if (b.pharmacyCount !== a.pharmacyCount) return b.pharmacyCount - a.pharmacyCount
    return a.minPrice - b.minPrice
  })
}
