'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { PharmacyResult } from '@/app/types'
import { useNearbyList } from '@/app/hooks/useNearbyList'
import type { NearbyPharmacyView, OpenState } from '@/app/utils/nearbyPharmacies'
import { formatDistance, formatTripShort, directionsUrl } from '@/app/utils/geo'
import { formatCOP } from '@/app/utils/format'
import { AddressAutocomplete } from '@/app/components/AddressAutocomplete'

const PharmacyMap = dynamic(() => import('@/app/components/PharmacyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[13px] text-[#717786]">
      Cargando mapa...
    </div>
  ),
})

interface ChainPrice { price: number; url: string }

const OPEN_BADGE: Record<OpenState, { label: string; cls: string }> = {
  open:    { label: 'Abierta ahora',        cls: 'bg-secondary/10 text-secondary border-secondary/20' },
  closed:  { label: 'Cerrada ahora',        cls: 'bg-[#fdecec] text-[#c0392b] border-[#f5c6c6]' },
  unknown: { label: 'Horario no verificado', cls: 'bg-black/[0.04] text-[#717786] border-[#e5e7eb]' },
}

export default function CercanasClient() {
  const { status, pharmacies, error, origin, requestLocation, searchByCoords } = useNearbyList()

  // Pin dragged on the map but not yet confirmed. Cleared as soon as any new
  // search starts (the wrappers below), so a stale "search here" never lingers.
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null)
  const locateMe = () => { setPendingPin(null); requestLocation() }
  const goTo = (lat: number, lng: number) => { setPendingPin(null); searchByCoords(lat, lng) }

  // Two location types: all pharmacies (OSM) vs affiliates (our priced chains).
  const [view, setView] = useState<'all' | 'affiliate'>('all')
  const affiliateCount = pharmacies.filter((p) => p.chainName).length
  const shown = view === 'affiliate' ? pharmacies.filter((p) => p.chainName) : pharmacies

  // Optional medication cross-reference (chain-level prices from the scrapers).
  const [medQuery,     setMedQuery]     = useState('')
  const [medSubmitted, setMedSubmitted] = useState('')
  const [medLoading,   setMedLoading]   = useState(false)
  const [chainPrices,  setChainPrices]  = useState<Record<string, ChainPrice>>({})

  async function lookupPrices(e: React.FormEvent) {
    e.preventDefault()
    const q = medQuery.trim()
    if (!q) return
    setMedLoading(true)
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = (await res.json()) as { results?: PharmacyResult[] }
      const map: Record<string, ChainPrice> = {}
      for (const r of data.results ?? []) {
        if (r.availability === 'unavailable') continue
        const cur = map[r.pharmacy]
        if (!cur || r.price < cur.price) map[r.pharmacy] = { price: r.price, url: r.url }
      }
      setChainPrices(map)
      setMedSubmitted(q)
    } catch {
      setChainPrices({})
      setMedSubmitted(q)
    } finally {
      setMedLoading(false)
    }
  }

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-3xl py-8 sm:py-12 w-full">
      <header className="mb-6 grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4 items-center">
        <div>
          <h1 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-[#1a1b1f]">
            Farmacias cercanas
          </h1>
          <p className="text-[14px] text-[#717786] mt-1.5 leading-relaxed">
            Farmacias a 2 km a la redonda, en tiempo real desde OpenStreetMap. Usa tu ubicacion o
            escribe tu direccion. Los precios, cuando existen, vienen de las farmacias en linea que comparamos.
          </p>
        </div>
        <img
          src="/fotos/usando-farmi-calle.webp"
          alt="Persona usando Farmi en la calle para ver farmacias cercanas en el mapa"
          width={900}
          height={1350}
          loading="lazy"
          decoding="async"
          className="hidden sm:block w-full h-[150px] object-cover rounded-2xl border border-white/60 shadow-sm"
        />
      </header>

      {/* Location controls */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm p-5 mb-5">
        <button
          onClick={locateMe}
          disabled={status === 'locating' || status === 'loading'}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
          </svg>
          {status === 'locating' ? 'Ubicando...' : status === 'loading' ? 'Buscando farmacias...' : 'Usar mi ubicacion'}
        </button>

        {/* Manual address entry with autocomplete (also used when geolocation is denied) */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#e5e7eb]" />
          <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide">o ingresa tu direccion</span>
          <div className="flex-1 h-px bg-[#e5e7eb]" />
        </div>
        <div className="mt-3">
          <AddressAutocomplete
            onSelect={(s) => goTo(s.lat, s.lng)}
            placeholder="Direccion, barrio o ciudad (ej: Calle 53 # 25-10, Bogota)"
            disabled={status === 'locating' || status === 'loading'}
          />
          <p className="text-[11px] text-[#9ca3af] mt-1.5">
            Escribe y elige una sugerencia. Luego puedes arrastrar el punto azul del mapa para afinar tu direccion.
          </p>
        </div>

        {error && (
          <p className="mt-3 text-[13px] text-[#c0392b] bg-[#fdecec] border border-[#f5c6c6] rounded-lg px-3 py-2" role="status">
            {error}
          </p>
        )}
      </div>

      {/* Foto ilustrativa mientras el usuario aun no ha buscado */}
      {status === 'idle' && (
        <div className="relative rounded-2xl overflow-hidden border border-white/60 shadow-sm mb-5">
          <img
            src="/fotos/explorando-mapa.webp"
            alt="Persona explorando el mapa de farmacias cercanas de Farmi desde su celular"
            width={900}
            height={1350}
            loading="lazy"
            decoding="async"
            className="w-full h-[200px] sm:h-[260px] object-cover object-[center_35%]"
          />
          <p className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white text-[13px] font-semibold px-4 pt-8 pb-3">
            Encuentra la farmacia mas cercana y llega con indicaciones paso a paso
          </p>
        </div>
      )}

      {/* Medication price cross-reference */}
      {status === 'ready' && pharmacies.length > 0 && (
        <form onSubmit={lookupPrices} className="flex items-stretch gap-2 mb-5">
          <input
            type="text"
            value={medQuery}
            onChange={(e) => setMedQuery(e.target.value)}
            placeholder="Ver precio de un medicamento en estas farmacias"
            aria-label="Medicamento"
            className="flex-1 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] text-[#1a1b1f] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-0"
          />
          <button
            type="submit"
            disabled={!medQuery.trim() || medLoading}
            className="px-4 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer whitespace-nowrap"
          >
            {medLoading ? 'Buscando...' : 'Ver precios'}
          </button>
        </form>
      )}

      {/* Results */}
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#717786]">
          <div className="w-9 h-9 border-4 border-white/50 border-t-primary rounded-full animate-spin" />
          <p className="text-[14px]">Consultando farmacias cercanas...</p>
        </div>
      )}

      {status === 'ready' && pharmacies.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[16px] font-semibold text-[#1a1b1f] mb-1">Sin resultados confiables</p>
          <p className="text-[13px] text-[#717786]">No encontramos farmacias en OpenStreetMap dentro de 2 km. Prueba con otra direccion.</p>
        </div>
      )}

      {status === 'ready' && pharmacies.length > 0 && (
        <>
          {/* Type filter: all vs affiliates */}
          <div className="flex bg-black/[0.05] rounded-xl p-1 mb-4 max-w-xs">
            <button
              onClick={() => setView('all')}
              className={`flex-1 text-[13px] font-semibold py-1.5 rounded-lg transition-all cursor-pointer ${view === 'all' ? 'bg-white text-[#1a1b1f] shadow-sm' : 'text-[#717786]'}`}
            >
              Todas ({pharmacies.length})
            </button>
            <button
              onClick={() => setView('affiliate')}
              className={`flex-1 text-[13px] font-semibold py-1.5 rounded-lg transition-all cursor-pointer ${view === 'affiliate' ? 'bg-white text-primary shadow-sm' : 'text-[#717786]'}`}
            >
              Con precios ({affiliateCount})
            </button>
          </div>

          {/* Map — always visible while browsing nearby pharmacies */}
          {origin && shown.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-white/60 shadow-sm mb-4">
              <div className="flex items-center justify-between gap-3 px-4 py-2 bg-white/70 border-b border-[#f0f1f5] text-[11px] text-[#717786]">
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>
                  Arrastra el punto azul para fijar tu direccion
                </span>
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Con precios</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#9ca3af] inline-block" /> Otra</span>
                </span>
              </div>
              <div className="relative h-[320px] sm:h-[420px] w-full">
                <PharmacyMap origin={origin} pharmacies={shown} onPinDrag={(lat, lng) => setPendingPin({ lat, lng })} />
                {pendingPin && (
                  <button
                    onClick={() => goTo(pendingPin.lat, pendingPin.lng)}
                    className="absolute z-[1100] left-1/2 -translate-x-1/2 bottom-3 flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-full shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                    </svg>
                    Buscar farmacias aqui
                  </button>
                )}
              </div>
            </div>
          )}

          {shown.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[14px] font-semibold text-[#1a1b1f] mb-1">No hay farmacias con precios cerca</p>
              <p className="text-[13px] text-[#717786]">No encontramos sedes de las cadenas que comparamos en este radio. Prueba con &ldquo;Todas&rdquo;.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {shown.map((p) => (
                <PharmacyRow
                  key={p.id}
                  p={p}
                  medSubmitted={medSubmitted}
                  chainPrice={p.chainName ? chainPrices[p.chainName] : undefined}
                />
              ))}
            </ul>
          )}
          <p className="text-[11px] text-[#c1c6d7] mt-5 leading-relaxed">
            Datos de ubicacion: OpenStreetMap (colaboradores de OSM). &ldquo;Con precios&rdquo; son sedes de las
            cadenas cuyos precios comparamos. Farmi es independiente y no esta afiliado a estas farmacias; sus marcas
            pertenecen a sus titulares. La disponibilidad real de cada medicamento puede variar; confirma en la farmacia.
          </p>
        </>
      )}
    </section>
  )
}

