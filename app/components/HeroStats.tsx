'use client'

import { useEffect, useState } from 'react'
import { formatCOP } from '@/app/utils/format'
import type { StatsResponse } from '@/app/api/stats/route'

// Minimum real data before we show the bar. Below this we hide it entirely
// (never show zeros or thin numbers that would read as invented).
const MIN_SEARCHES = 100
const MIN_MEDICATIONS = 8

function formatCount(n: number): string {
  return new Intl.NumberFormat('es-CO').format(n)
}

// Social-proof bar built only from our own real data (searches run, medications
// tracked, average detected savings). Self-hides while loading, on error, or
// when the numbers are still too low to be meaningful.
export function HeroStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d: StatsResponse) => { if (alive) setStats(d) })
      .catch(() => { if (alive) setStats(null) })
    return () => { alive = false }
  }, [])

  if (!stats) return null

  const { totalSearches, totalMedications, avgSavingsCOP } = stats
  const enoughSearches = typeof totalSearches === 'number' && totalSearches >= MIN_SEARCHES
  const enoughMeds = typeof totalMedications === 'number' && totalMedications >= MIN_MEDICATIONS
  if (!enoughSearches || !enoughMeds) return null

  const cells: { value: string; label: string }[] = [
    { value: formatCount(totalSearches), label: 'búsquedas realizadas' },
    { value: formatCount(totalMedications), label: 'medicamentos en seguimiento' },
  ]
  if (typeof avgSavingsCOP === 'number' && avgSavingsCOP > 0) {
    cells.push({ value: formatCOP(avgSavingsCOP), label: 'ahorro promedio detectado' })
  }

  return (
    <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
      {cells.map((c) => (
        <div
          key={c.label}
          className="flex flex-col items-center text-center bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl px-2 py-3.5 sm:px-3 sm:py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <p className="text-[18px] sm:text-[24px] font-bold text-[#1d1d1f] tabular-nums leading-none">
            {c.value}
          </p>
          <p className="text-[10px] sm:text-[12px] text-[#6e6e73] mt-1.5 leading-tight">
            {c.label}
          </p>
        </div>
      ))}
    </div>
  )
}
