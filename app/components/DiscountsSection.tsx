import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { formatCOP } from '@/app/utils/format'
import { PharmacyLogo } from './PharmacyLogo'
import { MedicationImage } from './MedicationImage'
import type { PharmacyResult } from '@/app/types'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function getFeaturedDiscounts(): Promise<PharmacyResult[]> {
  const { data } = await supabase
    .from('search_results')
    .select('*')
    .not('discount', 'is', null)
    .gt('discount', 0)
    .eq('availability', 'available')
    // Filtrar ingredientes que parecen nombres de producto, no principio activo
    .not('activeIngredient', 'ilike', 'oferta%')
    .not('activeIngredient', 'ilike', 'aranda%')
    .order('discount', { ascending: false })
    .limit(8)

  return (data ?? []) as PharmacyResult[]
}

export async function DiscountsSection() {
  const discounts = await getFeaturedDiscounts()
  if (discounts.length === 0) return null

  // Farmacia con mas descuentos entre los destacados
  const counts: Record<string, number> = {}
  discounts.forEach((r) => { counts[r.pharmacy] = (counts[r.pharmacy] ?? 0) + 1 })
  const topEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  const topPharmacy = topEntry ? { name: topEntry[0], count: topEntry[1] } : null

  const featured = discounts.slice(0, 4)

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl pb-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1a1b1f] tracking-tight">
            Descuentos destacados
          </h2>
          <p className="text-[13px] text-[#717786] mt-0.5">
            Los mejores precios del mercado hoy
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
          <Link
            key={item.id}
            href={`/buscar?q=${encodeURIComponent(item.activeIngredient)}`}
            className="group flex flex-col bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-xl shadow-sm hover:shadow-[0_8px_32px_rgba(0,88,188,0.10)] hover:bg-white/85 transition-all duration-300 overflow-hidden shrink-0 w-[200px] sm:w-auto snap-start"
          >
            <div className="relative">
              <MedicationImage ingredient={item.activeIngredient} height={70} />
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

        {topPharmacy && (
          <div className="flex flex-col justify-between bg-gradient-to-br from-primary/10 to-tertiary/10 border border-primary/20 rounded-xl p-4 shrink-0 w-[200px] sm:w-auto snap-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary mb-1.5">
                Mas descuentos
              </p>
              <PharmacyLogo name={topPharmacy.name} size={36} />
              <p className="text-[14px] font-bold text-[#1a1b1f] mt-2 leading-snug">
                {topPharmacy.name}
              </p>
            </div>
            <div className="mt-3 bg-primary/10 rounded-lg px-3 py-2 text-center">
              <p className="text-[22px] font-black text-primary leading-none">
                {topPharmacy.count}
              </p>
              <p className="text-[11px] text-primary/70 font-semibold">
                ofertas activas
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
