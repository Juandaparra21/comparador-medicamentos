'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ProductGroup } from '@/app/utils/groupResults'
import { MedicationImage } from './MedicationImage'
import { PharmacyLogo } from './PharmacyLogo'
import { WishlistButton } from './WishlistButton'
import { CartButton } from './CartButton'
import { RelativeTime } from './RelativeTime'
import { formatCOP } from '@/app/utils/format'
import { thumbnailUrl } from '@/app/utils/imageUrl'
import { normalize } from '@/app/utils/search'
import { formatDistance, formatTripShort, formatTrip, directionsUrl } from '@/app/utils/geo'
import { formatQuantity, perUnitSuffix } from '@/app/utils/units'
import type { PharmacyDistances, PharmacyStores } from '@/app/hooks/useNearbyPharmacies'

interface Props { group: ProductGroup; priceBasis?: 'total' | 'unit'; distances?: PharmacyDistances; stores?: PharmacyStores; fetchedAt?: string }

function GroupThumbnail({ imageUrl, ingredient }: { imageUrl?: string; ingredient: string }) {
  const [failed, setFailed] = useState(false)
  if (imageUrl && !failed) {
    return (
      <div className="w-full h-[80px] relative overflow-hidden rounded-t-xl bg-white">
        <img src={thumbnailUrl(imageUrl, 120)} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} className="w-full h-full object-contain p-2" />
      </div>
    )
  }
  return <MedicationImage ingredient={ingredient} height={80} />
}

