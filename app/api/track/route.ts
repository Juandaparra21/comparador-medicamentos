import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalize } from '@/app/utils/search'
import { SUPABASE_URL, SUPABASE_ANON } from '@/app/lib/supabase/config'
import { registerTracked, snapshotQuery } from '@/app/lib/priceTracking'

export const maxDuration = 30

// Verify the caller is a signed-in user via the Bearer access token.
async function requireUser(req: NextRequest): Promise<boolean> {
  const header = req.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return false
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON)
    const { data, error } = await sb.auth.getUser(token)
    return !error && Boolean(data.user)
  } catch {
    return false
  }
}

// Start tracking a medication: register it for the daily job and capture the
// first real price point immediately so the user sees data right away.
// Requires a signed-in user.
export async function POST(req: NextRequest) {
  if (!(await requireUser(req))) {
    return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 })
  }

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
