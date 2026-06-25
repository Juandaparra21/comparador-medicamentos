import { searchAllPharmacies } from '@/app/lib/scrapers'
import { getAdminClient } from '@/app/lib/supabase/admin'
import type { PharmacyHistory } from '@/app/utils/priceHistoryTypes'

// Stable colors per pharmacy so the history chart looks consistent across views.
const PHARMACY_COLORS: Record<string, string> = {
  'Cruz Verde':           '#006e28',
  'Drogas La Rebaja':     '#0058bc',
  'Drogueria Colsubsidio': '#4c4aca',
  'Colsubsidio':          '#4c4aca',
  'Farmatodo':            '#e85d04',
  'Olimpica Drogueria':   '#db2777',
  'Cafam':                '#7c3aed',
}
const FALLBACK_COLORS = ['#0058bc', '#006e28', '#e85d04', '#db2777', '#7c3aed', '#4c4aca', '#0891b2']

export function colorFor(pharmacy: string, index: number): string {
  return PHARMACY_COLORS[pharmacy] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

// YYYY-MM-DD for "today" in America/Bogota (UTC-5, no DST), independent of server tz.
export function bogotaDay(d = new Date()): string {
  const bogota = new Date(d.getTime() - 5 * 60 * 60 * 1000)
  return bogota.toISOString().slice(0, 10)
}

export interface SnapshotRow {
  query: string
  pharmacy: string
  product_name: string
  price: number
  day: string
}

// Cheapest available product per pharmacy for the query, as today's snapshot rows.
async function buildSnapshotRows(query: string): Promise<SnapshotRow[]> {
  const results = await searchAllPharmacies(query)
  const day = bogotaDay()
  const cheapest = new Map<string, SnapshotRow>()

  for (const r of results) {
    if (r.availability === 'unavailable') continue
    const prev = cheapest.get(r.pharmacy)
    if (!prev || r.price < prev.price) {
      cheapest.set(r.pharmacy, {
        query,
        pharmacy: r.pharmacy,
        product_name: r.productName,
        price: r.price,
        day,
      })
    }
  }
  return [...cheapest.values()]
}

// Registers a medication for daily tracking (idempotent).
export async function registerTracked(query: string, label: string): Promise<boolean> {
  const db = getAdminClient()
  if (!db) return false
  const { error } = await db
    .from('tracked_medications')
    .upsert({ query, label }, { onConflict: 'query', ignoreDuplicates: true })
  return !error
}

// Scrapes current prices and writes one snapshot row per pharmacy for today.
// Idempotent within a day thanks to the (query, pharmacy, day) unique constraint.
// Returns the number of pharmacy points written.
export async function snapshotQuery(query: string): Promise<number> {
  const db = getAdminClient()
  if (!db) return 0
  const rows = await buildSnapshotRows(query)
  if (rows.length === 0) return 0

  const { error } = await db
    .from('price_snapshots')
    .upsert(rows, { onConflict: 'query,pharmacy,day' })
  if (error) return 0

  await db
    .from('tracked_medications')
    .update({ last_snapshot_at: new Date().toISOString() })
    .eq('query', query)
  return rows.length
}

export interface MedicationHistoryResult {
  tracked: boolean
  label: string | null
  days: string[]
  histories: PharmacyHistory[]
  lastSnapshotAt: string | null
}

// Reads accumulated real snapshots and shapes them for the chart. Aligns every
// pharmacy onto the union of days (forward/back-filling gaps) so all series share
// one x-axis.
export async function getHistory(query: string): Promise<MedicationHistoryResult> {
  const empty: MedicationHistoryResult = {
    tracked: false, label: null, days: [], histories: [], lastSnapshotAt: null,
  }
  const db = getAdminClient()
  if (!db) return empty

  const { data: tracked } = await db
    .from('tracked_medications')
    .select('label, last_snapshot_at')
    .eq('query', query)
    .maybeSingle()

  const { data: snaps } = await db
    .from('price_snapshots')
    .select('pharmacy, price, day')
    .eq('query', query)
    .order('day', { ascending: true })

  if (!snaps || snaps.length === 0) {
    return {
      tracked: !!tracked,
      label: (tracked?.label as string) ?? null,
      days: [],
      histories: [],
      lastSnapshotAt: (tracked?.last_snapshot_at as string) ?? null,
    }
  }

  const days = [...new Set(snaps.map((s) => s.day as string))].sort()
  // pharmacy -> day -> price
  const byPharmacy = new Map<string, Map<string, number>>()
  for (const s of snaps) {
    const ph = s.pharmacy as string
    if (!byPharmacy.has(ph)) byPharmacy.set(ph, new Map())
    byPharmacy.get(ph)!.set(s.day as string, s.price as number)
  }

  const histories: PharmacyHistory[] = [...byPharmacy.keys()].map((pharmacy, i) => {
    const dayPrice = byPharmacy.get(pharmacy)!
    // forward-fill, then back-fill, so the line is continuous across missing days
    const data = days.map((day) => ({ label: formatDay(day), price: dayPrice.get(day) ?? NaN }))
    let last = NaN
    for (let k = 0; k < data.length; k++) {
      if (Number.isNaN(data[k].price)) data[k].price = last
      else last = data[k].price
    }
    let next = NaN
    for (let k = data.length - 1; k >= 0; k--) {
      if (Number.isNaN(data[k].price)) data[k].price = next
      else next = data[k].price
    }
    return { pharmacy, color: colorFor(pharmacy, i), data }
  })
  // drop any series that ended up entirely empty (no overlap with any day)
  .filter((h) => h.data.every((p) => !Number.isNaN(p.price)))
  .sort((a, b) => a.data[a.data.length - 1].price - b.data[b.data.length - 1].price)

  return {
    tracked: true,
    label: (tracked?.label as string) ?? null,
    days,
    histories,
    lastSnapshotAt: (tracked?.last_snapshot_at as string) ?? null,
  }
}

function formatDay(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${parseInt(d, 10)}/${parseInt(m, 10)}`
}
