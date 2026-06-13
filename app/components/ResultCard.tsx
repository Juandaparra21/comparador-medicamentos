import type { PharmacyResult } from '@/app/types'

const AVAILABILITY_LABEL: Record<PharmacyResult['availability'], string> = {
  available: 'Disponible',
  limited: 'Stock limitado',
  unavailable: 'Agotado',
}

const AVAILABILITY_CLASS: Record<PharmacyResult['availability'], string> = {
  available: 'text-green-600',
  limited: 'text-amber-600',
  unavailable: 'text-gray-400',
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
    <article className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-gray-900 truncate">{result.pharmacy}</span>
        {isCheapest && (
          <span className="shrink-0 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Mejor precio
          </span>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-400">{result.productName}</p>
        <p className="text-sm font-medium text-gray-700">
          {result.activeIngredient} {result.concentration} &bull; {result.quantity}{' '}
          {result.presentation}s
        </p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-gray-900">{formatCOP(result.price)}</span>
        <span className="text-sm text-gray-400">{formatCOP(result.pricePerUnit)}/und</span>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className={`text-sm font-medium ${AVAILABILITY_CLASS[result.availability]}`}>
          {AVAILABILITY_LABEL[result.availability]}
        </span>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Ver en farmacia &rarr;
        </a>
      </div>
    </article>
  )
}
