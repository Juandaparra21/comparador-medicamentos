import Link from 'next/link'
import { formatCOP } from '@/app/utils/format'
import { getDiscountPool, selectDailyFeatured } from '@/app/lib/discounts'
import { PharmacyLogo } from './PharmacyLogo'
import { ProductThumbnail } from './ProductThumbnail'
import type { PharmacyResult } from '@/app/types'

interface DiscountsData {
  featured: PharmacyResult[]
  topPharmacy: { name: string; count: number } | null
  updatedAt: string | null
}

// The pool (search_results) is refreshed by every live search and by the daily
// cron, across ALL pharmacies. Selection (daily rotation, beauty first, max 2
// per pharmacy) lives in selectDailyFeatured, shared with the IG image route.
async function getFeaturedDiscounts(): Promise<DiscountsData> {
  const empty: DiscountsData = { featured: [], topPharmacy: null, updatedAt: null }
  const pool = await getDiscountPool()
  if (pool.length === 0) return empty

  const featured = selectDailyFeatured(pool, 8)

  // Farmacia con más ofertas frescas en todo el pool
  const counts: Record<string, number> = {}
  pool.forEach((r) => { counts[r.pharmacy] = (counts[r.pharmacy] ?? 0) + 1 })
  const topEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  const topPharmacy = topEntry ? { name: topEntry[0], count: topEntry[1] } : null

  const updatedAt = pool.reduce<string | null>(
    (max, r) => (r.lastUpdated && (!max || r.lastUpdated > max) ? r.lastUpdated : max),
    null,
  )

  return { featured, topPharmacy, updatedAt }
}

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

// "hoy" si es del mismo día (hora Bogotá), si no "el 9 de julio".
function freshnessLabel(iso: string): string {
  const bogota = (d: Date) => new Date(d.getTime() - 5 * 3_600_000)
  const then = bogota(new Date(iso))
  const now = bogota(new Date())
  if (then.toISOString().slice(0, 10) === now.toISOString().slice(0, 10)) return 'hoy'
  return `el ${then.getUTCDate()} de ${MONTHS[then.getUTCMonth()]}`
}

export async function DiscountsSection() {
  const { featured, topPharmacy, updatedAt } = await getFeaturedDiscounts()
  if (featured.length === 0) return null

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl pb-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1a1b1f] tracking-tight">
            Descuentos destacados
          </h2>
          <p className="text-[13px] text-[#717786] mt-0.5">
            Detectados en las farmacias que comparamos
            {updatedAt ? ` · actualizado ${freshnessLabel(updatedAt)}` : ''}
          </p>
        </div>
        <Link
          href="/buscar?q=generico"
          className="text-[13px] font-semibold text-primary hover:opacity-75 transition-opacity whitespace-nowrap"
        >
          Ver todos &rarr;
        </Link>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 -mx-4 sm:mx-0 px-4 sm:px-0 snap-x snap-mandatory">
        {featured.map((item) => (
          // Directo a la pagina del producto en la farmacia (Farmi no vende,
          // enlaza). Si el registro no trae URL, cae a la busqueda interna.
          <a
            key={item.id}
            href={item.url || `/buscar?q=${encodeURIComponent(item.activeIngredient.toLowerCase())}`}
            target={item.url ? '_blank' : undefined}
            rel={item.url ? 'noopener noreferrer' : undefined}
            className="group flex flex-col glass-card glass-card-hover rounded-2xl transition-all duration-300 overflow-hidden shrink-0 w-[200px] sm:w-auto snap-start"
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
          </a>
        ))}

        {topPharmacy && (
          <Link
            href="/ofertas"
            className="group flex flex-col justify-between bg-gradient-to-br from-primary/10 to-tertiary/10 border border-primary/20 rounded-xl p-4 shrink-0 w-[200px] sm:w-auto snap-start transition-all hover:border-primary/40"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary mb-1.5">
                Más descuentos
              </p>
              <PharmacyLogo name={topPharmacy.name} size={36} />
              <p className="text-[14px] font-bold text-[#1a1b1f] mt-2 leading-snug">
                {topPharmacy.name}
              </p>
            </div>
            <div className="mt-3 bg-primary/10 rounded-lg px-3 py-2 text-center group-hover:bg-primary/15 transition-colors">
              <p className="text-[22px] font-black text-primary leading-none">
                {topPharmacy.count}
              </p>
              <p className="text-[11px] text-primary/70 font-semibold">
                ofertas activas &rarr;
              </p>
            </div>
          </Link>
        )}
      </div>
    </section>
  )
}
