'use client'

import { useState } from 'react'
import type { PharmacyResult } from '@/app/types'
import ResultCard from './ResultCard'

const MOCK_DATA: PharmacyResult[] = [
  {
    id: '1',
    pharmacy: 'Drogas La Rebaja',
    productName: 'Dolex Forte',
    activeIngredient: 'Acetaminofén',
    concentration: '500mg',
    presentation: 'Tableta',
    quantity: 10,
    price: 2800,
    pricePerUnit: 280,
    availability: 'available',
    url: '#',
  },
  {
    id: '2',
    pharmacy: 'Cruz Verde',
    productName: 'Tylenol 500',
    activeIngredient: 'Acetaminofén',
    concentration: '500mg',
    presentation: 'Tableta',
    quantity: 10,
    price: 5200,
    pricePerUnit: 520,
    availability: 'available',
    url: '#',
  },
  {
    id: '3',
    pharmacy: 'Colsubsidio',
    productName: 'Acetaminofén Genfar',
    activeIngredient: 'Acetaminofén',
    concentration: '500mg',
    presentation: 'Tableta',
    quantity: 10,
    price: 1900,
    pricePerUnit: 190,
    availability: 'available',
    url: '#',
  },
  {
    id: '4',
    pharmacy: 'Cafam',
    productName: 'Acetaminofén MK',
    activeIngredient: 'Acetaminofén',
    concentration: '500mg',
    presentation: 'Tableta',
    quantity: 10,
    price: 2100,
    pricePerUnit: 210,
    availability: 'limited',
    url: '#',
  },
  {
    id: '5',
    pharmacy: 'Farmatodo',
    productName: 'Dolex',
    activeIngredient: 'Acetaminofén',
    concentration: '500mg',
    presentation: 'Tableta',
    quantity: 10,
    price: 3600,
    pricePerUnit: 360,
    availability: 'available',
    url: '#',
  },
  {
    id: '6',
    pharmacy: 'Olimpica Drogueria',
    productName: 'Acetaminofén Procaps',
    activeIngredient: 'Acetaminofén',
    concentration: '500mg',
    presentation: 'Tableta',
    quantity: 10,
    price: 2400,
    pricePerUnit: 240,
    availability: 'unavailable',
    url: '#',
  },
  {
    id: '7',
    pharmacy: 'Cruz Verde',
    productName: 'Advil 400',
    activeIngredient: 'Ibuprofeno',
    concentration: '400mg',
    presentation: 'Tableta',
    quantity: 10,
    price: 8500,
    pricePerUnit: 850,
    availability: 'available',
    url: '#',
  },
  {
    id: '8',
    pharmacy: 'Drogas La Rebaja',
    productName: 'Ibuprofeno Genfar',
    activeIngredient: 'Ibuprofeno',
    concentration: '400mg',
    presentation: 'Tableta',
    quantity: 10,
    price: 3200,
    pricePerUnit: 320,
    availability: 'available',
    url: '#',
  },
  {
    id: '9',
    pharmacy: 'Colsubsidio',
    productName: 'Ibuprofeno MK',
    activeIngredient: 'Ibuprofeno',
    concentration: '400mg',
    presentation: 'Tableta',
    quantity: 10,
    price: 2900,
    pricePerUnit: 290,
    availability: 'available',
    url: '#',
  },
  {
    id: '10',
    pharmacy: 'Farmatodo',
    productName: 'Losartán Potasico MK',
    activeIngredient: 'Losartán',
    concentration: '50mg',
    presentation: 'Tableta',
    quantity: 30,
    price: 18500,
    pricePerUnit: 617,
    availability: 'available',
    url: '#',
  },
  {
    id: '11',
    pharmacy: 'Cruz Verde',
    productName: 'Cozaar 50mg',
    activeIngredient: 'Losartán',
    concentration: '50mg',
    presentation: 'Tableta',
    quantity: 30,
    price: 42000,
    pricePerUnit: 1400,
    availability: 'available',
    url: '#',
  },
  {
    id: '12',
    pharmacy: 'Cafam',
    productName: 'Losartán Genfar',
    activeIngredient: 'Losartán',
    concentration: '50mg',
    presentation: 'Tableta',
    quantity: 30,
    price: 15200,
    pricePerUnit: 507,
    availability: 'limited',
    url: '#',
  },
  {
    id: '13',
    pharmacy: 'Drogas La Rebaja',
    productName: 'Glucophage 850',
    activeIngredient: 'Metformina',
    concentration: '850mg',
    presentation: 'Tableta',
    quantity: 30,
    price: 28000,
    pricePerUnit: 933,
    availability: 'available',
    url: '#',
  },
  {
    id: '14',
    pharmacy: 'Colsubsidio',
    productName: 'Metformina MK',
    activeIngredient: 'Metformina',
    concentration: '850mg',
    presentation: 'Tableta',
    quantity: 30,
    price: 12400,
    pricePerUnit: 413,
    availability: 'available',
    url: '#',
  },
  {
    id: '15',
    pharmacy: 'Cruz Verde',
    productName: 'Metformina Genfar',
    activeIngredient: 'Metformina',
    concentration: '850mg',
    presentation: 'Tableta',
    quantity: 30,
    price: 14800,
    pricePerUnit: 493,
    availability: 'available',
    url: '#',
  },
]

