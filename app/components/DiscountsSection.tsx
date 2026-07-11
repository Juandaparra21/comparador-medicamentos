import Link from 'next/link'
import { formatCOP } from '@/app/utils/format'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { PharmacyLogo } from './PharmacyLogo'
import { MedicationImage } from './MedicationImage'
import type { PharmacyResult } from '@/app/types'

// Only offers re-confirmed by a real scrape in the last 7 days count as fresh.
const FRESH_DAYS = 7

interface DiscountsData {
  featured: PharmacyResult[]
  topPharmacy: { name: string; count: number } | null
  updatedAt: string | null
}

// The pool (search_results) is refreshed by every live search and by the daily
// cron, across ALL pharmacies. Here we take the freshest slice and diversify:
// best offer of each pharmacy first, so one aggressive source (e.g. Farmatodo)
// cannot monopolize the section.
async function getFeaturedDiscounts(): Promise<DiscountsData> {
  const empty: DiscountsData = { featured: [], topPharmacy: null, updatedAt: null }
  const db = getAdminClient()
  if (!db) return empty

  const since = new Date(Date.now() - FRESH_DAYS * 86_400_000).toISOString()
  const { data } = await db
    .from('search_results')
    .select('*')
    .gt('discount', 0)
    .eq('availability', 'available')
    .gte('lastUpdated', since)
    // Filtrar ingredientes que parecen nombres de producto, no principio activo
    .not('activeIngredient', 'ilike', 'oferta%')
    .not('activeIngredient', 'ilike', 'aranda%')
    .order('discount', { ascending: false })
    .limit(60)

  const pool = (data ?? []) as (PharmacyResult & { lastUpdated?: string })[]
  if (pool.length === 0) return empty

  // Best offer per pharmacy (pool is already discount-desc), then fill the
  // remaining slots with the next highest discounts overall.
  const bestPerPharmacy = new Map<string, PharmacyResult>()
  for (const r of pool) {
    if (!bestPerPharmacy.has(r.pharmacy)) bestPerPharmacy.set(r.pharmacy, r)
  }
  const featured = [...bestPerPharmacy.values()]
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
    .slice(0, 4)
  if (featured.length < 4) {
    const chosen = new Set(featured.map((r) => r.id))
    for (const r of pool) {
      if (featured.length >= 4) break
      if (!chosen.has(r.id)) { featured.push(r); chosen.add(r.id) }
    }
  }

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
          <Link
            key={item.id}
            href={`/buscar?q=${encodeURIComponent(item.activeIngredient)}`}
            className="group flex flex-col glass-card glass-card-hover rounded-2xl transition-all duration-300 overflow-hidden shrink-0 w-[200px] sm:w-auto snap-start"
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
                Más descuentos
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
