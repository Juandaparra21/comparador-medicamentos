'use client'

import Link from 'next/link'
import type { PharmacyResult } from '@/app/types'
import { PharmacyLogo } from './PharmacyLogo'
import { ProductThumbnail } from './ProductThumbnail'
import { WishlistButton } from './WishlistButton'
import { CartButton } from './CartButton'
import { RelativeTime } from './RelativeTime'
import { formatCOP } from '@/app/utils/format'
import { normalize } from '@/app/utils/search'
import { formatDistance, formatTripShort, formatTrip, directionsUrl } from '@/app/utils/geo'
import { formatQuantity, perUnitSuffix } from '@/app/utils/units'
import { getMedicineInfo } from '@/app/utils/medicineInfo'
import type { NearestStore } from '@/app/hooks/useNearbyPharmacies'

// Quantity meaning + display come from the shared units module so the volume/unit
// rules never drift between the cards, the filters and the scrapers.

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
  /** ISO time this price was retrieved live (drives "Actualizado hace X") */
  fetchedAt?: string
}

export default function ResultCard({ result, isCheapest, cheapestLabel = 'Mejor precio', distanceKm, store, fetchedAt }: Props) {
  const slug = normalize(result.activeIngredient)
  const perUnitHighlight = isCheapest && cheapestLabel !== 'Mejor precio'
  const hasInfo = getMedicineInfo(slug) !== null

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
        glass-card glass-card-hover rounded-3xl
        transition-all duration-300 overflow-hidden
        ${result.availability === 'unavailable' ? 'opacity-65' : ''}
      `}
    >
      {/* Miniatura del producto — imagen real de la farmacia con respaldo SVG */}
      <ProductThumbnail imageUrl={result.imageUrl} ingredient={result.activeIngredient} />

      {/* Discount badge */}
      {result.discount && (
        <span className="absolute top-2 left-2 bg-error text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm z-10">
          -{result.discount}%
        </span>
      )}

      {/* Cheapest badge */}
      {isCheapest && (
        <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold tracking-[0.05em] uppercase bg-secondary text-white px-2.5 py-1 rounded-full whitespace-nowrap shadow-md z-10">
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
          </svg>
          {cheapestLabel}
        </span>
      )}

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Pharmacy row */}
        <div className="flex items-start gap-2.5">
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-inner shrink-0">
            <PharmacyLogo name={result.pharmacy} size={30} />
          </div>
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
            {result.type === 'generic' ? 'Genérico' : 'Marca'}
          </span>
          <p className="text-[11px] font-medium text-[#414755] leading-snug">
            {result.activeIngredient}{result.concentration ? ` ${result.concentration}` : ''}
            {result.presentation ? (
              <>
                <span className="text-[#c1c6d7] mx-1">&bull;</span>
                {formatQuantity(result.quantity, result.presentation)}
              </>
            ) : null}
          </p>
        </div>

        {/* Price — subcapa de vidrio mas opaca, como en el diseno de referencia */}
        <div className="flex items-baseline justify-between glass-card-opaque rounded-2xl px-3.5 py-2.5">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.05em] uppercase text-[#717786] leading-none mb-1">
              Precio
            </p>
            {result.referencePrice && (
              <p className="text-[11px] text-[#c1c6d7] line-through tabular-nums leading-none mb-0.5">
                {formatCOP(result.referencePrice)}
              </p>
            )}
            <span className={`text-[24px] font-bold leading-[30px] tabular-nums ${isCheapest ? 'text-primary' : 'text-[#1a1b1f]'}`}>
              {formatCOP(result.price)}
            </span>
          </div>
          {result.quantity > 1 && (
            <span className={`text-[11px] tabular-nums ${perUnitHighlight ? 'font-bold text-secondary' : 'font-semibold text-[#717786]'}`}>
              {formatCOP(result.pricePerUnit)}{perUnitSuffix(result.presentation)}
            </span>
          )}
        </div>

        {/* Cuándo se consultó este precio (timestamp real de la búsqueda) */}
        {fetchedAt && (
          <div className="flex items-center gap-1 -mt-1 text-[10px] text-[#9ca3af]">
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .27.144.518.378.651l3 1.714a.75.75 0 10.744-1.302L10.75 9.566V5z" clipRule="evenodd" />
            </svg>
            <RelativeTime iso={fetchedAt} prefix="Actualizado" />
          </div>
        )}

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
              href={hasInfo ? `/precio/${encodeURIComponent(slug)}` : '/precio/no-disponible'}
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
            w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl
            text-[13px] font-semibold transition-opacity
            ${result.availability === 'unavailable'
              ? 'bg-[#f0f1f5] text-[#717786] cursor-not-allowed'
              : 'vitality-gradient text-white hover:opacity-90 cursor-pointer'
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
