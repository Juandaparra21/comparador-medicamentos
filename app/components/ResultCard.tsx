'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PharmacyResult } from '@/app/types'
import { PharmacyLogo } from './PharmacyLogo'
import { MedicationImage } from './MedicationImage'
import { WishlistButton } from './WishlistButton'
import { formatCOP } from '@/app/utils/format'
import { normalize } from '@/app/utils/search'

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
}

function ProductThumbnail({ imageUrl, ingredient }: { imageUrl?: string; ingredient: string }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (imageUrl && !imgFailed) {
    return (
      <div className="w-full h-[80px] relative overflow-hidden rounded-t-xl bg-white">
        <img
          src={imageUrl}
          alt=""
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain p-2"
        />
      </div>
    )
  }

  return <MedicationImage ingredient={ingredient} height={80} />
}

export default function ResultCard({ result, isCheapest }: Props) {
  const slug = normalize(result.activeIngredient)

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
          Mejor precio
        </span>
      )}

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Pharmacy row */}
        <div className="flex items-start gap-2.5">
          <PharmacyLogo name={result.pharmacy} size={32} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[13px] leading-[18px] text-[#1a1b1f] truncate">
              {result.pharmacy}
            </p>
            <p className="text-[11px] text-[#717786] mt-0.5 truncate leading-snug">
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
          <span className="text-[11px] font-semibold text-[#717786] tabular-nums">
            {formatCOP(result.pricePerUnit)}{LIQUID_PRESENTATIONS.has(result.presentation) ? '/ml' : '/und'}
          </span>
        </div>

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
