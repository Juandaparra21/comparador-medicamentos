import type { PharmacyResult } from '@/app/types'

export type SortKey = 'price-asc' | 'price-desc' | 'unit-asc' | 'pharmacy-asc' | 'nearest'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price-asc',    label: 'Menor precio' },
  { value: 'price-desc',   label: 'Mayor precio' },
  { value: 'unit-asc',     label: 'Precio/unidad' },
  { value: 'pharmacy-asc', label: 'Farmacia A-Z' },
  { value: 'nearest',      label: 'Mas cercano' },
]

export const QUICK_SEARCHES = ['Acetaminofén', 'Ibuprofeno', 'Losartán', 'Metformina']

export function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '')
}

export function sortResults(
  results: PharmacyResult[],
  key: SortKey,
  distances?: Record<string, number>,
): PharmacyResult[] {
  return [...results].sort((a, b) => {
    if (key === 'nearest' && distances) {
      const da = distances[a.pharmacy] ?? Infinity
      const db = distances[b.pharmacy] ?? Infinity
      if (da !== db) return da - db
    }
    if (key === 'price-asc')  return a.price - b.price
    if (key === 'price-desc') return b.price - a.price
    if (key === 'unit-asc')   return a.pricePerUnit - b.pricePerUnit
    return a.pharmacy.localeCompare(b.pharmacy, 'es')
  })
}
