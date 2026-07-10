import { NextRequest, NextResponse } from 'next/server'
import { searchAllPharmacies } from '@/app/lib/scrapers'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { harvestDiscounts } from '@/app/lib/priceTracking'
import { normalize } from '@/app/utils/search'

export const maxDuration = 30

// Best-effort log of a search for real usage stats (powers /api/stats). Never
// blocks or fails the search response; stores only the term and the timestamp.
async function logSearch(query: string) {
  const db = getAdminClient()
  if (!db) return
  try {
    await db.from('search_events').insert({ query: normalize(query) })
  } catch {
    // ignore: stats logging must never break search
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json({ results: [] })

  const results = await searchAllPharmacies(q.trim())
  // fetchedAt is the real moment we finished retrieving live prices.
  const fetchedAt = new Date().toISOString()

  await logSearch(q.trim())
  // Same best-effort spirit: refresh the featured-discounts pool with any
  // discounted items this search just saw, across all pharmacies.
  try {
    await harvestDiscounts(results)
  } catch {
    // discounts pool must never break search
  }

  return NextResponse.json({ results, source: 'live', fetchedAt })
}
