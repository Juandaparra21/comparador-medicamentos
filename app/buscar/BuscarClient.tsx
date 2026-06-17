'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { PharmacyResult, MedicationType } from '@/app/types'
import { searchMock, sortResults, SORT_OPTIONS, normalize, type SortKey } from '@/app/utils/search'
import { getMedicationHistory } from '@/app/utils/priceHistory'
import { formatCOP } from '@/app/utils/format'
import { SearchBar } from '@/app/components/SearchBar'
import ResultCard from '@/app/components/ResultCard'
import { ProductGroupCard } from '@/app/components/ProductGroupCard'
import { PriceChart } from '@/app/components/PriceChart'
import { PriceHistoryChart } from '@/app/components/PriceHistoryChart'
import { groupResults } from '@/app/utils/groupResults'

type TypeFilter = 'all' | MedicationType
type ViewMode   = 'grouped' | 'all'

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: 'all',     label: 'Todos' },
  { value: 'generic', label: 'Genérico' },
  { value: 'brand',   label: 'Marca' },
]

const N = TYPE_FILTERS.length

export default function BuscarClient() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const [results,        setResults]        = useState<PharmacyResult[]>([])
  const [loading,        setLoading]        = useState(true)
  const [sortKey,        setSortKey]        = useState<SortKey>('price-asc')
  const [typeFilter,     setTypeFilter]     = useState<TypeFilter>('all')
  const [concFilter,     setConcFilter]     = useState<string>('')
  const [presentFilter,  setPresentFilter]  = useState<string>('')
  const [qtyFilter,      setQtyFilter]      = useState<number | null>(null)
  const [viewMode,       setViewMode]       = useState<ViewMode>('grouped')

  useEffect(() => {
    if (!q.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    setTypeFilter('all')
    setConcFilter('')
    setPresentFilter('')
    setQtyFilter(null)
    setViewMode('grouped')
    const controller = new AbortController()
    fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results ?? [])
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setResults(searchMock(q))
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [q])

  // Unique filter options (sorted by frequency)
  function topValues<T extends string | number>(arr: T[]): T[] {
    const counts = new Map<T, number>()
    for (const v of arr) counts.set(v, (counts.get(v) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v)
  }

  const concentrations = topValues(results.map(r => r.concentration).filter(Boolean))
  const presentations  = topValues(results.map(r => r.presentation).filter(Boolean))
  const quantities     = topValues(results.map(r => r.quantity).filter(q => q > 1)) as number[]

  const byType    = typeFilter === 'all' ? results : results.filter(r => r.type === typeFilter)
  const byConc    = concFilter    ? byType.filter(r => r.concentration === concFilter) : byType
  const byPresent = presentFilter ? byConc.filter(r => r.presentation === presentFilter) : byConc
  const filtered  = qtyFilter     ? byPresent.filter(r => r.quantity === qtyFilter) : byPresent

  const availableFiltered = filtered.filter((r) => r.availability !== 'unavailable')
  const minPrice = availableFiltered.length > 0
    ? Math.min(...availableFiltered.map((r) => r.price))
    : null
  const maxPrice = availableFiltered.length > 0
    ? Math.max(...availableFiltered.map((r) => r.price))
    : null
  const sorted = sortResults(filtered, sortKey)
  const groups = groupResults(filtered)

  const genericCount = results.filter((r) => r.type === 'generic').length
  const brandCount   = results.filter((r) => r.type === 'brand').length

  // Ahorro real entre el más barato genérico vs el más barato de marca
  const avail = results.filter((r) => r.availability !== 'unavailable')
  const minG = avail.filter((r) => r.type === 'generic').reduce((m, r) => Math.min(m, r.price), Infinity)
  const minB = avail.filter((r) => r.type === 'brand').reduce((m, r) => Math.min(m, r.price), Infinity)
  const savingsPct = isFinite(minG) && isFinite(minB) && minG < minB
    ? Math.round((1 - minG / minB) * 100)
    : null

  const history = getMedicationHistory(normalize(q))
  const selectedIndex = TYPE_FILTERS.findIndex((f) => f.value === typeFilter)

  return (
    <>
      {/* Sticky sub-header */}
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
            {/* ── Tarjeta grande: ¿Genérico o de marca? ── */}
            <div className="mb-5 p-5 sm:p-6 bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm">

              {/* Cabecera */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex-1 min-w-0">
                  <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1a1b1f] tracking-tight leading-snug">
                    ¿Genérico o de marca?
                  </h2>
                  <p className="text-[13px] sm:text-[14px] text-[#717786] mt-1.5 leading-relaxed">
                    {savingsPct !== null
                      ? `El genérico puede ser hasta ${savingsPct}% más barato con el mismo principio activo.`
                      : 'Elige según tu preferencia y presupuesto.'}
                  </p>
                </div>

                {/* Contadores */}
                <div className="flex items-center gap-5 shrink-0">
                  <div className="text-center">
                    <p className="text-[28px] sm:text-[32px] font-bold text-secondary leading-none tabular-nums">
                      {genericCount}
                    </p>
                    <p className="text-[11px] text-[#717786] mt-1">genéricos</p>
                  </div>
                  <div className="w-px h-10 bg-[#e5e7eb]" />
                  <div className="text-center">
                    <p className="text-[28px] sm:text-[32px] font-bold text-primary leading-none tabular-nums">
                      {brandCount}
                    </p>
                    <p className="text-[11px] text-[#717786] mt-1">de marca</p>
                  </div>
                </div>
              </div>

              {/* ── Control deslizante estilo Apple ── */}
              <div className="relative flex bg-black/[0.06] rounded-[14px] p-1">
                {/* Indicador blanco deslizante — usa transform para GPU-smooth */}
                <div
                  className="absolute top-1 bottom-1 bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
                  style={{
                    left: '4px',
                    width: `calc((100% - 8px) / ${N})`,
                    transform: `translateX(calc(${selectedIndex} * 100%))`,
                    transition: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />

                {TYPE_FILTERS.map((f, i) => {
                  const isSelected = typeFilter === f.value
                  const count = f.value === 'generic' ? genericCount : f.value === 'brand' ? brandCount : null
                  return (
                    <button
                      key={f.value}
                      onClick={() => setTypeFilter(f.value)}
                      className="relative z-10 flex-1 flex flex-col items-center gap-1 py-4 px-2 rounded-[10px] cursor-pointer select-none"
                    >
                      <span
                        className="text-[15px] sm:text-[17px] font-semibold leading-tight"
                        style={{
                          color: isSelected ? '#1a1b1f' : '#9ca3af',
                          transition: 'color 220ms ease',
                        }}
                      >
                        {f.label}
                      </span>
                      {count !== null && (
                        <span
                          className="text-[12px] leading-tight"
                          style={{
                            color: isSelected
                              ? f.value === 'generic' ? '#006e28' : '#0058bc'
                              : '#c1c6d7',
                            fontWeight: isSelected ? 600 : 400,
                            transition: 'color 220ms ease',
                          }}
                        >
                          {count} disponibles
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Filter chips ── */}
            <div className="mt-4 flex flex-col gap-2">
              {concentrations.length > 1 && (
                <FilterRow label="Concentracion">
                  <Chip active={concFilter === ''} onClick={() => setConcFilter('')}>Todas</Chip>
                  {concentrations.map(c => (
                    <Chip key={c} active={concFilter === c} onClick={() => setConcFilter(concFilter === c ? '' : c)}>{c}</Chip>
                  ))}
                </FilterRow>
              )}
              {presentations.length > 1 && (
                <FilterRow label="Tipo">
                  <Chip active={presentFilter === ''} onClick={() => setPresentFilter('')}>Todos</Chip>
                  {presentations.map(p => (
                    <Chip key={p} active={presentFilter === p} onClick={() => setPresentFilter(presentFilter === p ? '' : p)}>{p}</Chip>
                  ))}
                </FilterRow>
              )}
              {quantities.length > 1 && (
                <FilterRow label="Unidades">
                  <Chip active={qtyFilter === null} onClick={() => setQtyFilter(null)}>Todas</Chip>
                  {quantities.map(q => (
                    <Chip key={q} active={qtyFilter === q} onClick={() => setQtyFilter(qtyFilter === q ? null : q)}>× {q}</Chip>
                  ))}
                </FilterRow>
              )}
            </div>

            {/* ── Results header: count + view toggle + sort ── */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-[13px] text-[#717786]">
                  <span className="font-semibold text-[#1a1b1f]">
                    {viewMode === 'grouped' ? groups.length : filtered.length}
                  </span>{' '}
                  {viewMode === 'grouped' ? `producto${groups.length !== 1 ? 's' : ''}` : `resultado${filtered.length !== 1 ? 's' : ''}`}
                </p>
                <div className="flex bg-black/[0.05] rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grouped')}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${viewMode === 'grouped' ? 'bg-white text-[#1a1b1f] shadow-sm' : 'text-[#717786]'}`}
                  >
                    Comparar
                  </button>
                  <button
                    onClick={() => setViewMode('all')}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${viewMode === 'all' ? 'bg-white text-[#1a1b1f] shadow-sm' : 'text-[#717786]'}`}
                  >
                    Todos
                  </button>
                </div>
              </div>
              {viewMode === 'all' && (
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-[11px] font-semibold tracking-[0.05em] uppercase text-[#717786] whitespace-nowrap">
                    Ordenar
                  </label>
                  <select
                    id="sort"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="text-[12px] bg-white/70 backdrop-blur-sm border border-[#c1c6d7]/60 rounded-lg px-3 py-1.5 text-[#1a1b1f] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Precios min / max */}
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

            {/* Tarjetas */}
            {filtered.length > 0 ? (
              viewMode === 'grouped' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {groups.map((group) => (
                    <ProductGroupCard key={group.key} group={group} />
                  ))}
                </div>
              ) : (
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
              )
            ) : (
              <div className="text-center py-16">
                <p className="text-[16px] font-semibold text-[#1a1b1f] mb-1">
                  Sin resultados para los filtros seleccionados
                </p>
                <button
                  onClick={() => { setTypeFilter('all'); setPresentFilter(''); setQtyFilter(null); setConcFilter('') }}
                  className="text-[13px] text-primary font-semibold hover:opacity-75 transition-opacity cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Gráficas — dos columnas en desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PriceChart results={filtered} minPrice={minPrice} />
              {history && (
                <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-[14px] font-bold text-[#1a1b1f]">Historial de precios</h2>
                    <span className="text-[11px] text-[#c1c6d7] font-medium">Ultimos 12 meses</span>
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

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 -mx-1 px-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-[#c1c6d7] shrink-0 w-[70px]">
        {label}
      </span>
      <div className="flex gap-1.5 flex-nowrap">
        {children}
      </div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
        active
          ? 'bg-primary text-white border-primary'
          : 'bg-white/60 text-[#414755] border-[#c1c6d7]/60 hover:border-primary/40'
      }`}
    >
      {children}
    </button>
  )
}
