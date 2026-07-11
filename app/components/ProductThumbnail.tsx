'use client'

import { useState } from 'react'
import { MedicationImage } from './MedicationImage'
import { thumbnailUrl } from '@/app/utils/imageUrl'

interface Props {
  imageUrl?: string
  ingredient: string
  height?: number
}

// Imagen real del producto (proxied/resized) con respaldo a la ilustración SVG
// cuando no hay imagen o falla la carga. Compartido entre ResultCard y las
// tarjetas de descuentos destacados para que ambos luzcan igual.
export function ProductThumbnail({ imageUrl, ingredient, height = 140 }: Props) {
  const [imgFailed, setImgFailed] = useState(false)

  if (imageUrl && !imgFailed) {
    return (
      <div className="w-full relative overflow-hidden rounded-t-xl product-thumb-bg" style={{ height }}>
        <img
          src={thumbnailUrl(imageUrl, 120)}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain p-2"
        />
      </div>
    )
  }

  return <MedicationImage ingredient={ingredient} height={height} />
}
