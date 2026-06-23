// Geo display helpers shared by result cards.
// Distances come from haversine (straight-line); real road distance is longer,
// so trip-time estimates apply a detour factor and are clearly marked approximate.

// Great-circle distance in km between two lat/lng points.
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const toRad = (x: number) => (x * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

export type TripMode = 'walk' | 'drive'
export interface TripEstimate {
  minutes: number
  mode:    TripMode
}

const DETOUR_FACTOR = 1.3   // straight-line -> approx road distance
const WALK_KMH      = 5
const DRIVE_KMH     = 20    // conservative urban average (traffic, lights)

// Honest heuristic, not real routing: short hops assumed walked, longer driven.
export function estimateTrip(km: number): TripEstimate {
  const roadKm = km * DETOUR_FACTOR
  if (km < 1) {
    return { minutes: Math.max(1, Math.round((roadKm / WALK_KMH) * 60)), mode: 'walk' }
  }
  return { minutes: Math.max(1, Math.round((roadKm / DRIVE_KMH) * 60)), mode: 'drive' }
}

// Compact form for pills: "~5 min"
export function formatTripShort(km: number): string {
  return `~${estimateTrip(km).minutes} min`
}

// Full form for tooltips/labels: "~5 min en auto"
export function formatTrip(km: number): string {
  const { minutes, mode } = estimateTrip(km)
  return `~${minutes} min ${mode === 'walk' ? 'a pie' : 'en auto'}`
}

// Google Maps directions deep-link. No API key needed; on mobile it opens the
// native Maps app and routes from the user's current location to the store.
export function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
