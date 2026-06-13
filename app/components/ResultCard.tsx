import type { PharmacyResult } from '@/app/types'

const AVAILABILITY_LABEL: Record<PharmacyResult['availability'], string> = {
  available: 'Disponible',
  limited: 'Stock limitado',
  unavailable: 'Agotado',
}

const AVAILABILITY_CLASS: Record<PharmacyResult['availability'], string> = {
  available: 'text-secondary',
  limited: 'text-amber-600',
  unavailable: 'text-[#717786]',
}

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface Props {
  result: PharmacyResult
  isCheapest: boolean
}

export default function ResultCard({ result, isCheapest }: Props) {
  return (
    <article
      className={`
        group relative flex flex-col gap-4 p-5
        bg-white/70 backdrop-blur-[20px]
        border border-white/50
        rounded-lg shadow-sm
        hover:bg-white/85 hover:backdrop-blur-[40px]
        hover:shadow-[0_8px_32px_rgba(0,88,188,0.10)]
        transition-all duration-300
        ${result.availability === 'unavailable' ? 'opacity-70' : ''}
      `}
    >
      {/* Pharmacy + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-[15px] leading-[20px] text-[#1a1b1f] truncate">
            {result.pharmacy}
          </p>
          <p className="text-[12px] text-[#717786] mt-0.5 truncate">{result.productName}</p>
        </div>
        {isCheapest && (
          <span className="shrink-0 text-[11px] font-semibold tracking-wide bg-secondary text-on-secondary px-2.5 py-1 rounded-full">
            Mejor precio
          </span>
        )}
      </div>

      {/* Medication detail */}
      <p className="text-[13px] font-medium text-[#414755] leading-snug -mt-1">
        {result.activeIngredient} {result.concentration}&ensp;&bull;&ensp;{result.quantity}{' '}
        {result.presentation}s
      </p>

      {/* Price block — glass-on-glass sub-layer (Level 1 inside Level 1) */}
      <div className="flex items-baseline justify-between bg-white/60 border border-white/40 rounded-md px-4 py-3">
        <span className="text-[28px] font-bold leading-[34px] text-[#1a1b1f]">
          {formatCOP(result.price)}
        </span>
        <span className="text-[12px] font-semibold text-[#717786]">
          {formatCOP(result.pricePerUnit)}/und
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <span className={`text-[12px] font-semibold ${AVAILABILITY_CLASS[result.availability]}`}>
          {AVAILABILITY_LABEL[result.availability]}
        </span>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-semibold text-primary hover:text-primary-container transition-colors"
        >
          Ver en farmacia &rarr;
        </a>
      </div>
    </article>
  )
}
