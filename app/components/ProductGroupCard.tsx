'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ProductGroup } from '@/app/utils/groupResults'
import { MedicationImage } from './MedicationImage'
import { PharmacyLogo } from './PharmacyLogo'
import { WishlistButton } from './WishlistButton'
import { formatCOP } from '@/app/utils/format'
import { normalize } from '@/app/utils/search'

interface Props { group: ProductGroup }

function GroupThumbnail({ imageUrl, ingredient }: { imageUrl?: string; ingredient: string }) {
  const [failed, setFailed] = useState(false)
  if (imageUrl && !failed) {
    return (
      <div className="w-full h-[80px] relative overflow-hidden rounded-t-xl bg-white">
        <img src={imageUrl} alt="" onError={() => setFailed(true)} className="w-full h-full object-contain p-2" />
      </div>
    )
  }
  return <MedicationImage ingredient={ingredient} height={80} />
}

export function ProductGroupCard({ group }: Props) {
  const { results, minPrice, maxPrice, savings } = group
  const avail    = results.filter(r => r.availability !== 'unavailable')
  const cheapest = avail[0] ?? null
  const slug     = normalize(group.activeIngredient)
  const hasMany  = avail.length > 1

  return (
    <article className="group relative flex flex-col bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-xl shadow-sm hover:bg-white/85 hover:shadow-[0_8px_32px_rgba(0,88,188,0.10)] transition-all duration-300 overflow-hidden">

      {/* Thumbnail */}
      <GroupThumbnail imageUrl={group.imageUrl} ingredient={group.activeIngredient} />

      {/* Savings badge */}
      {savings > 1000 && (
        <span className="absolute top-2 left-2 bg-secondary text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm z-10">
          Ahorras {formatCOP(savings)}
        </span>
      )}

      {/* "en X farmacias" badge */}
      {hasMany && (
        <span className="absolute top-2 right-2 text-[9px] font-bold bg-primary/90 text-white px-2 py-0.5 rounded-full z-10 whitespace-nowrap">
          {avail.length} farmacias
        </span>
      )}

      <div className="flex flex-col gap-3 p-4 flex-1">

        {/* Product info header */}
        <div className="flex items-start gap-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            results[0]?.type === 'generic'
              ? 'bg-secondary/10 text-secondary border border-secondary/20'
              : 'bg-primary/10 text-primary border border-primary/20'
          }`}>
            {results[0]?.type === 'generic' ? 'Generico' : 'Marca'}
          </span>
          <p className="text-[11px] font-medium text-[#414755] leading-snug">
            {group.activeIngredient
              ? <>
                  {group.activeIngredient}{group.concentration ? ` ${group.concentration}` : ''}
                  {group.presentation && (
                    <><span className="text-[#c1c6d7] mx-1">&bull;</span>{group.quantity} {group.presentation}s</>
                  )}
                </>
              : results[0]?.productName
            }
          </p>
        </div>

        {/* Price range */}
        <div className="flex items-baseline justify-between bg-white/60 border border-white/40 rounded-lg px-3.5 py-2">
          <div>
            {hasMany && (
              <p className="text-[10px] text-[#717786] leading-none mb-0.5">
                Desde
              </p>
            )}
            <span className="text-[22px] font-bold leading-[28px] text-[#1a1b1f] tabular-nums">
              {formatCOP(minPrice)}
            </span>
          </div>
          {hasMany && (
            <span className="text-[11px] text-[#c1c6d7] tabular-nums">
              hasta {formatCOP(maxPrice)}
            </span>
          )}
        </div>

        {/* Pharmacy comparison rows */}
        <div className="rounded-lg border border-white/40 bg-white/40 divide-y divide-white/60 overflow-hidden">
          {results.map((r) => {
            const unavail  = r.availability === 'unavailable'
            const isBest   = !unavail && r.price === minPrice && hasMany
            return (
              <div
                key={r.id}
                className={`flex items-center gap-2 px-2.5 py-2 ${unavail ? 'opacity-40' : isBest ? 'bg-secondary/[0.04]' : ''}`}
              >
                <PharmacyLogo name={r.pharmacy} size={22} />
                <span className="text-[11px] font-semibold text-[#414755] flex-1 truncate min-w-0">
                  {r.pharmacy}
                </span>
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
              href={`/medicamento/${encodeURIComponent(slug)}`}
              className="text-[11px] font-semibold text-[#717786] hover:text-primary transition-colors"
            >
              Info
            </Link>
          </div>
          {cheapest && <WishlistButton result={cheapest} />}
        </div>

        {/* CTA — cheapest pharmacy */}
        {cheapest && (
          <a
            href={cheapest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-primary to-tertiary text-white hover:opacity-90 transition-opacity cursor-pointer"
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
