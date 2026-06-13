import type { PharmacyResult } from '@/app/types'
import { PharmacyLogo } from './PharmacyLogo'
import { formatCOP } from '@/app/utils/format'

const MED_COLORS: Record<string, string> = {
  'Acetaminofén': '#f59e0b',
  'Ibuprofeno':   '#3b82f6',
  'Losartán':     '#8b5cf6',
  'Metformina':   '#10b981',
}

interface Props {
  results: PharmacyResult[]
  minPrice: number | null
}

export function PriceChart({ results, minPrice }: Props) {
  const available = results.filter((r) => r.availability !== 'unavailable')
  if (available.length < 2) return null

  const maxPrice = Math.max(...available.map((r) => r.price))
  const sorted = [...available].sort((a, b) => a.price - b.price)
  const ingredient = sorted[0]?.activeIngredient ?? ''
  const medColor = MED_COLORS[ingredient] ?? '#0058bc'

  return (
    <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-xl p-4 sm:p-5 shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <h2 className="text-[12px] font-semibold tracking-[0.05em] uppercase text-[#717786]">
          Comparacion de precios
        </h2>
        {ingredient && (
          <div
            style={{
              background: `${medColor}14`,
              border: `1px solid ${medColor}30`,
              color: medColor,
            }}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
          >
            {ingredient}
          </div>
        )}
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-3">
        {sorted.map((r) => {
          const pct = Math.round((r.price / maxPrice) * 100)
          const isBest = r.price === minPrice
          return (
            <div key={r.id} className="flex items-center gap-2.5">
              <PharmacyLogo name={r.pharmacy} size={26} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] sm:text-[12px] font-medium text-[#414755] truncate pr-2 leading-none">
                    {r.pharmacy}
                  </span>
                  <span
                    className={`text-[11px] sm:text-[12px] font-bold shrink-0 leading-none tabular-nums ${
                      isBest ? 'text-secondary' : 'text-[#1a1b1f]'
                    }`}
                  >
                    {formatCOP(r.price)}
                  </span>
                </div>
                <div className="relative h-1.5 bg-[#e8eaf0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isBest
                        ? 'bg-secondary'
                        : 'bg-gradient-to-r from-primary/60 to-tertiary/60'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              {isBest && (
                <span className="shrink-0 hidden sm:inline text-[10px] font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-full">
                  min
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
