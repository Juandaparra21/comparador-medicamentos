import { NextRequest, NextResponse } from 'next/server'
import { searchAllPharmacies } from '@/app/lib/scrapers'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json({ results: [] })

  const results = await searchAllPharmacies(q.trim())
  return NextResponse.json({ results, source: 'live' })
}
