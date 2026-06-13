'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { PharmacyResult } from '@/app/types'
import { searchMock, sortResults, SORT_OPTIONS, type SortKey } from '@/app/utils/search'
import { formatCOP } from '@/app/utils/format'
import { SearchBar } from '@/app/components/SearchBar'
import ResultCard from '@/app/components/ResultCard'
import { PriceChart } from '@/app/components/PriceChart'

export default function BuscarClient() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const [results, setResults] = useState<PharmacyResult[]>([])
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>('price-asc')

  // Re-run search whenever the URL query changes (back/forward nav included)
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setResults(searchMock(q))
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [q])

  const availableResults = results.filter((r) => r.availability !== 'unavailable')
  const minPrice = availableResults.length > 0
    ? Math.min(...availableResults.map((r) => r.price))
    : null
  const maxPrice = availableResults.length > 0
    ? Math.max(...availableResults.map((r) => r.price))
    : null
  const sorted = sortResults(results, sortKey)

  return (
    <>
      {/* Search bar — always visible on results page */}
      <div className="sticky top-14 z-10 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="mx-auto px-4 sm:px-5 max-w-2xl py-3">
          {/* key=q forces SearchBar to remount with correct initialValue on back/forward nav */}
          <SearchBar key={q} initialValue={q} compact />
        </div>
      </div>

      <section className="mx-auto px-4 sm:px-5 max-w-5xl pt-6 pb-16 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-[#717786]">
            <div className="w-10 h-10 border-4 border-white/50 border-t-primary rounded-full animate-spin" />
            <p className="text-[15px]">Buscando precios...</p>
          </div>
        ) : !q ? (
          <div className="text-center py-28">
            <p className="text-[18px] font-semibold text-[#1a1b1f] mb-2">
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
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <p className="text-[14px] sm:text-[15px] text-[#717786]">
                <span className="font-semibold text-[#1a1b1f]">{results.length}</span>{' '}
                resultado{results.length !== 1 ? 's' : ''} para &ldquo;{q}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-[11px] font-semibold tracking-[0.05em] uppercase text-[#717786] whitespace-nowrap"
                >
                  Ordenar
                </label>
                <select
                  id="sort"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="flex-1 sm:flex-none text-[13px] bg-white/70 backdrop-blur-sm border border-[#c1c6d7]/60 rounded-lg px-3 py-1.5 text-[#1a1b1f] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stats strip */}
            {minPrice !== null && maxPrice !== null && (
              <div className="flex flex-wrap gap-2 mb-5">
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
                  {availableResults.length} farmacias disponibles
                </span>
              </div>
            )}

            {/* Price chart */}
            <PriceChart results={results} minPrice={minPrice} />

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </>
        )}
      </section>
    </>
  )
}
