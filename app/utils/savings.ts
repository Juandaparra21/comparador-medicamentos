import type { PharmacyResult } from '@/app/types'
import type { ProductGroup } from '@/app/utils/groupResults'

export interface BestSaving {
  group: ProductGroup
  cheapest: PharmacyResult
  dearest: PharmacyResult
  savings: number
}

// Ahorro real y comparable: SOLO entre el mismo producto exacto (mismos principio
// activo, concentracion, presentacion y cantidad) vendido en 2+ farmacias. Asi
// nunca comparamos productos distintos entre si. Tomamos el grupo con mayor
// ahorro y descartamos diferencias absurdas (> 3x), que casi siempre son errores
// de dato. Devuelve null si no hay un ahorro honesto que mostrar.
//
// Compartido por /buscar y por las paginas /precio para que ambas muestren
// exactamente la misma cifra con la misma regla.
export function findBestSaving(comparisons: ProductGroup[]): BestSaving | null {
  return (
    comparisons
      .filter((g) => g.availableCount >= 2 && g.savings > 1000)
      .map((g) => {
        const avail = g.results.filter((r) => r.availability !== 'unavailable')
        const cheapest = avail.reduce((m, r) => (r.price < m.price ? r : m))
        const dearest = avail.reduce((m, r) => (r.price > m.price ? r : m))
        return { group: g, cheapest, dearest, savings: dearest.price - cheapest.price }
      })
      .filter((s) => s.cheapest.pharmacy !== s.dearest.pharmacy && s.dearest.price <= s.cheapest.price * 3)
      .sort((a, b) => b.savings - a.savings)[0] ?? null
  )
}
