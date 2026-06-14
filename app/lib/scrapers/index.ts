import type { PharmacyResult } from '@/app/types'
import type { ScrapedProduct } from './types'
import { searchFarmatodo } from './farmatodo'
import { searchCruzVerde } from './cruz_verde'
import { searchLaRebaja } from './la_rebaja'
import { searchOlimpica } from './olimpica'

const PHARMACY_NAMES: Record<string, string> = {
  'farmatodo':  'Farmatodo',
  'cruz-verde': 'Cruz Verde',
  'la-rebaja':  'Drogas La Rebaja',
  'olimpica':   'Olimpica Drogueria',
}

function hashId(pharmacyId: string, productName: string): string {
  const str = `${pharmacyId}:${productName}`
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
  }
  return (h >>> 0).toString(36)
}

function toPharmacyResult(p: ScrapedProduct): PharmacyResult {
  return {
    id: hashId(p.pharmacyId, p.productName),
    pharmacy: PHARMACY_NAMES[p.pharmacyId] ?? p.pharmacyId,
    productName: p.productName,
    type: p.type,
    activeIngredient: p.activeIngredient,
    concentration: p.concentration,
    presentation: p.presentation,
    quantity: p.quantity,
    price: p.price,
    pricePerUnit: p.pricePerUnit,
    availability: p.availability,
    url: p.url,
    discount: p.discountPct,
    referencePrice: p.referencePrice,
  }
}

export async function searchAllPharmacies(query: string): Promise<PharmacyResult[]> {
  const settled = await Promise.allSettled([
    searchFarmatodo(query),
    searchCruzVerde(query),
    searchLaRebaja(query),
    searchOlimpica(query),
  ])

  const all: PharmacyResult[] = []
  for (const result of settled) {
    if (result.status === 'fulfilled') {
      all.push(...result.value.map(toPharmacyResult))
    }
  }

  return all.sort((a, b) => a.price - b.price)
}