export function ProductGroupCard({ group, priceBasis = 'total', distances, stores, fetchedAt }: Props) {
  const { results, minPrice, maxPrice, savings } = group
  const avail    = results.filter(r => r.availability !== 'unavailable')
  const cheapest = avail[0] ?? null
  const slug     = normalize(group.activeIngredient)
  const hasMany  = avail.length > 1
  // Savings vs the most expensive pharmacy for the same product (real, not invented)
  const savingsPct = savings > 0 && maxPrice > 0 ? Math.round((savings / maxPrice) * 100) : 0
  const unitSuffix = perUnitSuffix(group.presentation)

  return (
    <article className="group relative flex flex-col glass-card glass-card-hover rounded-3xl transition-all duration-300 overflow-hidden">

      {/* Miniatura del producto — imagen real de la farmacia con respaldo SVG */}
      <GroupThumbnail imageUrl={group.imageUrl} ingredient={group.activeIngredient} />

      <div className="flex flex-col gap-3 p-4 flex-1">

        {/* Badges: ahorro + número de farmacias */}
        {(savings > 1000 || hasMany) && (
          <div className="flex items-center justify-between gap-2">
            {savings > 1000 ? (
              <span className="flex items-center gap-1 bg-secondary text-white text-[11px] font-black px-2.5 py-1 rounded-full whitespace-nowrap shadow-md">
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                </svg>
                Ahorras {formatCOP(savings)}{savingsPct >= 5 ? ` (${savingsPct}%)` : ''}
              </span>
            ) : <span />}
            {hasMany && (
              <span className="shrink-0 text-[9px] font-bold bg-primary/90 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                {avail.length} farmacias
              </span>
            )}
          </div>
        )}

        {/* Product info header */}
        <div className="flex items-start gap-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            results[0]?.type === 'generic'
              ? 'bg-secondary/10 text-secondary border border-secondary/20'
              : 'bg-primary/10 text-primary border border-primary/20'
          }`}>
            {results[0]?.type === 'generic' ? 'Genérico' : 'Marca'}
          </span>
          <p className="text-[12px] font-semibold text-[#414755] leading-snug">
            {group.activeIngredient
              ? <>
                  {group.activeIngredient}{group.concentration ? ` ${group.concentration}` : ''}
                  {group.presentation && (
                    <><span className="text-[#c1c6d7] mx-1">&bull;</span>{formatQuantity(group.quantity, group.presentation)}</>
                  )}
                </>
              : results[0]?.productName
            }
          </p>
        </div>

        {/* Price range — subcapa de vidrio mas opaca */}
        <div className="flex items-baseline justify-between glass-card-opaque rounded-2xl px-3.5 py-2.5">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.05em] uppercase text-[#717786] leading-none mb-1">
              {hasMany ? 'Desde' : 'Precio'}
            </p>
            <span className="text-[24px] font-bold leading-[28px] text-primary tabular-nums">
              {formatCOP(minPrice)}
            </span>
            {group.quantity > 1 && (
              <span className={`block text-[11px] tabular-nums mt-0.5 ${priceBasis === 'unit' ? 'font-bold text-secondary' : 'font-semibold text-[#717786]'}`}>
                {formatCOP(group.minPricePerUnit)}{unitSuffix}
              </span>
            )}
          </div>
          {hasMany && (
            <span className="text-[11px] text-[#c1c6d7] tabular-nums">
              hasta {formatCOP(maxPrice)}
            </span>
          )}
        </div>

        {/* Pharmacy comparison rows — filas de vidrio; la mas barata lleva
            borde verde a la izquierda, como en el diseno de referencia */}
        <div className="flex flex-col gap-1.5">
          {results.map((r) => {
            const unavail  = r.availability === 'unavailable'
            const isBest   = !unavail && r.price === minPrice && hasMany
            return (
              <div
                key={r.id}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-xl ${
                  unavail ? 'glass-row opacity-40' : isBest ? 'glass-card border-l-4 border-l-secondary' : 'glass-row'
                }`}
              >
                <PharmacyLogo name={r.pharmacy} size={22} />
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-semibold text-[#414755] truncate">
                    {r.pharmacy}
                  </span>
                  {distances?.[r.pharmacy] !== undefined && (
                    stores?.[r.pharmacy] ? (
                      <a
                        href={directionsUrl(stores[r.pharmacy].lat, stores[r.pharmacy].lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Cómo llegar · ${formatTrip(distances[r.pharmacy])}`}
                        className="inline-block mt-0.5 text-[9px] font-bold text-secondary bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap transition-colors"
                      >
                        {formatDistance(distances[r.pharmacy])} · {formatTripShort(distances[r.pharmacy])}
                      </a>
                    ) : (
                      <span className="inline-block mt-0.5 text-[9px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap">
                        {formatDistance(distances[r.pharmacy])}
                      </span>
                    )
                  )}
                </div>
                <span className={`text-[12px] font-bold tabular-nums shrink-0 ${isBest ? 'text-secondary' : 'text-[#1a1b1f]'}`}>
                  {formatCOP(r.price)}
                </span>
                {isBest && (
                  <span className="text-[8px] font-black text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-full shrink-0 leading-none">
                    MIN
                  </span>
                )}
                {!unavail ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                      isBest
                        ? 'bg-secondary text-white hover:opacity-90'
                        : 'bg-white/80 border border-[#e5e7eb] text-[#414755] hover:text-primary hover:border-primary/30'
                    }`}
                  >
                    Ir
                  </a>
                ) : (
                  <span className="text-[10px] text-[#c1c6d7] shrink-0">Agotado</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Cuándo se consultaron estos precios (timestamp real de la búsqueda) */}
        {fetchedAt && (
          <div className="flex items-center gap-1 text-[10px] text-[#9ca3af]">
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .27.144.518.378.651l3 1.714a.75.75 0 10.744-1.302L10.75 9.566V5z" clipRule="evenodd" />
            </svg>
            <RelativeTime iso={fetchedAt} prefix="Actualizado" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            <Link
              href={`/historial/${encodeURIComponent(slug)}`}
              className="text-[11px] font-semibold text-[#717786] hover:text-primary transition-colors"
            >
              Historial
            </Link>
            <Link
              href={`/precio/${encodeURIComponent(slug)}`}
              className="text-[11px] font-semibold text-[#717786] hover:text-primary transition-colors"
            >
              Info
            </Link>
          </div>
          {cheapest && (
            <div className="flex items-center gap-1">
              <CartButton result={cheapest} />
              <WishlistButton result={cheapest} />
            </div>
          )}
        </div>

        {/* CTA — cheapest pharmacy */}
        {cheapest && (
          <a
            href={cheapest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold vitality-gradient text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            Comprar en {cheapest.pharmacy}
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          </a>
        )}
      </div>
    </article>
  )
}
