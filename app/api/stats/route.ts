import { NextResponse } from 'next/server'
import { getAdminClient } from '@/app/lib/supabase/admin'

export const maxDuration = 15

// Cache at the edge for a minute: stats move slowly and this avoids hammering the DB.
export const revalidate = 60

export interface StatsResponse {
  totalSearches: number | null
  totalMedications: number | null
  avgSavingsCOP: number | null
}

// Real, self-owned usage stats for the social-proof bar. Never invents numbers:
// if the DB is unavailable it returns nulls and the client hides the component.
export async function GET() {
  const empty: StatsResponse = { totalSearches: null, totalMedications: null, avgSavingsCOP: null }
  const db = getAdminClient()
  if (!db) return NextResponse.json(empty)

  let searchRes, medRes, snapRes
  try {
    [searchRes, medRes, snapRes] = await Promise.all([
      // Total de busquedas realizadas (registro real, sin datos personales).
      db.from('search_events').select('*', { count: 'exact', head: true }),
      // Medicamentos con repositorio de precios propio (los que rastreamos a diario).
      db.from('tracked_medications').select('*', { count: 'exact', head: true }),
      // Snapshots reales para calcular el ahorro promedio (mas caro vs mas barato).
      db.from('price_snapshots')
        .select('query, price, day')
        .order('day', { ascending: false })
        .limit(10_000),
    ])
  } catch {
    // Network/DB failure: never break the page, just hide the bar.
    return NextResponse.json(empty)
  }

  const totalSearches = searchRes.error ? null : (searchRes.count ?? 0)
  const totalMedications = medRes.error ? null : (medRes.count ?? 0)

  // Ahorro promedio: por medicamento tomamos su dia mas reciente y medimos
  // (precio mas alto - precio mas bajo) entre farmacias. Promediamos esos ahorros.
  let avgSavingsCOP: number | null = null
  const snaps = snapRes.error ? null : snapRes.data
  if (snaps && snaps.length) {
    const latestDay = new Map<string, string>()
    for (const s of snaps) {
      const q = s.query as string
      // Rows arrive day-desc, so the first time we see a query is its latest day.
      if (!latestDay.has(q)) latestDay.set(q, s.day as string)
    }
    const pricesByQuery = new Map<string, number[]>()
    for (const s of snaps) {
      const q = s.query as string
      if ((s.day as string) !== latestDay.get(q)) continue
      const arr = pricesByQuery.get(q) ?? []
      arr.push(s.price as number)
      pricesByQuery.set(q, arr)
    }
    const savings: number[] = []
    for (const arr of pricesByQuery.values()) {
      if (arr.length >= 2) savings.push(Math.max(...arr) - Math.min(...arr))
    }
    if (savings.length) {
      avgSavingsCOP = Math.round(savings.reduce((a, b) => a + b, 0) / savings.length)
    }
  }

  return NextResponse.json({ totalSearches, totalMedications, avgSavingsCOP } satisfies StatsResponse)
}
