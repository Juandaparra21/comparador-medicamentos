'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useNearbyList } from '@/app/hooks/useNearbyList'
import { AddressAutocomplete } from '@/app/components/AddressAutocomplete'

const PharmacyMap = dynamic(() => import('@/app/components/PharmacyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[13px] text-[#717786]">
      Cargando mapa...
    </div>
  ),
})

export function NearbyMapSection() {
  const { status, pharmacies, error, origin, requestLocation, searchByCoords } = useNearbyList()

  // Pin dragged on the map but not yet confirmed; cleared as soon as any new
  // search starts via the wrappers below.
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null)
  const locateMe = () => { setPendingPin(null); requestLocation() }
  const goTo = (lat: number, lng: number) => { setPendingPin(null); searchByCoords(lat, lng) }

  // Two location types: all pharmacies vs affiliates (our priced chains).
  const [view, setView] = useState<'all' | 'affiliate'>('all')
  const affiliateCount = pharmacies.filter((p) => p.chainName).length
  const shown = view === 'affiliate' ? pharmacies.filter((p) => p.chainName) : pharmacies

  const busy   = status === 'locating' || status === 'loading'
  const showMap = status === 'ready' && origin !== null && pharmacies.length > 0

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-12">
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-[#f0f1f5]">
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#1a1b1f]">
              Farmacias cerca de ti
            </h2>
            <p className="text-[13px] text-[#717786] mt-0.5">
              A 2 km a la redonda. Ubicaciones reales en el mapa, desde OpenStreetMap.
            </p>
          </div>
          {status === 'ready' && (
            <Link
              href="/cercanas"
              className="text-[13px] font-semibold text-primary hover:opacity-75 transition-opacity whitespace-nowrap"
            >
              Ver lista completa &rarr;
            </Link>
          )}
        </div>

        {/* Body */}
        {status === 'idle' && (
          <div className="p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={locateMe}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
              Usar mi ubicación
            </button>
            <div className="flex-1">
              <AddressAutocomplete
                onSelect={(s) => goTo(s.lat, s.lng)}
                placeholder="O escribe tu dirección o barrio"
              />
            </div>
          </div>
        )}

        {busy && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#717786]">
            <div className="w-9 h-9 border-4 border-white/50 border-t-primary rounded-full animate-spin" />
            <p className="text-[14px]">{status === 'locating' ? 'Obteniendo tu ubicación...' : 'Buscando farmacias...'}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="p-5">
            <p className="text-[13px] text-[#c0392b] bg-[#fdecec] border border-[#f5c6c6] rounded-lg px-3 py-2 mb-3" role="status">
              {error}
            </p>
            <AddressAutocomplete
              onSelect={(s) => searchByCoords(s.lat, s.lng)}
              placeholder="Escribe tu dirección o barrio (ej: Calle 53 # 25-10, Bogotá)"
            />
          </div>
        )}

        {status === 'ready' && pharmacies.length === 0 && (
          <div className="text-center py-16 px-5">
            <p className="text-[15px] font-semibold text-[#1a1b1f] mb-1">Sin resultados confiables</p>
            <p className="text-[13px] text-[#717786]">No encontramos farmacias en OpenStreetMap dentro de 2 km. Prueba con otra dirección.</p>
          </div>
        )}

        {showMap && origin && (
          <>
            {/* Manual location change — always available once results are shown */}
            <div className="px-5 pt-4">
              <AddressAutocomplete
                onSelect={(s) => goTo(s.lat, s.lng)}
                placeholder="Cambiar ubicación: escribe tu dirección"
              />
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-2 px-5 pt-4 flex-wrap">
              <div className="flex bg-black/[0.05] rounded-lg p-0.5">
                <button
                  onClick={() => setView('all')}
                  className={`text-[12px] font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${view === 'all' ? 'bg-white text-[#1a1b1f] shadow-sm' : 'text-[#717786]'}`}
                >
                  Todas ({pharmacies.length})
                </button>
                <button
                  onClick={() => setView('affiliate')}
                  className={`text-[12px] font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${view === 'affiliate' ? 'bg-white text-primary shadow-sm' : 'text-[#717786]'}`}
                >
                  Con precios ({affiliateCount})
                </button>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-3 ml-auto text-[11px] text-[#717786]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Con precios</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#9ca3af] inline-block" /> Otra</span>
              </div>
            </div>

            <p className="flex items-center gap-1.5 px-5 pt-3 text-[11px] font-semibold text-primary">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>
              Arrastra el punto azul del mapa para fijar tu dirección
            </p>
            <div className="relative h-[340px] sm:h-[440px] w-full mt-1">
              <PharmacyMap origin={origin} pharmacies={shown} onPinDrag={(lat, lng) => setPendingPin({ lat, lng })} />
              {pendingPin && (
                <button
                  onClick={() => goTo(pendingPin.lat, pendingPin.lng)}
                  className="absolute z-[1100] left-1/2 -translate-x-1/2 bottom-3 flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-full shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                  </svg>
                  Buscar farmacias aquí
                </button>
              )}
            </div>
            <p className="text-[12px] text-[#717786] px-5 py-3 border-t border-[#f0f1f5]">
              {view === 'affiliate'
                ? <><span className="font-semibold text-primary">{affiliateCount}</span> farmacias cuyos precios comparamos, cerca de ti.</>
                : <><span className="font-semibold text-[#1a1b1f]">{pharmacies.length}</span> farmacias cerca de ti, <span className="font-semibold text-primary">{affiliateCount}</span> con precios en Farmi.</>}
              {' '}Toca un marcador para ver detalles.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
