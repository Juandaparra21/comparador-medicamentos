import { NextRequest, NextResponse } from 'next/server'
import { fetchNearbyPharmacies, geocodePlace } from '@/app/utils/nearbyPharmacies'

export const maxDuration = 30

// Proxies OpenStreetMap (Overpass + Nominatim) so the requests carry a proper
// User-Agent and can fall back across mirrors — neither is possible from the
// browser, where these endpoints return 406/429.
export async function GET(req: NextRequest) {
  const sp    = req.nextUrl.searchParams
  const place = sp.get('place')
  let lat = parseFloat(sp.get('lat') ?? '')
  let lng = parseFloat(sp.get('lng') ?? '')

  try {
    if (place) {
      const coords = await geocodePlace(place)
      if (!coords) return NextResponse.json({ error: 'place_not_found' }, { status: 404 })
      lat = coords.lat
      lng = coords.lng
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: 'bad_coords' }, { status: 400 })
    }

    const pharmacies = await fetchNearbyPharmacies(lat, lng)
    return NextResponse.json(
      { origin: { lat, lng }, pharmacies },
      { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' } },
    )
  } catch (e) {
    console.error('[api/nearby]', (e as Error).message)
    return NextResponse.json({ error: 'overpass_unavailable' }, { status: 502 })
  }
}
