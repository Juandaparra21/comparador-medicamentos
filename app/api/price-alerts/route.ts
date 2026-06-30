import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { normalize } from '@/app/utils/search'

export const maxDuration = 15

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Saves a "notify me when the price drops" request. The user leaves ONE channel
// (email or WhatsApp). We store the medication, the current lowest price and the
// contact so a future job can compare against new snapshots and reach out.
export async function POST(req: NextRequest) {
  let body: {
    query?: string
    label?: string
    price?: number
    channel?: string
    contact?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const label = (body.label ?? '').trim()
  const rawQuery = (body.query ?? label).trim()
  const channel = body.channel === 'whatsapp' ? 'whatsapp' : body.channel === 'email' ? 'email' : null
  const contact = (body.contact ?? '').trim()
  const price = Number(body.price)

  if (!rawQuery || !channel || !contact) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }
  if (channel === 'email' && !EMAIL_RE.test(contact)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }
  if (channel === 'whatsapp' && contact.replace(/\D/g, '').length < 7) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 })
  }

  const db = getAdminClient()
  if (!db) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })

  const { error } = await db.from('price_alerts').insert({
    query: normalize(rawQuery),
    label: label || rawQuery,
    current_price: Number.isFinite(price) ? Math.round(price) : null,
    channel,
    contact,
  })
  if (error) return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
