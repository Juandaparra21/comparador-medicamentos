import type { Metadata } from 'next'
import Link from 'next/link'
import { formatCOP } from '@/app/utils/format'
import { getDiscountPool } from '@/app/lib/discounts'
import { PharmacyLogo } from '@/app/components/PharmacyLogo'
import { ProductThumbnail } from '@/app/components/ProductThumbnail'
import { SITE_URL } from '@/app/lib/siteUrl'

export const metadata: Metadata = {
  title: 'Ofertas activas — Farmi',
  description: 'Todos los descuentos vigentes detectados en las farmacias que comparamos, actualizados en tiempo casi real.',
  alternates: { canonical: `${SITE_URL}/ofertas` },
}

// Se regenera cada hora, igual que la portada, para reflejar el fondo de
// ofertas fresco que alimentan las búsquedas en vivo y el cron diario.
export const revalidate = 3600

export default async function OfertasPage() {
  const pool = await getDiscountPool()

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl pt-10 sm:pt-16 pb-20">
      <div className="mb-6">
        <h1 className="text-[24px] sm:text-[28px] font-bold text-[#1a1b1f] tracking-tight">
          Ofertas activas
        </h1>
        <p className="text-[14px] text-[#717786] mt-1">
          {pool.length > 0
            ? `${pool.length} descuento${pool.length !== 1 ? 's' : ''} vigente${pool.length !== 1 ? 's' : ''} en las farmacias que comparamos`
            : 'Todavía no tenemos suficientes ofertas frescas para mostrar aquí.'}
        </p>
      </div>

      {pool.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {pool.map((item) => (
            <Link
              key={item.id}
              href={`/buscar?q=${encodeURIComponent(item.activeIngredient.toLowerCase())}`}
              className="group flex flex-col glass-card glass-card-hover rounded-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <ProductThumbnail imageUrl={item.imageUrl} ingredient={item.activeIngredient} height={96} />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[12px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                  -{item.discount}%
                </span>
              </div>

              <div className="p-3 flex flex-col gap-2 flex-1">
                <div className="flex items-start gap-2">
                  <PharmacyLogo name={item.pharmacy} size={24} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#1a1b1f] leading-tight truncate">
                      {item.productName}
                    </p>
                    <p className="text-[10px] text-[#717786] truncate">{item.pharmacy}</p>
                  </div>
                </div>

                <div className="mt-auto">
                  {item.referencePrice && (
                    <p className="text-[11px] text-[#c1c6d7] line-through tabular-nums">
                      {formatCOP(item.referencePrice)}
                    </p>
                  )}
                  <p className="text-[18px] font-bold text-[#1a1b1f] leading-tight tabular-nums">
                    {formatCOP(item.price)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
