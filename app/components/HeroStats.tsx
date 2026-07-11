'use client'

import { useEffect, useState } from 'react'
import type { StatsResponse } from '@/app/api/stats/route'

// Minimum real data before we show the bar. Below this we hide it entirely
// (never show zeros or thin numbers that would read as invented).
const MIN_SEARCHES = 100

function formatCount(n: number): string {
  return new Intl.NumberFormat('es-CO').format(n)
}

// Social-proof bar built only from our own real data (searches run). Self-hides
// while loading, on error, or when the number is still too low to be meaningful.
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

  const { totalSearches } = stats
  const enoughSearches = typeof totalSearches === 'number' && totalSearches >= MIN_SEARCHES
  if (!enoughSearches) return null

  const cells: { value: string; label: string }[] = [
    { value: formatCount(totalSearches), label: 'búsquedas realizadas' },
  ]

  return (
    <div className="mt-8 grid grid-cols-1 gap-2 sm:gap-3">
      {cells.map((c) => (
        <div
          key={c.label}
          className="glass-card glass-card-hover flex flex-col items-center text-center rounded-2xl px-2 py-3.5 sm:px-3 sm:py-4"
        >
          <p className="text-[18px] sm:text-[24px] font-bold text-[#1a1b1f] tabular-nums leading-none">
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
