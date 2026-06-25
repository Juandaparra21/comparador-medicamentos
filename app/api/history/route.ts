import { NextRequest, NextResponse } from 'next/server'
import { normalize } from '@/app/utils/search'
import { getHistory } from '@/app/lib/priceTracking'

export const maxDuration = 15

// Returns the accumulated real price history for a medication (empty until the
// daily job has run at least once).
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('q') ?? ''
  if (!raw.trim()) {
    return NextResponse.json({ tracked: false, label: null, days: [], histories: [], lastSnapshotAt: null })
  }
  const history = await getHistory(normalize(raw.trim()))
  return NextResponse.json(history)
}
