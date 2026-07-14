import type { PharmacyResult } from '@/app/types'
import type { ScrapedProduct } from './types'
import { normalize } from './utils'
import { searchFarmatodo }   from './farmatodo'
import { searchCruzVerde }   from './cruz_verde'
import { searchLaRebaja }    from './la_rebaja'
import { searchOlimpica }    from './olimpica'
import { searchColsubsidio } from './colsubsidio'
import { searchCafam }       from './cafam'
import { searchPasteur, searchFarmacenter, searchTuDrogueriaVirtual } from './vtex'

const SCRAPERS = [
  searchFarmatodo, searchCruzVerde, searchLaRebaja,
  searchOlimpica, searchColsubsidio, searchCafam,
  searchPasteur, searchFarmacenter, searchTuDrogueriaVirtual,
] as const

// Well-known Colombian brand -> active ingredient. Searching a brand also searches
// its generic, so "advil" returns generic ibuprofeno too. One direction only
// (ingredient searches already surface brands from the sources) to keep it cheap.
const BRAND_TO_INGREDIENT: Record<string, string> = {
  dolex:     'acetaminofen',
  winadol:   'acetaminofen',
  advil:     'ibuprofeno',
  motrin:    'ibuprofeno',
  apronax:   'naproxeno',
  flanax:    'naproxeno',
  voltaren:  'diclofenaco',
  cataflam:  'diclofenaco',
  aspirina:  'acido acetilsalicilico',
  clarityne: 'loratadina',
}

function expandQueries(query: string): string[] {
  const norm   = normalize(query)
  const tokens = norm.split(/\s+/).filter((t) => t.length >= 3)
  const main   = tokens.length ? tokens.reduce((a, b) => (b.length > a.length ? b : a)) : norm
  const ingredient = BRAND_TO_INGREDIENT[norm] ?? BRAND_TO_INGREDIENT[main]
  return ingredient ? [query, ingredient] : [query]
}

const PHARMACY_NAMES: Record<string, string> = {
  'farmatodo':   'Farmatodo',
  'cruz-verde':  'Cruz Verde',
  'la-rebaja':   'Drogas La Rebaja',
  'olimpica':    'Olimpica Drogueria',
  'colsubsidio': 'Drogueria Colsubsidio',
  'cafam':       'Cafam',
  'pasteur':             'Farmacia Pasteur',
  'farmacenter':         'Farmacenter',
  'tudrogueria-virtual': 'Tu Drogueria Virtual',
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
  const queries = expandQueries(query)

  // Every scraper for every query term, in parallel, each within its budget.
  const tasks = queries.flatMap((q) => SCRAPERS.map((s) => withBudget(s(q), SCRAPER_BUDGET_MS)))
  const lists = await Promise.all(tasks)

  // Dedup by pharmacy + product name (the same item can arrive from two terms).
  const seen = new Set<string>()
  const deduped: ScrapedProduct[] = []
  for (const list of lists) {
    for (const p of list) {
      const key = `${p.pharmacyId}::${normalize(p.productName)}`
      if (seen.has(key)) continue
      seen.add(key)
      deduped.push(p)
    }
  }

  return deduped
    .map((p, i) => toPharmacyResult(p, i))
    .sort((a, b) => a.price - b.price)
}
