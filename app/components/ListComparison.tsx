'use client'

import { useState } from 'react'
import type { PharmacyResult, WishlistItem } from '@/app/types'
import { PharmacyLogo } from './PharmacyLogo'
import { formatCOP } from '@/app/utils/format'
import { normalize } from '@/app/utils/search'

interface Props {
  items: WishlistItem[]
}

// Concentration normalizer so "400 mg" and "400mg" match across pharmacies.
function normConc(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '').replace(',', '.')
}

interface PharmacyTotal {
  pharmacy: string
  total: number
  covered: number
  /** itemKey -> best price found at this pharmacy */
  prices: Map<string, number>
}

interface ComparisonResult {
  rows: PharmacyTotal[]
  best: PharmacyTotal | null
  itemCount: number
  fetchedAt: string
}

// Builds a unique medication line per (ingredient + concentration) so a list with
// duplicates doesn't search twice or double-count.
function uniqueLines(items: WishlistItem[]) {
  const map = new Map<string, { key: string; label: string; query: string; ing: string; conc: string }>()
  for (const it of items) {
    const ing = normalize(it.activeIngredient || it.productName)
    const conc = normConc(it.concentration || '')
    const key = `${ing}|${conc}`
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: it.activeIngredient ? `${it.activeIngredient}${it.concentration ? ` ${it.concentration}` : ''}` : it.productName,
        query: it.activeIngredient || it.productName,
        ing,
        conc,
      })
    }
  }
  return [...map.values()]
}

// Cheapest available price per pharmacy for one medication line, matching by
// active ingredient (and concentration when present, relaxing it if nothing matches).
function pricesPerPharmacy(line: { ing: string; conc: string }, results: PharmacyResult[]): Map<string, number> {
  const avail = results.filter((r) => r.availability !== 'unavailable')
  const matchIng = (r: PharmacyResult) => !line.ing || normalize(r.activeIngredient) === line.ing
  let matches = avail.filter((r) => matchIng(r) && (!line.conc || normConc(r.concentration) === line.conc))
  if (matches.length === 0) matches = avail.filter(matchIng) // relax concentration
  const cheapest = new Map<string, number>()
  for (const r of matches) {
    const prev = cheapest.get(r.pharmacy)
    if (prev === undefined || r.price < prev) cheapest.set(r.pharmacy, r.price)
  }
  return cheapest
}

export function ListComparison({ items }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState<ComparisonResult | null>(null)

  async function compute() {
    if (loading) return
    setLoading(true)
    setError(false)
    try {
      const lines = uniqueLines(items)
      const perLine = await Promise.all(
        lines.map(async (line) => {
          try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(line.query)}`)
            if (!res.ok) return { line, prices: new Map<string, number>() }
            const json = await res.json()
            return { line, prices: pricesPerPharmacy(line, json.results ?? []) }
          } catch {
            return { line, prices: new Map<string, number>() }
          }
        }),
      )

      // Aggregate per pharmacy across all medication lines.
      const totals = new Map<string, PharmacyTotal>()
      for (const { line, prices } of perLine) {
        for (const [pharmacy, price] of prices.entries()) {
          const t = totals.get(pharmacy) ?? { pharmacy, total: 0, covered: 0, prices: new Map() }
          t.total += price
          t.covered += 1
          t.prices.set(line.key, price)
          totals.set(pharmacy, t)
        }
      }

      const rows = [...totals.values()].sort((a, b) =>
        b.covered !== a.covered ? b.covered - a.covered : a.total - b.total,
      )
      const itemCount = lines.length
      const best = rows.find((r) => r.covered === itemCount) ?? rows[0] ?? null

      setData({ rows, best, itemCount, fetchedAt: new Date().toISOString() })
      if (rows.length === 0) setError(true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (items.length < 2) return null

  return (
    <section className="mt-8 glass-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <div>
          <h2 className="text-[16px] font-bold text-[#1a1b1f]">Total por farmacia</h2>
          <p className="text-[12px] text-[#717786] mt-0.5 max-w-md">
            Sumamos el precio más bajo de cada medicamento en cada farmacia para mostrarte
            dónde te sale más barato comprar toda la lista de una vez.
          </p>
        </div>
        <button
          onClick={compute}
          disabled={loading}
          className="shrink-0 text-[12px] font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer whitespace-nowrap"
        >
          {loading ? 'Calculando...' : data ? 'Recalcular' : 'Comparar total'}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-10 text-[#717786]">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-[13px]">Consultando precios actuales en las farmacias...</p>
        </div>
      )}

      {!loading && error && (
        <div className="glass-row rounded-xl p-5 text-center mt-4">
          <p className="text-[13px] text-[#717786]">
            No pudimos calcular los totales ahora. Intenta de nuevo en unos minutos.
          </p>
        </div>
      )}

      {!loading && !error && data && data.rows.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {data.rows.map((row) => {
            const isBest = data.best?.pharmacy === row.pharmacy
            const partial = row.covered < data.itemCount
            return (
              <div
                key={row.pharmacy}
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 ${
                  isBest
                    ? 'bg-secondary/10 border-secondary/30'
                    : 'bg-white/50 border-white/50'
                }`}
              >
                <PharmacyLogo name={row.pharmacy} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-semibold text-[#1a1b1f] truncate">{row.pharmacy}</p>
                    {isBest && (
                      <span className="text-[9px] font-black tracking-wide bg-secondary text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        MENOR TOTAL
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#717786] mt-0.5">
                    {partial
                      ? `Cubre ${row.covered} de ${data.itemCount} medicamentos`
                      : 'Tiene todos tus medicamentos'}
                  </p>
                </div>
                <p className={`text-[16px] font-bold tabular-nums shrink-0 ${isBest ? 'text-secondary' : 'text-[#1a1b1f]'}`}>
                  {formatCOP(row.total)}
                </p>
              </div>
            )
          })}

          {data.best && data.best.covered < data.itemCount && (
            <p className="text-[11px] text-[#717786] mt-1 leading-snug">
              Ninguna farmacia tiene los {data.itemCount} medicamentos disponibles ahora mismo.
              {' '}{data.best.pharmacy} cubre la mayor parte al menor precio.
            </p>
          )}

          <p className="text-[10px] text-[#c1c6d7] mt-2">
            Los totales suman solo los medicamentos disponibles en cada farmacia. Los precios pueden
            variar por sede y promociones; verifica en cada farmacia.
          </p>
        </div>
      )}
    </section>
  )
}
