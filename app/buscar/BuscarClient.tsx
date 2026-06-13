'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { PharmacyResult, MedicationType } from '@/app/types'
import { searchMock, sortResults, SORT_OPTIONS, normalize, type SortKey } from '@/app/utils/search'
import { getMedicationHistory } from '@/app/utils/priceHistory'
import { formatCOP } from '@/app/utils/format'
import { SearchBar } from '@/app/components/SearchBar'
import ResultCard from '@/app/components/ResultCard'
import { PriceChart } from '@/app/components/PriceChart'
import { PriceHistoryChart } from '@/app/components/PriceHistoryChart'

type TypeFilter = 'all' | MedicationType

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: 'all',     label: 'Todos' },
  { value: 'generic', label: 'Genérico' },
  { value: 'brand',   label: 'Marca' },
]

export default function BuscarClient() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const [results,    setResults]    = useState<PharmacyResult[]>([])
  const [loading,    setLoading]    = useState(true)
  const [sortKey,    setSortKey]    = useState<SortKey>('price-asc')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')

  useEffect(() => {
    setLoading(true)
    setTypeFilter('all')
    const timer = setTimeout(() => {
      setResults(searchMock(q))
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [q])

  const filtered = typeFilter === 'all'
    ? results
    : results.filter((r) => r.type === typeFilter)

  const availableFiltered = filtered.filter((r) => r.availability !== 'unavailable')
  const minPrice = availableFiltered.length > 0
    ? Math.min(...availableFiltered.map((r) => r.price))
    : null
  const maxPrice = availableFiltered.length > 0
    ? Math.max(...availableFiltered.map((r) => r.price))
    : null
  const sorted = sortResults(filtered, sortKey)

  const genericCount = results.filter((r) => r.type === 'generic').length
  const brandCount   = results.filter((r) => r.type === 'brand').length

  const history = getMedicationHistory(normalize(q))

  return (
    <>
      {/* Sticky sub-header with search bar */}
      <div className="sticky top-14 z-10 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="mx-auto px-4 sm:px-5 max-w-2xl py-3">
          <SearchBar key={q} initialValue={q} compact />
        </div>
      </div>

      <section className="mx-auto px-4 sm:px-5 max-w-5xl pt-5 pb-16 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-[#717786]">
            <div className="w-10 h-10 border-4 border-white/50 border-t-primary rounded-full animate-spin" />
            <p className="text-[15px]">Buscando precios...</p>
          </div>
        ) : !q ? (
          <div className="text-center py-28">
            <p className="text-[18px] font-semibold text-[#1a1b1f]">
              Escribe un medicamento para buscar
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-28">
            <p className="text-[20px] font-semibold text-[#1a1b1f] mb-2">
              Sin resultados para &ldquo;{q}&rdquo;
            </p>
            <p className="text-[15px] text-[#717786]">
              Intenta con el nombre generico o el principio activo del medicamento
            </p>
          </div>
        ) : (
          <>
            {/* Control bar: count + type filters + sort — una sola fila compacta */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4 p-3 sm:p-3.5 bg-white/60 backdrop-blur-[20px] border border-white/50 rounded-xl">
              <div className="flex items-center gap-1.5 flex-1 min-w-0 flex-wrap text-[12px]">
                <span className="font-bold text-[#1a1b1f]">{filtered.length}</span>
                <span className="text-[#717786]">resultados para &ldquo;{q}&rdquo;</span>
                <span className="text-[#c1c6d7] hidden sm:inline">&bull;</span>
                <span className="font-semibold text-secondary hidden sm:inline">{genericCount} genéricos</span>
                <span className="text-[#c1c6d7] hidden sm:inline">&bull;</span>
                <span className="font-semibold text-primary hidden sm:inline">{brandCount} de marca</span>
              </div>

              {/* Type filter pills */}
              <div className="flex gap-1.5 shrink-0">
                {TYPE_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setTypeFilter(f.value)}
                    className={`text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      typeFilter === f.value
                        ? f.value === 'generic'
                          ? 'bg-secondary text-white'
                          : f.value === 'brand'
                          ? 'bg-primary text-white'
                          : 'bg-[#1a1b1f] text-white'
                        : 'bg-white/60 text-[#414755] border border-white/50 hover:border-[#c1c6d7]'
                    }`}
                  >
                    {f.label}
                    {f.value !== 'all' && (
                      <span className="ml-1 opacity-70">
                        ({f.value === 'generic' ? genericCount : brandCount})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="text-[12px] bg-white/70 border border-[#c1c6d7]/60 rounded-lg px-2.5 py-1.5 text-[#1a1b1f] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shrink-0"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats pills */}
            {minPrice !== null && maxPrice !== null && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                  Min: {formatCOP(minPrice)}
                </span>
                <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/60 text-[#414755] border border-white/40">
                  Max: {formatCOP(maxPrice)}
                </span>
                {maxPrice - minPrice > 1000 && (
                  <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Ahorra hasta {formatCOP(maxPrice - minPrice)}
                  </span>
                )}
                <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/60 text-[#414755] border border-white/40">
                  {availableFiltered.length} farmacias disponibles
                </span>
              </div>
            )}

            {/* Cards grid — primero para que los productos sean lo primero visible */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {sorted.map((result) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    isCheapest={
                      result.availability !== 'unavailable' &&
                      result.price === minPrice
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-[16px] font-semibold text-[#1a1b1f] mb-1">
                  Sin {typeFilter === 'generic' ? 'genéricos' : 'medicamentos de marca'}
                </p>
                <button
                  onClick={() => setTypeFilter('all')}
                  className="text-[13px] text-primary font-semibold hover:opacity-75 transition-opacity cursor-pointer"
                >
                  Ver todos los resultados
                </button>
              </div>
            )}

            {/* Graficas — dos columnas en desktop, apiladas en movil */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PriceChart results={filtered} minPrice={minPrice} />
              {history && (
                <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-[14px] font-bold text-[#1a1b1f]">Historial de precios</h2>
                    <span className="text-[11px] text-[#c1c6d7] font-medium">
                      Ultimos 12 meses
                    </span>
                  </div>
                  <p className="text-[12px] text-[#717786] mb-4">{history.label}</p>
                  <PriceHistoryChart histories={history.histories} unit={history.unit} />
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  )
}
