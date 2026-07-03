import { NextRequest, NextResponse } from 'next/server'
import { processPriceAlerts } from '@/app/lib/priceAlerts'

export const runtime = 'nodejs'
export const maxDuration = 60

// Daily job (Vercel Cron): re-check every pending price alert and notify the user
// (email / WhatsApp) when the price dropped below what it was at sign-up.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    const provided = auth?.replace(/^Bearer\s+/i, '') ?? req.nextUrl.searchParams.get('secret')
    if (provided !== secret) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
  }

  const result = await processPriceAlerts()
  return NextResponse.json({ ok: true, ...result })
}
