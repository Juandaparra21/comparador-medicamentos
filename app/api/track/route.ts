import { NextRequest, NextResponse } from 'next/server'
import { normalize } from '@/app/utils/search'
import { registerTracked, snapshotQuery } from '@/app/lib/priceTracking'

export const maxDuration = 30

// Start tracking a medication: register it for the daily job and capture the
// first real price point immediately so the user sees data right away.
export async function POST(req: NextRequest) {
  let body: { query?: string; label?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid body' }, { status: 400 })
  }

  const raw = (body.query ?? '').trim()
  if (!raw) return NextResponse.json({ ok: false, error: 'missing query' }, { status: 400 })

  const query = normalize(raw)
  const label = (body.label ?? raw).trim()

  const registered = await registerTracked(query, label)
  if (!registered) {
    return NextResponse.json({ ok: false, error: 'tracking unavailable' }, { status: 503 })
  }

  const points = await snapshotQuery(query)
  return NextResponse.json({ ok: true, query, points })
}
