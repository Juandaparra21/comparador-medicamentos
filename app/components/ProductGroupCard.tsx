'use client'

import type { ProductGroup } from '@/app/utils/groupResults'
import { formatCOP } from '@/app/utils/format'
import { MedicationImage } from '@/app/components/MedicationImage'
import { WishlistButton } from '@/app/components/WishlistButton'

interface Props { group: ProductGroup }

export function ProductGroupCard({ group }: Props) {
  const { results, minPrice, maxPrice, savings } = group
  const available = results.filter(r => r.availability !== 'unavailable')
  const cheapest  = available[0] ?? null

  return (
    <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm overflow-hidden hover:shadow-[0_8px_32px_rgba(0,88,188,0.10)] transition-all duration-300">

      {/* ── Header ── */}
      <div className="flex gap-3 p-4 pb-3">
        <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden">
          <MedicationImage ingredient={group.activeIngredient || group.displayName} height={56} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[14px] text-[#1a1b1f] leading-snug line-clamp-2">
            {group.activeIngredient || group.displayName}
          </p>
          <p className="text-[12px] text-[#717786] mt-0.5">
            {[group.concentration, group.quantity > 1 ? `× ${group.quantity}` : null, group.presentation]
              .filter(Boolean).join(' · ')}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[18px] font-bold text-[#1a1b1f] tabular-nums leading-none">
              {formatCOP(minPrice)}
            </span>
            {savings > 1000 && (
              <span className="text-[10px] font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20 whitespace-nowrap">
                Ahorras hasta {formatCOP(savings)}
              </span>
            )}
          </div>
        </div>
        {cheapest && (
          <div onClick={e => e.stopPropagation()}>
            <WishlistButton result={cheapest} />
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-[#e5e7eb]/60 mx-4" />

      {/* ── Pharmacy rows ── */}
      <div className="divide-y divide-[#f3f4f6]">
        {results.map((r) => {
          const unavail   = r.availability === 'unavailable'
          const isBest    = !unavail && available.length > 1 && r.price === minPrice
          const isWorst   = !unavail && available.length > 1 && r.price === maxPrice
          const pct       = maxPrice > minPrice
            ? Math.round(((r.price - minPrice) / (maxPrice - minPrice)) * 100)
            : 0

          return (
            <div
              key={r.id}
              className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                unavail ? 'opacity-40' : isBest ? 'bg-secondary/[0.03]' : 'hover:bg-black/[0.01]'
              }`}
            >
              {/* Pharmacy */}
              <div className="w-[110px] shrink-0">
                <p className="text-[12px] font-semibold text-[#414755] leading-tight truncate">
                  {r.pharmacy}
                </p>
                {unavail && <p className="text-[10px] text-[#c1c6d7]">No disponible</p>}
                {r.discount && !unavail && (
                  <p className="text-[10px] font-semibold text-primary">-{r.discount}%</p>
                )}
              </div>

              {/* Price + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[13px] font-bold tabular-nums ${isBest ? 'text-secondary' : 'text-[#1a1b1f]'}`}>
                    {formatCOP(r.price)}
                  </span>
                  {isBest && (
                    <span className="text-[9px] font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-full leading-none">
                      MEJOR
                    </span>
                  )}
                  {r.referencePrice && !unavail && (
                    <span className="text-[10px] text-[#c1c6d7] line-through tabular-nums hidden sm:inline">
                      {formatCOP(r.referencePrice)}
                    </span>
                  )}
                </div>
                {/* Price bar — only shown when there are multiple available options */}
                {available.length > 1 && !unavail && (
                  <div className="h-1 rounded-full bg-[#f0f1f5] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isBest ? 'bg-secondary' : isWorst ? 'bg-[#e5e7eb]' : 'bg-primary/30'}`}
                      style={{ width: `${40 + pct * 0.6}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Buy button */}
              {!unavail ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`shrink-0 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    isBest
                      ? 'bg-secondary text-white hover:opacity-90'
                      : 'bg-white border border-[#c1c6d7]/60 text-[#414755] hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  Comprar
                </a>
              ) : (
                <span className="shrink-0 text-[11px] text-[#c1c6d7] px-2.5 py-1.5">
                  Agotado
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Footer: best deal summary ── */}
      {cheapest && available.length > 1 && (
        <div className="px-4 py-2 border-t border-[#f3f4f6] bg-secondary/[0.02]">
          <p className="text-[11px] text-[#717786]">
            <span className="font-semibold text-secondary">{cheapest.pharmacy}</span>
            {' '}tiene el mejor precio entre {available.length} farmacias
          </p>
        </div>
      )}
    </div>
  )
}
