import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { snapshotQuery } from '@/app/lib/priceTracking'

export const maxDuration = 60

// Daily job (Vercel Cron): scrape every tracked medication and append today's
// real price point. Builds the price-history repository over time. No simulation.
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

  const { data: tracked, error } = await db.from('tracked_medications').select('query')
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  const results: { query: string; points: number }[] = []
  // Sequential: each query already fans out to 6 scrapers in parallel; running
  // queries one at a time keeps memory/connections bounded within the time budget.
  for (const row of tracked ?? []) {
    const query = row.query as string
    const points = await snapshotQuery(query)
    results.push({ query, points })
  }

  return NextResponse.json({ ok: true, count: results.length, results })
}
