import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { snapshotQuery, purgeStaleDiscounts } from '@/app/lib/priceTracking'
import { getAllMedicineSlugs, getMedicineInfo } from '@/app/utils/medicineInfo'
import { normalize } from '@/app/utils/search'

export const maxDuration = 60

// Daily job (Vercel Cron): scrape the whole medicine catalog plus every
// user-tracked medication and append today's real price point per pharmacy.
// Builds the price-history repository (and refreshes the discounts pool as a
// side effect of each scrape). No simulation.
//
// Time budget: each query fans out to 6 scrapers (~5-10s). Queries run in
// small parallel batches under a deadline; whatever doesn't fit is retried
// first tomorrow thanks to the rotating start offset, and upserts make any
// partial run safe to repeat.
const BATCH_SIZE = 3
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

  const { data: tracked, error } = await db.from('tracked_medications').select('query')
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  // Catalog ingredients (the /precio pages) + user-tracked queries, deduped.
  const catalog = getAllMedicineSlugs()
    .map((slug) => getMedicineInfo(slug))
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .map((m) => normalize(m.activeIngredient))
  const trackedQueries = (tracked ?? []).map((r) => r.query as string)
  const all = [...new Set([...catalog, ...trackedQueries])]

  // Rotate the starting point daily so a timeout never starves the same tail.
  const dayNumber = Math.floor(Date.now() / 86_400_000)
  const offset = all.length ? dayNumber % all.length : 0
  const ordered = [...all.slice(offset), ...all.slice(0, offset)]

  const results: { query: string; points: number }[] = []
  for (let i = 0; i < ordered.length; i += BATCH_SIZE) {
    if (Date.now() - started > DEADLINE_MS) break
    const batch = ordered.slice(i, i + BATCH_SIZE)
    const points = await Promise.all(batch.map((q) => snapshotQuery(q)))
    batch.forEach((q, j) => results.push({ query: q, points: points[j] }))
  }

  await purgeStaleDiscounts()

  return NextResponse.json({
    ok: true,
    total: ordered.length,
    done: results.length,
    ms: Date.now() - started,
    results,
  })
}
