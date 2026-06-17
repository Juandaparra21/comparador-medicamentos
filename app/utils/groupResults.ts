import type { PharmacyResult } from '@/app/types'

export interface ProductGroup {
  key: string
  activeIngredient: string
  concentration: string
  presentation: string
  quantity: number
  imageUrl?: string
  results: PharmacyResult[]   // sorted: available cheapest first, unavailable last
  minPrice: number
  maxPrice: number
  savings: number
  availableCount: number
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '').trim()
}

function makeKey(r: PharmacyResult): string {
  const ing = norm(r.activeIngredient)
  if (!ing) return `__solo__${r.id}`
  return `${ing}|${r.concentration}|${norm(r.presentation)}|${r.quantity}`
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
    // Sort: available cheapest first, then limited, then unavailable
    const sorted = [...items].sort((a, b) => {
      const rank = (r: PharmacyResult) =>
        r.availability === 'unavailable' ? 2 : r.availability === 'limited' ? 1 : 0
      const dr = rank(a) - rank(b)
      if (dr !== 0) return dr
      return a.price - b.price
    })

    const avail  = sorted.filter(r => r.availability !== 'unavailable')
    const prices = avail.map(r => r.price)
    const min    = prices.length ? Math.min(...prices) : sorted[0].price
    const max    = prices.length ? Math.max(...prices) : sorted[0].price

    groups.push({
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

  // Most pharmacies first (best comparison), then by min price
  return groups.sort((a, b) =>
    b.availableCount !== a.availableCount
      ? b.availableCount - a.availableCount
      : a.minPrice - b.minPrice
  )
}
