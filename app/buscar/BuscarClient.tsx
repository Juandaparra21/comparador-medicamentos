'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { PharmacyResult, MedicationType } from '@/app/types'
import { suggestCorrection, capitalizeFirst } from '@/app/utils/spellCorrect'
import { sortResults, SORT_OPTIONS, normalize, type SortKey } from '@/app/utils/search'
import { useNearbyPharmacies } from '@/app/hooks/useNearbyPharmacies'
import { isVolumePresentation, quantityUnit, formatQuantity } from '@/app/utils/units'
import { formatCOP } from '@/app/utils/format'
import { SearchBar } from '@/app/components/SearchBar'
import ResultCard from '@/app/components/ResultCard'
import { ProductGroupCard } from '@/app/components/ProductGroupCard'
import { RadioFilter, QuantitySlider } from '@/app/components/FilterControls'
import { PriceTracker } from '@/app/components/PriceTracker'
import { PriceAlert } from '@/app/components/PriceAlert'
import { ShareComparison } from '@/app/components/ShareComparison'
import { RelativeTime } from '@/app/components/RelativeTime'
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

  // "¿Quisiste decir X?" — closest known medication when the query looks misspelled.
  const correction = useMemo(() => suggestCorrection(q), [q])

  const [results,        setResults]        = useState<PharmacyResult[]>([])
  const [loading,        setLoading]        = useState(true)
  const [fetchedAt,      setFetchedAt]      = useState<string | null>(null)
  const [sortKey,        setSortKey]        = useState<SortKey>('price-asc')
  const [priceBasis,     setPriceBasis]     = useState<'total' | 'unit'>('total')
  const [typeFilter,     setTypeFilter]     = useState<TypeFilter>('all')
  const [concFilter,     setConcFilter]     = useState<string>('')
  const [presentFilter,  setPresentFilter]  = useState<string>('')
  const [qtyFilter,      setQtyFilter]      = useState<number | null>(null)
  const [viewMode,       setViewMode]       = useState<ViewMode>('grouped')
  const [loadError,      setLoadError]      = useState(false)
  const [reloadKey,      setReloadKey]      = useState(0)

  useEffect(() => {
    if (!q.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    setLoadError(false)
    setFetchedAt(null)
    setSortKey('price-asc')
    setPriceBasis('total')
    setTypeFilter('all')
    setConcFilter('')
    setPresentFilter('')
    setQtyFilter(null)
    setViewMode('grouped')
    const controller = new AbortController()
    fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        setResults(data.results ?? [])
        setFetchedAt(data.fetchedAt ?? null)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          // Never fall back to simulated prices: show a real error instead.
          setResults([])
          setLoadError(true)
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [q, reloadKey])

  const { distances, stores, loading: locLoading, error: locError, hasDistances, request: requestLoc, searchByPlace: searchByAddress, clear: clearLoc } = useNearbyPharmacies()
  const [showAddr, setShowAddr] = useState(false)
  const [addr,     setAddr]     = useState('')

  function submitAddress(e: React.FormEvent) {
    e.preventDefault()
    if (!addr.trim()) return
    searchByAddress(addr)
    setShowAddr(false)
  }

  // Cascading filter options: each layer's options come from results that pass all *other* active filters.
  function topValues<T extends string | number>(arr: T[]): T[] {
    const counts = new Map<T, number>()
    for (const v of arr) counts.set(v, (counts.get(v) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v)
  }

  const afterType    = typeFilter === 'all' ? results : results.filter(r => r.type === typeFilter)
  const presentations = topValues(afterType.map(r => r.presentation).filter(Boolean))

  const afterPresent  = presentFilter ? afterType.filter(r => r.presentation === presentFilter) : afterType
  const concentrations = topValues(afterPresent.map(r => r.concentration).filter(Boolean))

  const afterConc    = concFilter ? afterPresent.filter(r => r.concentration === concFilter) : afterPresent
  const quantities   = topValues(afterConc.map(r => r.quantity).filter(q => q > 1)) as number[]

  // Is current presentation a volume form? (drives quantity unit label)
  const isLiquidFilter = isVolumePresentation(presentFilter)

  // Display order: concentrations ascending by mg, quantities ascending by pack size.
  // (topValues sorts by frequency, so keep the most-common one to tag it.)
  const mostCommonConc  = concentrations[0]
  const concentrationsAsc = [...concentrations].sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0))
  const quantitiesAsc     = [...quantities].sort((a, b) => a - b)

  const filtered = qtyFilter ? afterConc.filter(r => r.quantity === qtyFilter) : afterConc

  // Setters that auto-reset downstream filters to prevent impossible combinations
  function changePresentation(v: string) {
    setPresentFilter(v)
    setConcFilter('')
    setQtyFilter(null)
  }
  function changeConcentration(v: string) {
    setConcFilter(v)
    setQtyFilter(null)
  }

  // "Best price" basis: absolute total vs price per unit. Drives the cheapest
  // highlight, the min/max summary, and the ordering of results and groups.
  const basisVal = (r: PharmacyResult) => (priceBasis === 'unit' ? r.pricePerUnit : r.price)

  const availableFiltered = filtered.filter((r) => r.availability !== 'unavailable')
  const minPrice = availableFiltered.length > 0
    ? Math.min(...availableFiltered.map(basisVal))
    : null
  const maxPrice = availableFiltered.length > 0
    ? Math.max(...availableFiltered.map(basisVal))
    : null

  // Precio actual mas bajo disponible (para la alerta "hoy lo mas barato esta en $X").
  // Es un minimo informativo, no una comparacion entre productos distintos.
  const currentBestPrice = availableFiltered.length
    ? Math.min(...availableFiltered.map((r) => r.price))
    : null

  const sorted = sortResults(filtered, sortKey, distances)
  const { comparisons, singles } = groupResults(filtered)

  // Re-rank comparison groups by the chosen basis (groupResults orders by
  // absolute minPrice). Most-available first, then cheapest by basis.
  const groupMin = (g: typeof comparisons[number]) =>
    priceBasis === 'unit' ? g.minPricePerUnit : g.minPrice
  const orderedComparisons = [...comparisons].sort((a, b) =>
    b.availableCount !== a.availableCount
      ? b.availableCount - a.availableCount
      : groupMin(a) - groupMin(b),
  )

  // Ahorro real y comparable: SOLO entre el mismo producto exacto (mismos principio
  // activo, concentracion, presentacion y cantidad) vendido en 2+ farmacias. Asi
  // nunca comparamos productos distintos entre si. Tomamos el grupo con mayor ahorro
  // y descartamos diferencias absurdas (> 3x), que casi siempre son errores de dato.
  const bestSaving = comparisons
    .filter((g) => g.availableCount >= 2 && g.savings > 1000)
    .map((g) => {
      const avail = g.results.filter((r) => r.availability !== 'unavailable')
      const cheapest = avail.reduce((m, r) => (r.price < m.price ? r : m))
      const dearest = avail.reduce((m, r) => (r.price > m.price ? r : m))
      return { group: g, cheapest, dearest, savings: dearest.price - cheapest.price }
    })
    .filter((s) => s.cheapest.pharmacy !== s.dearest.pharmacy && s.dearest.price <= s.cheapest.price * 3)
    .sort((a, b) => b.savings - a.savings)[0] ?? null

  // Switching basis also sets a matching default sort for the flat list.
  function changeBasis(b: 'total' | 'unit') {
    setPriceBasis(b)
    setSortKey(b === 'unit' ? 'unit-asc' : 'price-asc')
  }

  const genericCount = results.filter((r) => r.type === 'generic').length
  const brandCount   = results.filter((r) => r.type === 'brand').length

  // Ahorro real entre el más barato genérico vs el más barato de marca
  const avail = results.filter((r) => r.availability !== 'unavailable')
  const minG = avail.filter((r) => r.type === 'generic').reduce((m, r) => Math.min(m, r.price), Infinity)
  const minB = avail.filter((r) => r.type === 'brand').reduce((m, r) => Math.min(m, r.price), Infinity)
  const savingsPct = isFinite(minG) && isFinite(minB) && minG < minB
    ? Math.round((1 - minG / minB) * 100)
    : null

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
        ) : loadError ? (
          <div className="text-center py-28">
            <p className="text-[20px] font-semibold text-[#1a1b1f] mb-2">
              No pudimos cargar los precios
            </p>
            <p className="text-[15px] text-[#717786] mb-5">
              Hubo un problema al consultar las farmacias. Revisa tu conexion e intenta de nuevo.
            </p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-28">
            <p className="text-[20px] font-semibold text-[#1a1b1f] mb-2">
              Sin resultados para &ldquo;{q}&rdquo;
            </p>
            {correction ? (
              <p className="text-[15px] text-[#717786]">
                ¿Quisiste decir{' '}
                <Link
                  href={`/buscar?q=${encodeURIComponent(correction)}`}
                  className="font-semibold text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  {capitalizeFirst(correction)}
                </Link>
                ?
              </p>
            ) : (
              <p className="text-[15px] text-[#717786]">
                Intenta con el nombre generico o el principio activo del medicamento
              </p>
            )}
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

            {/* ── Filtros ── */}
            {(presentations.length > 1 || concentrations.length > 1 || quantities.length > 1) && (
              <div className="mt-4 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm divide-y divide-[#f0f1f5]">
                {presentations.length > 1 && (
                  <div className="p-5">
                    <RadioFilter
                      label="Presentacion"
                      allLabel="Todas"
                      active={presentFilter}
                      options={presentations}
                      onChange={changePresentation}
                    />
                  </div>
                )}
                {concentrations.length > 1 && (
                  <div className="p-5">
                    <RadioFilter
                      label="Concentracion"
                      allLabel="Todas"
                      active={concFilter}
                      options={concentrationsAsc}
                      highlight={mostCommonConc}
                      onChange={changeConcentration}
                    />
                  </div>
                )}
                {quantities.length > 1 && (
                  <div className="p-5">
                    <QuantitySlider
                      title={isLiquidFilter ? 'Volumen' : 'Cantidad'}
                      values={quantitiesAsc}
                      active={qtyFilter}
                      unitLabel={quantityUnit(presentFilter)}
                      onChange={setQtyFilter}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── Results header: count + view toggle + sort ── */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-[13px] text-[#717786]">
                  <span className="font-semibold text-[#1a1b1f]">{filtered.length}</span>{' '}
                  resultado{filtered.length !== 1 ? 's' : ''}
                  {viewMode === 'grouped' && comparisons.length > 0 && (
                    <span className="text-secondary font-semibold">
                      {' '}· {comparisons.length} comparacion{comparisons.length !== 1 ? 'es' : ''}
                    </span>
                  )}
                </p>
                {fetchedAt && (
                  <span
                    className="flex items-center gap-1 text-[11px] text-secondary font-semibold"
                    title={`Precios consultados en tiempo real a las ${new Date(fetchedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" aria-hidden="true" />
                    <RelativeTime iso={fetchedAt} prefix="Actualizado" />
                  </span>
                )}
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

                {/* Best-price basis: total vs per unit */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-[#717786] whitespace-nowrap">Mejor precio:</span>
                  <div className="flex bg-black/[0.05] rounded-lg p-0.5">
                    <button
                      onClick={() => changeBasis('total')}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${priceBasis === 'total' ? 'bg-white text-[#1a1b1f] shadow-sm' : 'text-[#717786]'}`}
                      title="El más barato por el precio total del empaque"
                    >
                      Total
                    </button>
                    <button
                      onClick={() => changeBasis('unit')}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${priceBasis === 'unit' ? 'bg-white text-[#1a1b1f] shadow-sm' : 'text-[#717786]'}`}
                      title="El más barato por unidad (tableta, ml, etc.)"
                    >
                      Por unidad
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Location button */}
                <button
                  onClick={hasDistances ? clearLoc : requestLoc}
                  disabled={locLoading}
                  className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-50 ${
                    hasDistances
                      ? 'bg-secondary/10 text-secondary border-secondary/30'
                      : 'bg-white/70 text-[#717786] border-[#c1c6d7]/60 hover:text-primary hover:border-primary/30'
                  }`}
                  title={locError ?? undefined}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  </svg>
                  {locLoading ? 'Buscando...' : hasDistances ? 'Ubicacion activa' : 'Mas cercano'}
                </button>
                {/* Address input toggle — alternative to GPS */}
                <button
                  onClick={() => setShowAddr((v) => !v)}
                  className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    showAddr
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'bg-white/70 text-[#717786] border-[#c1c6d7]/60 hover:text-primary hover:border-primary/30'
                  }`}
                  aria-expanded={showAddr}
                  title="Escribir una direccion o ciudad"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                  </svg>
                  Direccion
                </button>
                <label htmlFor="sort" className="text-[11px] font-semibold tracking-[0.05em] uppercase text-[#717786] whitespace-nowrap">
                  Ordenar
                </label>
                <select
                  id="sort"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="text-[12px] bg-white/70 backdrop-blur-sm border border-[#c1c6d7]/60 rounded-lg px-3 py-1.5 text-[#1a1b1f] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {SORT_OPTIONS.filter(o => o.value !== 'nearest' || hasDistances).map((o) =>
                    <option key={o.value} value={o.value}>{o.label}</option>
                  )}
                </select>
              </div>
            </div>

            {/* Address input — geocode a typed address/city instead of GPS */}
            {showAddr && (
              <form onSubmit={submitAddress} className="flex items-stretch gap-2 mb-4">
                <input
                  type="text"
                  value={addr}
                  onChange={(e) => setAddr(e.target.value)}
                  placeholder="Escribe tu direccion, barrio o ciudad (ej: Calle 80 #20-30, Bogota)"
                  aria-label="Direccion o ciudad"
                  autoFocus
                  className="flex-1 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] text-[#1a1b1f] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-0"
                />
                <button
                  type="submit"
                  disabled={!addr.trim() || locLoading}
                  className="px-4 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  {locLoading ? 'Buscando...' : 'Usar direccion'}
                </button>
              </form>
            )}

            {/* Aviso de geolocalizacion (permiso denegado / sin farmacias cercanas) */}
            {locError && !locLoading && (
              <div className="flex items-start gap-2 mb-4 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200" role="status">
                <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.515 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p className="text-[12px] text-amber-800 leading-snug">{locError}</p>
              </div>
            )}

            {/* Ahorro concreto, SOLO sobre el mismo producto exacto en 2+ farmacias */}
            {bestSaving && (
              <div className="flex items-start gap-3 mb-4 p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
                <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1m0-12V4m0 16v-1" />
                  </svg>
                </div>
                <div className="self-center">
                  <p className="text-[13px] sm:text-[14px] text-[#1a1b1f] leading-snug">
                    Ahorras hasta <span className="font-bold text-secondary">{formatCOP(bestSaving.savings)}</span>{' '}
                    comprando en <span className="font-semibold">{bestSaving.cheapest.pharmacy}</span>{' '}
                    en vez de <span className="font-semibold">{bestSaving.dearest.pharmacy}</span>.
                  </p>
                  <p className="text-[11px] text-[#717786] mt-0.5">
                    Mismo producto: {bestSaving.group.activeIngredient}
                    {bestSaving.group.concentration ? ` ${bestSaving.group.concentration}` : ''}
                    {bestSaving.group.quantity > 1 ? ` · ${formatQuantity(bestSaving.group.quantity, bestSaving.group.presentation)}` : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Precios min / max — segun la base (total o por unidad) */}
            {minPrice !== null && maxPrice !== null && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                  {priceBasis === 'unit' ? 'Min/und' : 'Min'}: {formatCOP(minPrice)}
                </span>
                <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/60 text-[#414755] border border-white/40">
                  {priceBasis === 'unit' ? 'Max/und' : 'Max'}: {formatCOP(maxPrice)}
                </span>
                <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/60 text-[#414755] border border-white/40">
                  {availableFiltered.length} farmacias disponibles
                </span>
              </div>
            )}

            {/* Tarjetas */}
            {filtered.length > 0 ? (
              viewMode === 'grouped' ? (
                <div className="flex flex-col gap-6 mb-8">
                  {/* Comparison groups — same product in 2+ pharmacies */}
                  {comparisons.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold tracking-widest uppercase text-[#717786] mb-3">
                        Mismo producto, distintas farmacias
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orderedComparisons.map((group) => (
                          <ProductGroupCard key={group.key} group={group} priceBasis={priceBasis} distances={distances} stores={stores} fetchedAt={fetchedAt ?? undefined} />
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Singles — products found in only one pharmacy */}
                  {singles.length > 0 && (
                    <div>
                      {comparisons.length > 0 && (
                        <p className="text-[11px] font-bold tracking-widest uppercase text-[#717786] mb-3">
                          Solo en una farmacia
                        </p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortResults(singles, sortKey, distances).map((result) => (
                          <ResultCard
                            key={result.id}
                            result={result}
                            isCheapest={result.availability !== 'unavailable' && basisVal(result) === minPrice}
                            cheapestLabel={priceBasis === 'unit' ? 'Mejor x unidad' : 'Mejor precio'}
                            distanceKm={distances[result.pharmacy]}
                            store={stores[result.pharmacy]}
                            fetchedAt={fetchedAt ?? undefined}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {sorted.map((result) => (
                    <ResultCard
                      key={result.id}
                      result={result}
                      isCheapest={result.availability !== 'unavailable' && basisVal(result) === minPrice}
                      cheapestLabel={priceBasis === 'unit' ? 'Mejor x unidad' : 'Mejor precio'}
                      distanceKm={distances[result.pharmacy]}
                      store={stores[result.pharmacy]}
                      fetchedAt={fetchedAt ?? undefined}
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
                  onClick={() => { setTypeFilter('all'); setPresentFilter(''); setConcFilter(''); setQtyFilter(null) }}
                  className="text-[13px] text-primary font-semibold hover:opacity-75 transition-opacity cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Retención: avísame si baja + compartir comparación */}
            {filtered.length > 0 && (
              <div className="flex flex-col gap-3 mb-8">
                <PriceAlert query={normalize(q)} label={q.trim()} currentPrice={currentBestPrice} />
                <div className="flex items-center justify-between gap-3 flex-wrap bg-white/50 border border-white/40 rounded-2xl px-4 py-3.5">
                  <p className="text-[13px] text-[#414755] font-medium leading-snug">
                    ¿Le sirve a alguien más? Comparte esta comparación.
                  </p>
                  <ShareComparison query={q.trim()} />
                </div>
              </div>
            )}

            {/* Historial de precios real + rastreo */}
            {q.trim() && <PriceTracker query={normalize(q)} label={q.trim()} />}
          </>
        )}
      </section>
    </>
  )
}