type SortKey = 'price-asc' | 'price-desc' | 'unit-asc' | 'pharmacy-asc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'unit-asc', label: 'Precio por unidad' },
  { value: 'pharmacy-asc', label: 'Farmacia A-Z' },
]

const QUICK_SEARCHES = ['Acetaminofén', 'Ibuprofeno', 'Losartán', 'Metformina']

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
}

function searchMock(query: string): PharmacyResult[] {
  const q = normalize(query.trim())
  return MOCK_DATA.filter(
    (r) =>
      normalize(r.activeIngredient).includes(q) ||
      normalize(r.productName).includes(q)
  )
}

function sortResults(results: PharmacyResult[], key: SortKey): PharmacyResult[] {
  return [...results].sort((a, b) => {
    if (key === 'price-asc') return a.price - b.price
    if (key === 'price-desc') return b.price - a.price
    if (key === 'unit-asc') return a.pricePerUnit - b.pricePerUnit
    return a.pharmacy.localeCompare(b.pharmacy, 'es')
  })
}

type Phase = 'idle' | 'loading' | 'done'

export default function MedicationSearch() {
  const [query, setQuery] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [results, setResults] = useState<PharmacyResult[]>([])
  const [lastQuery, setLastQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('price-asc')

  function runSearch(q: string) {
    const trimmed = q.trim()
    if (!trimmed) return
    setQuery(trimmed)
    setPhase('loading')
    setLastQuery(trimmed)
    setTimeout(() => {
      setResults(searchMock(trimmed))
      setPhase('done')
    }, 500)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runSearch(query)
  }

  const sorted = sortResults(results, sortKey)
  const minPrice =
    results.length > 0
      ? Math.min(
          ...results
            .filter((r) => r.availability !== 'unavailable')
            .map((r) => r.price)
        )
      : null

  return (
    <>
      {/* ── Hero / Search section ── */}
      <section
        className={`transition-all duration-300 ${
          phase === 'idle' ? 'py-24 sm:py-32' : 'py-8 sm:py-10'
        }`}
      >
        <div className="mx-auto px-5 max-w-2xl">
          {/* Headline — only on idle */}
          {phase === 'idle' && (
            <div className="text-center mb-10">
              <h1 className="text-[28px] sm:text-[34px] font-bold leading-tight tracking-[-0.02em] text-[#1a1b1f] mb-3">
                Compara precios de{' '}
                <span className="text-primary">medicamentos</span>
              </h1>
              <p className="text-[17px] text-[#414755] leading-[22px]">
                Encuentra el mejor precio en las principales farmacias de Colombia
              </p>
            </div>
          )}

          {/* Glass search bar */}
          <form
            onSubmit={handleSubmit}
            className="flex items-stretch bg-white/70 backdrop-blur-[30px] rounded-xl border border-white/50 shadow-[0_2px_24px_rgba(0,88,188,0.08)] overflow-hidden"
          >
            <div className="flex items-center pl-4 text-[#717786] shrink-0" aria-hidden="true">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: acetaminofén, ibuprofeno, losartán..."
              className="flex-1 py-3.5 px-3 bg-transparent text-[15px] text-[#1a1b1f] placeholder:text-[#8e8e93] focus:outline-none min-w-0"
            />
            <button
              type="submit"
              disabled={!query.trim() || phase === 'loading'}
              className="m-1.5 px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[15px] font-semibold rounded-lg shrink-0 disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              {phase === 'loading' ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {/* Quick search chips */}
          {phase === 'idle' && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {QUICK_SEARCHES.map((med) => (
                <button
                  key={med}
                  type="button"
                  onClick={() => runSearch(med)}
                  className="text-[12px] font-semibold tracking-wide px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-[#c1c6d7]/60 text-[#414755] hover:bg-white/80 hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
                >
                  {med}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Results section ── */}
      {phase !== 'idle' && (
        <section className="mx-auto px-5 max-w-5xl pb-16 w-full">
          {phase === 'loading' ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4 text-[#717786]">
              <div className="w-10 h-10 border-4 border-white/50 border-t-primary rounded-full animate-spin" />
              <p className="text-[15px]">Buscando precios...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-28">
              <p className="text-[20px] font-semibold text-[#1a1b1f] mb-2">
                Sin resultados para &ldquo;{lastQuery}&rdquo;
              </p>
              <p className="text-[15px] text-[#717786]">
                Intenta con el nombre generico o el principio activo del medicamento
              </p>
            </div>
          ) : (
            <>
              {/* Results header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <p className="text-[15px] text-[#717786]">
                  <span className="font-semibold text-[#1a1b1f]">{results.length}</span>{' '}
                  resultado{results.length !== 1 ? 's' : ''} para &ldquo;{lastQuery}&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  <label
                    htmlFor="sort"
                    className="text-[12px] font-semibold tracking-[0.05em] uppercase text-[#717786] whitespace-nowrap"
                  >
                    Ordenar por
                  </label>
                  <select
                    id="sort"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="text-[13px] bg-white/70 backdrop-blur-sm border border-[#c1c6d7]/60 rounded-lg px-3 py-1.5 text-[#1a1b1f] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sorted.map((result) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    isCheapest={
                      result.availability !== 'unavailable' && result.price === minPrice
                    }
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </>
  )
}
