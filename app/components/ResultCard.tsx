'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PharmacyResult } from '@/app/types'
import { PharmacyLogo } from './PharmacyLogo'
import { MedicationImage } from './MedicationImage'
import { WishlistButton } from './WishlistButton'
import { CartButton } from './CartButton'
import { formatCOP } from '@/app/utils/format'
import { thumbnailUrl } from '@/app/utils/imageUrl'
import { normalize } from '@/app/utils/search'
import { formatDistance, formatTripShort, formatTrip, directionsUrl } from '@/app/utils/geo'
import type { NearestStore } from '@/app/hooks/useNearbyPharmacies'

const LIQUID_PRESENTATIONS = new Set(['Jarabe', 'Solucion', 'Gotas', 'Suspension', 'Spray'])

function qtyDisplay(quantity: number, presentation: string): string {
  if (LIQUID_PRESENTATIONS.has(presentation)) return `${quantity}ml`
  if (!presentation) return `× ${quantity}`
  return `${quantity} ${presentation}${quantity !== 1 ? 's' : ''}`
}

const AVAILABILITY_LABEL: Record<PharmacyResult['availability'], string> = {
  available: 'Disponible',
  limited: 'Stock limitado',
  unavailable: 'Agotado',
}

const AVAILABILITY_DOT: Record<PharmacyResult['availability'], string> = {
  available: 'bg-secondary',
  limited: 'bg-amber-500',
  unavailable: 'bg-[#c1c6d7]',
}

const AVAILABILITY_TEXT: Record<PharmacyResult['availability'], string> = {
  available: 'text-secondary',
  limited: 'text-amber-600',
  unavailable: 'text-[#717786]',
}

interface Props {
  result: PharmacyResult
  isCheapest: boolean
  /** Badge text for the cheapest item (varies with the total vs per-unit basis) */
  cheapestLabel?: string
  distanceKm?: number
  store?: NearestStore
}

function ProductThumbnail({ imageUrl, ingredient }: { imageUrl?: string; ingredient: string }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (imageUrl && !imgFailed) {
    return (
      <div className="w-full h-[80px] relative overflow-hidden rounded-t-xl bg-white">
        <img
          src={thumbnailUrl(imageUrl, 200)}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain p-2"
        />
      </div>
    )
  }

  return <MedicationImage ingredient={ingredient} height={80} />
}

export default function ResultCard({ result, isCheapest, cheapestLabel = 'Mejor precio', distanceKm, store }: Props) {
  const slug = normalize(result.activeIngredient)
  const perUnitHighlight = isCheapest && cheapestLabel !== 'Mejor precio'

  function goToPharmacy(e: React.MouseEvent) {
    // Only follow the card click if not clicking an interactive child
    const tag = (e.target as HTMLElement).tagName
    if (tag === 'A' || tag === 'BUTTON') return
    if (!result.url) return
    window.open(result.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <article
      onClick={goToPharmacy}
      className={`
        group relative flex flex-col cursor-pointer
        bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-xl shadow-sm
        hover:bg-white/85 hover:backdrop-blur-[40px]
        hover:shadow-[0_8px_32px_rgba(0,88,188,0.10)]
        transition-all duration-300 overflow-hidden
        ${result.availability === 'unavailable' ? 'opacity-65' : ''}
      `}
    >
      {/* Product thumbnail — real image with SVG fallback */}
      <ProductThumbnail imageUrl={result.imageUrl} ingredient={result.activeIngredient} />

      {/* Discount badge */}
      {result.discount && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm z-10">
          -{result.discount}%
        </span>
      )}

      {/* Cheapest badge */}
      {isCheapest && (
        <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] font-bold tracking-wide bg-secondary text-white px-2 py-0.5 rounded-full whitespace-nowrap z-10">
          {cheapestLabel}
        </span>
      )}

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Pharmacy row */}
        <div className="flex items-start gap-2.5">
          <PharmacyLogo name={result.pharmacy} size={32} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-semibold text-[13px] leading-[18px] text-[#1a1b1f] truncate">
                {result.pharmacy}
              </p>
              {distanceKm !== undefined && (
                <span
                  className="shrink-0 text-[10px] font-semibold text-secondary bg-secondary/10 border border-secondary/20 px-1.5 py-0.5 rounded-full leading-none"
                  title={`A ${formatDistance(distanceKm)} · ${formatTrip(distanceKm)}`}
                >
                  {formatDistance(distanceKm)} · {formatTripShort(distanceKm)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#717786] mt-0.5 truncate leading-snug">
              {result.productName}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <CartButton result={result} />
            <WishlistButton result={result} />
          </div>
        </div>

        {/* Generic/Brand badge + ingredient */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              result.type === 'generic'
                ? 'bg-secondary/10 text-secondary border border-secondary/20'
                : 'bg-primary/10 text-primary border border-primary/20'
            }`}
          >
            {result.type === 'generic' ? 'Generico' : 'Marca'}
          </span>
          <p className="text-[11px] font-medium text-[#414755] leading-snug">
            {result.activeIngredient}{result.concentration ? ` ${result.concentration}` : ''}
            {result.presentation ? (
              <>
                <span className="text-[#c1c6d7] mx-1">&bull;</span>
                {qtyDisplay(result.quantity, result.presentation)}
              </>
            ) : null}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline justify-between bg-white/60 border border-white/40 rounded-lg px-3.5 py-2.5">
          <div>
            {result.referencePrice && (
              <p className="text-[11px] text-[#c1c6d7] line-through tabular-nums leading-none mb-0.5">
                {formatCOP(result.referencePrice)}
              </p>
            )}
            <span className="text-[22px] font-bold leading-[30px] text-[#1a1b1f] tabular-nums">
              {formatCOP(result.price)}
            </span>
          </div>
          <span className={`text-[11px] tabular-nums ${perUnitHighlight ? 'font-bold text-secondary' : 'font-semibold text-[#717786]'}`}>
            {formatCOP(result.pricePerUnit)}{LIQUID_PRESENTATIONS.has(result.presentation) ? '/ml' : '/und'}
          </span>
        </div>

        {/* Cómo llegar — only when location is active and we have the branch coords */}
        {store && (
          <a
            href={directionsUrl(store.lat, store.lng)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold text-secondary bg-secondary/8 border border-secondary/20 hover:bg-secondary/15 transition-colors"
            title={`Sede más cercana · ${formatTrip(store.km)}`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            Cómo llegar
          </a>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${AVAILABILITY_DOT[result.availability]}`} />
            <span className={`text-[11px] font-semibold ${AVAILABILITY_TEXT[result.availability]}`}>
              {AVAILABILITY_LABEL[result.availability]}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/historial/${encodeURIComponent(slug)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-semibold text-[#717786] hover:text-primary transition-colors"
            >
              Historial
            </Link>
            <Link
              href={`/medicamento/${encodeURIComponent(slug)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-semibold text-[#717786] hover:text-primary transition-colors"
            >
              Info
            </Link>
          </div>
        </div>

        {/* Comprar CTA */}
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`
            w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg
            text-[13px] font-semibold transition-opacity
            ${result.availability === 'unavailable'
              ? 'bg-[#f0f1f5] text-[#717786] cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-tertiary text-white hover:opacity-90 cursor-pointer'
            }
          `}
        >
          Comprar en {result.pharmacy}
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </article>
  )
}
