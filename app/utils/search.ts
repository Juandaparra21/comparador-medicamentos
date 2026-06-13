import type { PharmacyResult } from '@/app/types'

export type SortKey = 'price-asc' | 'price-desc' | 'unit-asc' | 'pharmacy-asc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price-asc',    label: 'Menor precio' },
  { value: 'price-desc',   label: 'Mayor precio' },
  { value: 'unit-asc',     label: 'Precio/unidad' },
  { value: 'pharmacy-asc', label: 'Farmacia A-Z' },
]

export const QUICK_SEARCHES = ['Acetaminofén', 'Ibuprofeno', 'Losartán', 'Metformina']

export const MOCK_DATA: PharmacyResult[] = [
  { id: '1',  pharmacy: 'Drogas La Rebaja', productName: 'Dolex Forte',           activeIngredient: 'Acetaminofén', concentration: '500mg', presentation: 'Tableta', quantity: 10, price: 2800,  pricePerUnit: 280,  availability: 'available',   url: '#' },
  { id: '2',  pharmacy: 'Cruz Verde',       productName: 'Tylenol 500',            activeIngredient: 'Acetaminofén', concentration: '500mg', presentation: 'Tableta', quantity: 10, price: 5200,  pricePerUnit: 520,  availability: 'available',   url: '#' },
  { id: '3',  pharmacy: 'Colsubsidio',      productName: 'Acetaminofén Genfar',    activeIngredient: 'Acetaminofén', concentration: '500mg', presentation: 'Tableta', quantity: 10, price: 1900,  pricePerUnit: 190,  availability: 'available',   url: '#' },
  { id: '4',  pharmacy: 'Cafam',            productName: 'Acetaminofén MK',        activeIngredient: 'Acetaminofén', concentration: '500mg', presentation: 'Tableta', quantity: 10, price: 2100,  pricePerUnit: 210,  availability: 'limited',     url: '#' },
  { id: '5',  pharmacy: 'Farmatodo',        productName: 'Dolex',                  activeIngredient: 'Acetaminofén', concentration: '500mg', presentation: 'Tableta', quantity: 10, price: 3600,  pricePerUnit: 360,  availability: 'available',   url: '#' },
  { id: '6',  pharmacy: 'Olimpica Drogueria',productName: 'Acetaminofén Procaps',  activeIngredient: 'Acetaminofén', concentration: '500mg', presentation: 'Tableta', quantity: 10, price: 2400,  pricePerUnit: 240,  availability: 'unavailable', url: '#' },
  { id: '7',  pharmacy: 'Cruz Verde',       productName: 'Advil 400',              activeIngredient: 'Ibuprofeno',   concentration: '400mg', presentation: 'Tableta', quantity: 10, price: 8500,  pricePerUnit: 850,  availability: 'available',   url: '#' },
  { id: '8',  pharmacy: 'Drogas La Rebaja', productName: 'Ibuprofeno Genfar',      activeIngredient: 'Ibuprofeno',   concentration: '400mg', presentation: 'Tableta', quantity: 10, price: 3200,  pricePerUnit: 320,  availability: 'available',   url: '#' },
  { id: '9',  pharmacy: 'Colsubsidio',      productName: 'Ibuprofeno MK',          activeIngredient: 'Ibuprofeno',   concentration: '400mg', presentation: 'Tableta', quantity: 10, price: 2900,  pricePerUnit: 290,  availability: 'available',   url: '#' },
  { id: '10', pharmacy: 'Farmatodo',        productName: 'Losartán Potasico MK',   activeIngredient: 'Losartán',     concentration: '50mg',  presentation: 'Tableta', quantity: 30, price: 18500, pricePerUnit: 617,  availability: 'available',   url: '#' },
  { id: '11', pharmacy: 'Cruz Verde',       productName: 'Cozaar 50mg',            activeIngredient: 'Losartán',     concentration: '50mg',  presentation: 'Tableta', quantity: 30, price: 42000, pricePerUnit: 1400, availability: 'available',   url: '#' },
  { id: '12', pharmacy: 'Cafam',            productName: 'Losartán Genfar',        activeIngredient: 'Losartán',     concentration: '50mg',  presentation: 'Tableta', quantity: 30, price: 15200, pricePerUnit: 507,  availability: 'limited',     url: '#' },
  { id: '13', pharmacy: 'Drogas La Rebaja', productName: 'Glucophage 850',         activeIngredient: 'Metformina',   concentration: '850mg', presentation: 'Tableta', quantity: 30, price: 28000, pricePerUnit: 933,  availability: 'available',   url: '#' },
  { id: '14', pharmacy: 'Colsubsidio',      productName: 'Metformina MK',          activeIngredient: 'Metformina',   concentration: '850mg', presentation: 'Tableta', quantity: 30, price: 12400, pricePerUnit: 413,  availability: 'available',   url: '#' },
  { id: '15', pharmacy: 'Cruz Verde',       productName: 'Metformina Genfar',      activeIngredient: 'Metformina',   concentration: '850mg', presentation: 'Tableta', quantity: 30, price: 14800, pricePerUnit: 493,  availability: 'available',   url: '#' },
]

export function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '')
}

export function searchMock(query: string): PharmacyResult[] {
  const q = normalize(query.trim())
  if (!q) return []
  return MOCK_DATA.filter(
    (r) =>
      normalize(r.activeIngredient).includes(q) ||
      normalize(r.productName).includes(q)
  )
}

export function sortResults(results: PharmacyResult[], key: SortKey): PharmacyResult[] {
  return [...results].sort((a, b) => {
    if (key === 'price-asc')  return a.price - b.price
    if (key === 'price-desc') return b.price - a.price
    if (key === 'unit-asc')   return a.pricePerUnit - b.pricePerUnit
    return a.pharmacy.localeCompare(b.pharmacy, 'es')
  })
}