function PharmacyRow({
  p, medSubmitted, chainPrice,
}: {
  p: NearbyPharmacyView
  medSubmitted: string
  chainPrice?: ChainPrice
}) {
  const badge = OPEN_BADGE[p.openState]

  return (
    <li className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-xl shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-[15px] font-bold text-[#1a1b1f] leading-tight">{p.name}</h2>
            {p.chainName ? (
              <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full">
                {p.chainName}
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-[#717786] bg-black/[0.04] border border-[#e5e7eb] px-2 py-0.5 rounded-full">
                Otra farmacia
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[12px] font-semibold text-secondary">
              a {formatDistance(p.distanceKm)} &middot; {formatTripShort(p.distanceKm)}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
          {p.address && <p className="text-[12px] text-[#717786] mt-1">{p.address}</p>}
          {p.openingHours && (
            <p className="text-[11px] text-[#9ca3af] mt-0.5 tabular-nums">{p.openingHours}</p>
          )}
        </div>

        <a
          href={directionsUrl(p.lat, p.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1 text-[12px] font-semibold text-secondary bg-secondary/8 border border-secondary/20 hover:bg-secondary/15 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          Como llegar
        </a>
      </div>

      {/* Price section */}
      <div className="mt-3 pt-3 border-t border-[#f0f1f5]">
        {medSubmitted ? (
          chainPrice ? (
            <Link
              href={`/buscar?q=${encodeURIComponent(medSubmitted)}`}
              className="flex items-center justify-between gap-2 group"
            >
              <span className="text-[13px] text-[#414755]">
                <span className="capitalize">{medSubmitted}</span> desde{' '}
                <span className="font-bold text-[#1a1b1f]">{formatCOP(chainPrice.price)}</span>
                <span className="text-[#9ca3af]"> en {p.chainName}</span>
              </span>
              <span className="text-[12px] font-semibold text-primary group-hover:opacity-75 whitespace-nowrap">Ver precios</span>
            </Link>
          ) : p.chainName ? (
            <p className="text-[12px] text-[#717786]">Sin resultados para &ldquo;{medSubmitted}&rdquo; en {p.chainName}</p>
          ) : (
            <p className="text-[12px] text-[#9ca3af]">Sin datos de precios para esta farmacia</p>
          )
        ) : p.chainName ? (
          <p className="text-[12px] text-[#717786]">
            Comparamos precios en linea de {p.chainName}. Escribe un medicamento arriba para verlos.
          </p>
        ) : (
          <p className="text-[12px] text-[#9ca3af]">Sin datos de precios para esta farmacia</p>
        )}
      </div>
    </li>
  )
}
