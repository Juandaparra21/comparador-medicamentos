import type { PharmacyResult } from '@/app/types'
import { PharmacyLogo } from './PharmacyLogo'
import { formatCOP } from '@/app/utils/format'

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

const MED_COLORS: Record<string, string> = {
  'Acetaminofén': '#f59e0b',
  'Ibuprofeno':   '#3b82f6',
  'Losartán':     '#8b5cf6',
  'Metformina':   '#10b981',
}

function MedPillIcon({ ingredient }: { ingredient: string }) {
  const color = MED_COLORS[ingredient] ?? '#6b7280'
  return (
    <div
      style={{ background: `${color}16`, border: `1px solid ${color}30` }}
      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="7" width="16" height="6" rx="3" fill={color} opacity="0.25" />
        <rect x="2" y="7" width="8"  height="6" rx="3" fill={color} opacity="0.65" />
        <rect x="2" y="7" width="16" height="6" rx="3" stroke={color} strokeWidth="1.3" />
        <line x1="10" y1="7" x2="10" y2="13" stroke={color} strokeWidth="1.3" />
      </svg>
    </div>
  )
}

interface Props {
  result: PharmacyResult
  isCheapest: boolean
}

export default function ResultCard({ result, isCheapest }: Props) {
  return (
    <article
      className={`
        group relative flex flex-col gap-3.5 p-4 sm:p-5
        bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-xl shadow-sm
        hover:bg-white/85 hover:backdrop-blur-[40px]
        hover:shadow-[0_8px_32px_rgba(0,88,188,0.10)]
        transition-all duration-300
        ${result.availability === 'unavailable' ? 'opacity-65' : ''}
      `}
    >
      {/* Pharmacy header: logo + name + badge */}
      <div className="flex items-start gap-3">
        <PharmacyLogo name={result.pharmacy} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-[14px] leading-[18px] text-[#1a1b1f] truncate">
              {result.pharmacy}
            </p>
            {isCheapest && (
              <span className="shrink-0 text-[10px] font-bold tracking-wide bg-secondary text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                Mejor precio
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#717786] mt-0.5 truncate">{result.productName}</p>
        </div>
      </div>

      {/* Medication info with pill icon */}
      <div className="flex items-center gap-2">
        <MedPillIcon ingredient={result.activeIngredient} />
        <p className="text-[12px] font-medium text-[#414755] leading-snug">
          {result.activeIngredient} {result.concentration}
          <span className="text-[#c1c6d7] mx-1.5">&bull;</span>
          {result.quantity} {result.presentation}s
        </p>
      </div>

      {/* Price — glass-on-glass sub-layer */}
      <div className="flex items-baseline justify-between bg-white/60 border border-white/40 rounded-lg px-4 py-3">
        <span className="text-[24px] sm:text-[26px] font-bold leading-[32px] text-[#1a1b1f] tabular-nums">
          {formatCOP(result.price)}
        </span>
        <span className="text-[11px] font-semibold text-[#717786] tabular-nums">
          {formatCOP(result.pricePerUnit)}/und
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${AVAILABILITY_DOT[result.availability]}`} />
          <span className={`text-[12px] font-semibold ${AVAILABILITY_TEXT[result.availability]}`}>
            {AVAILABILITY_LABEL[result.availability]}
          </span>
        </div>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-semibold text-primary hover:text-primary-container transition-colors"
        >
          Ver en farmacia &rarr;
        </a>
      </div>
    </article>
  )
}
