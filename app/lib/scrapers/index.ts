import type { PharmacyResult } from '@/app/types'
import type { ScrapedProduct } from './types'
import { searchFarmatodo }   from './farmatodo'
import { searchCruzVerde }   from './cruz_verde'
import { searchLaRebaja }    from './la_rebaja'
import { searchOlimpica }    from './olimpica'
import { searchColsubsidio } from './colsubsidio'
import { searchCafam }       from './cafam'

const PHARMACY_NAMES: Record<string, string> = {
  'farmatodo':   'Farmatodo',
  'cruz-verde':  'Cruz Verde',
  'la-rebaja':   'Drogas La Rebaja',
  'olimpica':    'Olimpica Drogueria',
  'colsubsidio': 'Drogueria Colsubsidio',
  'cafam':       'Cafam',
}

function hashId(pharmacyId: string, productName: string): string {
  const str = `${pharmacyId}:${productName}`
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
  }
  return (h >>> 0).toString(36)
}

function toPharmacyResult(p: ScrapedProduct, index: number): PharmacyResult {
  return {
    id:               `${hashId(p.pharmacyId, p.productName)}-${index}`,
    pharmacy:         PHARMACY_NAMES[p.pharmacyId] ?? p.pharmacyId,
    productName:      p.productName,
    type:             p.type,
    activeIngredient: p.activeIngredient,
    concentration:    p.concentration,
    presentation:     p.presentation,
    quantity:         p.quantity,
    price:            p.price,
    pricePerUnit:     p.pricePerUnit,
    availability:     p.availability,
    url:              p.url,
    discount:         p.discountPct,
    referencePrice:   p.referencePrice,
    imageUrl:         p.imageUrl,
  }
}

// Per-scraper budget: a source that exceeds it contributes nothing rather than
// holding up the whole response. Keeps total search time bounded (~10s worst
// case) instead of being dragged by the slowest source.
const SCRAPER_BUDGET_MS = 10_000

function withBudget(p: Promise<ScrapedProduct[]>, ms: number): Promise<ScrapedProduct[]> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve([]), ms)
    p.then(
      (v)  => { clearTimeout(t); resolve(v) },
      ()   => { clearTimeout(t); resolve([]) },
    )
  })
}

export async function searchAllPharmacies(query: string): Promise<PharmacyResult[]> {
  const lists = await Promise.all([
    withBudget(searchFarmatodo(query),   SCRAPER_BUDGET_MS),
    withBudget(searchCruzVerde(query),   SCRAPER_BUDGET_MS),
    withBudget(searchLaRebaja(query),    SCRAPER_BUDGET_MS),
    withBudget(searchOlimpica(query),    SCRAPER_BUDGET_MS),
    withBudget(searchColsubsidio(query), SCRAPER_BUDGET_MS),
    withBudget(searchCafam(query),       SCRAPER_BUDGET_MS),
  ])

  const all: PharmacyResult[] = []
  let idx = 0
  for (const list of lists) {
    all.push(...list.map((p) => toPharmacyResult(p, idx++)))
  }

  return all.sort((a, b) => a.price - b.price)
}
