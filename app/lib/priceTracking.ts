import { searchAllPharmacies } from '@/app/lib/scrapers'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { normalize } from '@/app/utils/search'
import type { PharmacyHistory } from '@/app/utils/priceHistoryTypes'
import type { PharmacyResult } from '@/app/types'

// Stable colors per pharmacy so the history chart looks consistent across views.
const PHARMACY_COLORS: Record<string, string> = {
  'Cruz Verde':           '#006e28',
  'Drogas La Rebaja':     '#0058bc',
  'Drogueria Colsubsidio': '#4c4aca',
  'Colsubsidio':          '#4c4aca',
  'Farmatodo':            '#e85d04',
  'Olimpica Drogueria':   '#db2777',
  'Cafam':                '#7c3aed',
  'Farmacia Pasteur':     '#0891b2',
  'Farmacenter':          '#b45309',
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
function buildSnapshotRows(query: string, results: PharmacyResult[]): SnapshotRow[] {
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

export interface SnapshotOutcome {
  points: number
  /** por que quedo en 0: error de escritura o sin resultados */
  error?: string
}

// Scrapes current prices and writes one snapshot row per pharmacy for today.
// The same scrape also feeds the featured-discounts pool, so one search does
// double duty. Idempotent within a day thanks to the (query, pharmacy, day)
// unique constraint. Returns points written and, if zero, the reason.
export async function snapshotQuery(query: string): Promise<SnapshotOutcome> {
  const db = getAdminClient()
  if (!db) return { points: 0, error: 'db unavailable' }
  const results = await searchAllPharmacies(query)
  await harvestDiscounts(results)

  const rows = buildSnapshotRows(query, results)
  if (rows.length === 0) return { points: 0, error: `sin resultados (${results.length} crudos)` }

  const { error } = await db
    .from('price_snapshots')
    .upsert(rows, { onConflict: 'query,pharmacy,day' })
  if (error) return { points: 0, error: error.message }

  await db
    .from('tracked_medications')
    .update({ last_snapshot_at: new Date().toISOString() })
    .eq('query', query)
  return { points: rows.length }
}

// ── Featured discounts pool (products table) ────────────────────────────────
// Every real scrape (live user search or daily cron) refreshes discounted items
// from ALL pharmacies into the products repository. The home section reads them
// via the search_results view (products JOIN pharmacies) filtered by freshness.

// La vista/tabla usa los ids de pharmacies; los resultados traen el nombre visible.
// Pasteur y Farmacenter faltaban aqui desde que se agregaron como fuente: sus
// descuentos se scrapeaban pero nunca entraban al pool de ofertas destacadas.
const PHARMACY_NAME_TO_ID: Record<string, string> = {
  'Farmatodo':             'farmatodo',
  'Cruz Verde':            'cruz-verde',
  'Drogas La Rebaja':      'la-rebaja',
  'Olimpica Drogueria':    'olimpica',
  'Drogueria Colsubsidio': 'colsubsidio',
  'Colsubsidio':           'colsubsidio',
  'Cafam':                 'cafam',
  'Farmacia Pasteur':      'pasteur',
  'Farmacenter':           'farmacenter',
  'Drogueria Alemana':     'alemana',
}

export async function harvestDiscounts(results: PharmacyResult[]): Promise<number> {
  const db = getAdminClient()
  if (!db) return 0

  const now = new Date().toISOString()
  // Dedupe on the products unique key (pharmacy_id, product_name, concentration):
  // Postgres rejects an upsert whose batch repeats the same conflict target.
  const byKey = new Map<string, Record<string, unknown>>()
  for (const r of results) {
    if (!r.discount || r.discount <= 0) continue
    if (r.availability !== 'available') continue
    // A discount only counts with a real reference price above the sale price.
    if (!r.referencePrice || r.referencePrice <= r.price) continue
    const pharmacyId = PHARMACY_NAME_TO_ID[r.pharmacy]
    if (!pharmacyId) continue

    const key = `${pharmacyId}::${normalize(r.productName)}::${r.concentration ?? ''}`
    byKey.set(key, {
      pharmacy_id:       pharmacyId,
      product_name:      r.productName,
      type:              r.type,
      active_ingredient: r.activeIngredient,
      concentration:     r.concentration,
      presentation:      r.presentation,
      quantity:          Math.round(r.quantity),
      price:             Math.round(r.price),
      price_per_unit:    Math.round(r.pricePerUnit),
      reference_price:   Math.round(r.referencePrice),
      discount_pct:      Math.round(r.discount),
      availability:      r.availability,
      url:               r.url,
      image_url:         r.imageUrl ?? null,
      last_updated:      now,
    })
  }
  if (byKey.size === 0) return 0

  const { error } = await db
    .from('products')
    .upsert([...byKey.values()], { onConflict: 'pharmacy_id,product_name,concentration' })
  return error ? 0 : byKey.size
}

// ── Latest snapshot for server-rendered price tables (/precio pages) ─────────

export interface LatestSnapshot {
  day: string // YYYY-MM-DD
  rows: { pharmacy: string; price: number; productName: string }[]
}

// Most recent snapshot day for the query, cheapest-first. Lets the /precio
// pages render real prices (with their date) in the server HTML that crawlers
// see, while the client still refreshes live on load.
export async function getLatestSnapshot(query: string): Promise<LatestSnapshot | null> {
  const db = getAdminClient()
  if (!db) return null

  const { data } = await db
    .from('price_snapshots')
    .select('pharmacy, price, product_name, day')
    .eq('query', query)
    .order('day', { ascending: false })
    .limit(30)

  if (!data || data.length === 0) return null
  const day = data[0].day as string
  const rows = data
    .filter((s) => s.day === day)
    .map((s) => ({
      pharmacy: s.pharmacy as string,
      price: s.price as number,
      productName: s.product_name as string,
    }))
    .sort((a, b) => a.price - b.price)
  return { day, rows }
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
