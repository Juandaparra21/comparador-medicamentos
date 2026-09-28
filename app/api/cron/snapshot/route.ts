import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { snapshotQuery, bogotaDay } from '@/app/lib/priceTracking'
import { searchAllPharmacies } from '@/app/lib/scrapers'
import { getAllPriceEntries } from '@/app/utils/priceCatalog'
import { normalize } from '@/app/utils/search'

export const maxDuration = 60

// Vercel Cron job: scrape the whole medicine catalog plus every user-tracked
// medication and append today's real price point per pharmacy. Builds the
// price-history repository (and refreshes the discounts pool as a side effect
// of each scrape). No simulation.
//
// Time budget: each query fans out to the scrapers (~5-10s). Queries run ONE at
// a time, same concurrency as a normal user search; parallel batches made the
// sources throttle us and everything came back empty.
//
// Several runs a day (see vercel.json): each takes the stalest medications
// first and skips those already snapshotted today (see buildQueue), so the
// runs add up to a full daily pass. Upserts make any partial run safe to repeat.
const DEADLINE_MS = 45_000

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    const provided = auth?.replace(/^Bearer\s+/i, '') ?? req.nextUrl.searchParams.get('secret')
    if (provided !== secret) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
  }

  const db = getAdminClient()
  if (!db) return NextResponse.json({ ok: false, error: 'db unavailable' }, { status: 503 })

  const started = Date.now()

  // Diagnostico: ?debug=<consulta> corre UNA consulta en este mismo contexto y
  // responde cuantos resultados devolvio cada farmacia, sin escribir nada.
  const debugQuery = req.nextUrl.searchParams.get('debug')
  if (debugQuery) {
    const results = await searchAllPharmacies(normalize(debugQuery))
    const byPharmacy: Record<string, number> = {}
    for (const r of results) byPharmacy[r.pharmacy] = (byPharmacy[r.pharmacy] ?? 0) + 1
    return NextResponse.json({
      ok: true,
      debug: debugQuery,
      total: results.length,
      byPharmacy,
      ms: Date.now() - started,
    })
  }

  const { data: tracked, error } = await db.from('tracked_medications').select('query')
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  // Catalog ingredients (the /precio pages) + user-tracked queries, deduped.
  const catalogMeds = getAllPriceEntries()

  // price_snapshots.query tiene FK hacia tracked_medications(query): sin este
  // registro previo, el upsert del snapshot falla para todo el catalogo.
  await db.from('tracked_medications').upsert(
    catalogMeds.map((m) => ({ query: m.query, label: m.activeIngredient })),
    { onConflict: 'query', ignoreDuplicates: true },
  )

  const catalog = catalogMeds.map((m) => m.query)
  const trackedQueries = (tracked ?? []).map((r) => r.query as string)
  const all = [...new Set([...catalog, ...trackedQueries])]

  const ordered = await buildQueue(db, all)

  const results: { query: string; points: number; error?: string }[] = []
  for (const query of ordered) {
    if (Date.now() - started > DEADLINE_MS) break
    // Marcar el intento ANTES de raspar: si falla o se agota el tiempo, la
    // siguiente ejecucion del dia pasa al siguiente en vez de repetir este.
    await db
      .from('tracked_medications')
      .update({ last_attempt_at: new Date().toISOString() })
      .eq('query', query)
    const outcome = await snapshotQuery(query)
    results.push({ query, ...outcome })
  }

  return NextResponse.json({
    ok: true,
    total: all.length,
    pending: ordered.length,
    done: results.length,
    ms: Date.now() - started,
    results,
  })
}

// Cola del dia: excluye lo que ya tiene snapshot con fecha de hoy (Bogota) y
// ordena el resto por el intento mas viejo primero (nunca intentados de
// primeros). Como vercel.json dispara esta ruta varias veces al dia, cada
// ejecucion continua donde quedo la anterior sin repetir trabajo.
//
// Si la columna last_attempt_at aun no existe (migracion 0007 sin aplicar),
// cae al orden por last_snapshot_at, que sigue siendo mejor que el orden fijo.
async function buildQueue(
  db: NonNullable<ReturnType<typeof getAdminClient>>,
  all: string[],
): Promise<string[]> {
  const todayStartUtc = `${bogotaDay()}T05:00:00.000Z`
  const wanted = new Set(all)

  let rows: { query: string; last_snapshot_at: string | null; last_attempt_at?: string | null }[] | null = null
  const withAttempt = await db
    .from('tracked_medications')
    .select('query, last_snapshot_at, last_attempt_at')
  if (!withAttempt.error) {
    rows = withAttempt.data
  } else {
    const legacy = await db.from('tracked_medications').select('query, last_snapshot_at')
    rows = legacy.data
  }

  const info = new Map((rows ?? []).map((r) => [r.query, r]))
  const ts = (v: string | null | undefined) => (v ? Date.parse(v) : 0)

  return all
    .filter((q) => wanted.has(q))
    .filter((q) => {
      const last = info.get(q)?.last_snapshot_at
      return !last || last < todayStartUtc
    })
    .sort((a, b) => {
      const ra = info.get(a)
      const rb = info.get(b)
      const ka = ts(ra?.last_attempt_at ?? ra?.last_snapshot_at)
      const kb = ts(rb?.last_attempt_at ?? rb?.last_snapshot_at)
      return ka - kb
    })
}
