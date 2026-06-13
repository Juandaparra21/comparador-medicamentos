import type { PharmacyResult } from '@/app/types'
import { PharmacyLogo } from './PharmacyLogo'
import { MedicationImage } from './MedicationImage'
import { WishlistButton } from './WishlistButton'
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

interface Props {
  result: PharmacyResult
  isCheapest: boolean
}

export default function ResultCard({ result, isCheapest }: Props) {
  return (
    <article
      className={`
        group relative flex flex-col
        bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-xl shadow-sm
        hover:bg-white/85 hover:backdrop-blur-[40px]
        hover:shadow-[0_8px_32px_rgba(0,88,188,0.10)]
        transition-all duration-300 overflow-hidden
        ${result.availability === 'unavailable' ? 'opacity-65' : ''}
      `}
    >
      {/* Medication image banner */}
      <MedicationImage ingredient={result.activeIngredient} height={80} />

      {/* Discount badge over image */}
      {result.discount && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm z-10">
          -{result.discount}%
        </span>
      )}

      <div className="flex flex-col gap-3 p-4 sm:p-4.5 flex-1">
        {/* Pharmacy row: logo + name + wishlist */}
        <div className="flex items-start gap-2.5">
          <PharmacyLogo name={result.pharmacy} size={36} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1.5">
              <p className="font-semibold text-[13px] sm:text-[14px] leading-[18px] text-[#1a1b1f] truncate">
                {result.pharmacy}
              </p>
              {isCheapest && (
                <span className="shrink-0 text-[9px] sm:text-[10px] font-bold tracking-wide bg-secondary text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                  Mejor precio
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#717786] mt-0.5 truncate">
              {result.productName}
            </p>
          </div>
          <WishlistButton result={result} />
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
          <p className="text-[12px] font-medium text-[#414755] leading-snug">
            {result.activeIngredient} {result.concentration}
            <span className="text-[#c1c6d7] mx-1">&bull;</span>
            {result.quantity} {result.presentation}s
          </p>
        </div>

        {/* Price — glass-on-glass sub-layer */}
        <div className="flex items-baseline justify-between bg-white/60 border border-white/40 rounded-lg px-3.5 py-2.5">
          <div>
            {result.referencePrice && (
              <p className="text-[11px] text-[#c1c6d7] line-through tabular-nums leading-none mb-0.5">
                {formatCOP(result.referencePrice)}
              </p>
            )}
            <span className="text-[22px] sm:text-[24px] font-bold leading-[30px] text-[#1a1b1f] tabular-nums">
              {formatCOP(result.price)}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#717786] tabular-nums">
            {formatCOP(result.pricePerUnit)}/und
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${AVAILABILITY_DOT[result.availability]}`} />
            <span className={`text-[11px] sm:text-[12px] font-semibold ${AVAILABILITY_TEXT[result.availability]}`}>
              {AVAILABILITY_LABEL[result.availability]}
            </span>
          </div>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-primary hover:text-primary-container transition-colors"
          >
            Ver &rarr;
          </a>
        </div>
      </div>
    </article>
  )
}
