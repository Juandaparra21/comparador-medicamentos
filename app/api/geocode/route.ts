import { NextRequest, NextResponse } from 'next/server'
import { suggestPlaces } from '@/app/utils/nearbyPharmacies'

export const maxDuration = 15

// Address autocomplete proxy over OpenStreetMap Nominatim. Runs server-side so
// the requests carry a proper User-Agent (the browser cannot, and Nominatim
// rejects/limits anonymous calls).
//
// Request:  GET /api/geocode?q=<partial address>   (q must be >= 3 chars)
// Response: 200 { suggestions: Array<{ label: string; lat: number; lng: number }> }
//           Always 200 with an empty array on error or short query, so the UI
//           can treat "no suggestions" uniformly.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.trim().length < 3) return NextResponse.json({ suggestions: [] })

  try {
    const suggestions = await suggestPlaces(q)
    return NextResponse.json(
      { suggestions },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    )
  } catch (e) {
    console.error('[api/geocode]', (e as Error).message)
    return NextResponse.json({ suggestions: [] })
  }
}
