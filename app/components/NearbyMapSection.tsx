'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useNearbyList } from '@/app/hooks/useNearbyList'

const PharmacyMap = dynamic(() => import('@/app/components/PharmacyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[13px] text-[#717786]">
      Cargando mapa...
    </div>
  ),
})

export function NearbyMapSection() {
  const { status, pharmacies, error, origin, requestLocation, searchByPlace } = useNearbyList()
  const [place, setPlace] = useState('')

  const busy   = status === 'locating' || status === 'loading'
  const showMap = status === 'ready' && origin !== null && pharmacies.length > 0

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-12">
      <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-[#f0f1f5]">
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#1a1b1f]">
              Farmacias cerca de ti
            </h2>
            <p className="text-[13px] text-[#717786] mt-0.5">
              Ubicaciones reales en el mapa, desde OpenStreetMap.
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
              onClick={requestLocation}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
              Usar mi ubicacion
            </button>
            <form
              onSubmit={(e) => { e.preventDefault(); searchByPlace(place) }}
              className="flex items-stretch gap-2 flex-1"
            >
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="O escribe tu ciudad o barrio"
                aria-label="Ciudad o barrio"
                className="flex-1 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] text-[#1a1b1f] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-0"
              />
              <button
                type="submit"
                disabled={!place.trim()}
                className="px-4 py-2.5 bg-white border border-[#e5e7eb] text-[#414755] text-[14px] font-semibold rounded-lg hover:border-primary/40 hover:text-primary disabled:opacity-50 transition-colors cursor-pointer"
              >
                Buscar
              </button>
            </form>
          </div>
        )}

        {busy && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#717786]">
            <div className="w-9 h-9 border-4 border-white/50 border-t-primary rounded-full animate-spin" />
            <p className="text-[14px]">{status === 'locating' ? 'Obteniendo tu ubicacion...' : 'Buscando farmacias...'}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="p-5">
            <p className="text-[13px] text-[#c0392b] bg-[#fdecec] border border-[#f5c6c6] rounded-lg px-3 py-2 mb-3" role="status">
              {error}
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); searchByPlace(place) }}
              className="flex items-stretch gap-2"
            >
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Escribe tu ciudad o barrio (ej: Chapinero, Bogota)"
                aria-label="Ciudad o barrio"
                className="flex-1 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] text-[#1a1b1f] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-0"
              />
              <button
                type="submit"
                disabled={!place.trim()}
                className="px-4 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              >
                Buscar
              </button>
            </form>
          </div>
        )}

        {status === 'ready' && pharmacies.length === 0 && (
          <div className="text-center py-16 px-5">
            <p className="text-[15px] font-semibold text-[#1a1b1f] mb-1">Sin resultados confiables</p>
            <p className="text-[13px] text-[#717786]">No encontramos farmacias en OpenStreetMap dentro de 10 km.</p>
          </div>
        )}

        {showMap && origin && (
          <>
            <div className="h-[340px] sm:h-[440px] w-full">
              <PharmacyMap origin={origin} pharmacies={pharmacies} />
            </div>
            <p className="text-[12px] text-[#717786] px-5 py-3 border-t border-[#f0f1f5]">
              <span className="font-semibold text-[#1a1b1f]">{pharmacies.length}</span> farmacias cerca de ti.
              Toca un marcador para ver detalles y como llegar.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
