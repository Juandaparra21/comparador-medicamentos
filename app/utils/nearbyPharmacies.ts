// Real-time nearby pharmacy lookup via OpenStreetMap (Overpass + Nominatim).
// Every field returned here comes from OSM. Nothing is inferred or invented:
// missing data stays missing (no ratings, no fabricated hours).

import { haversineKm } from './geo'

// Overpass mirrors, tried in order. They require a meaningful User-Agent or they
// return 406/429, and browsers cannot set User-Agent on fetch — which is why
// these run server-side behind /api/nearby, not from the client.
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
]
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'Farmi/1.0 (comparador de medicamentos; https://farmi.co)'

export type OpenState = 'open' | 'closed' | 'unknown'

export interface NearbyPharmacy {
  id:            string   // OSM "type/id", e.g. "node/123" — the unique identifier
  name:          string
  lat:           number
  lng:           number
  distanceKm:    number
  address?:      string
  openingHours?: string   // raw OSM opening_hours string
  chainId?:      string   // internal chain id when the branch belongs to a chain we price
  chainName?:    string   // display name matching the scrapers' PHARMACY_NAMES
}

// OSM name/brand/operator -> [chainId, display name aligned with scrapers/index.ts]
const CHAIN_PATTERNS: Array<[RegExp, string, string]> = [
  [/farmatodo/i,          'farmatodo',   'Farmatodo'],
  [/cruz\s*verde/i,       'cruz-verde',  'Cruz Verde'],
  [/rebaja|la\s*rebaja/i, 'la-rebaja',   'Drogas La Rebaja'],
  [/olimpica/i,           'olimpica',    'Olimpica Drogueria'],
  [/colsubsidio/i,        'colsubsidio', 'Drogueria Colsubsidio'],
  [/cafam/i,              'cafam',       'Cafam'],
]

interface OverpassElement {
  type:    string
  id:      number
  lat?:    number
  lon?:    number
  center?: { lat: number; lon: number }
  tags?:   Record<string, string>
}

function matchChain(...names: string[]): { chainId: string; chainName: string } | null {
  for (const n of names) {
    if (!n) continue
    for (const [re, chainId, chainName] of CHAIN_PATTERNS) {
      if (re.test(n)) return { chainId, chainName }
    }
  }
  return null
}

function buildAddress(tags: Record<string, string>): string | undefined {
  const street = tags['addr:street']
  const num    = tags['addr:housenumber']
  const area   = tags['addr:suburb'] ?? tags['addr:neighbourhood'] ?? tags['addr:city']
  const parts: string[] = []
  if (street) parts.push(num ? `${street} ${num}` : street)
  if (area)   parts.push(area)
  return parts.length ? parts.join(', ') : undefined
}

function buildQuery(lat: number, lng: number, radiusM: number): string {
  return `[out:json][timeout:25];
(
  node["amenity"="pharmacy"](around:${radiusM},${lat},${lng});
  way["amenity"="pharmacy"](around:${radiusM},${lat},${lng});
);
out center tags;`
}

function parseElements(elements: OverpassElement[], userLat: number, userLng: number): NearbyPharmacy[] {
  const out: NearbyPharmacy[] = []
  for (const el of elements) {
    const lat = el.lat ?? el.center?.lat
    const lng = el.lon ?? el.center?.lon
    if (lat == null || lng == null) continue

    const tags  = el.tags ?? {}
    const name  = tags.name ?? tags.brand ?? tags.operator ?? 'Farmacia (sin nombre)'
    const chain = matchChain(tags.name ?? '', tags.brand ?? '', tags.operator ?? '')

    out.push({
      id:           `${el.type}/${el.id}`,
      name,
      lat,
      lng,
      distanceKm:   haversineKm(userLat, userLng, lat, lng),
      address:      buildAddress(tags),
      openingHours: tags.opening_hours,
      chainId:      chain?.chainId,
      chainName:    chain?.chainName,
    })
  }
  return out
}

// Server-side only. Tries each mirror in turn with a proper User-Agent.
async function queryOverpass(body: string): Promise<OverpassElement[]> {
  let lastErr: unknown
  for (const url of OVERPASS_MIRRORS) {
    try {
      const res = await fetch(url, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent':   USER_AGENT,
          'Accept':       'application/json',
        },
        body:   `data=${encodeURIComponent(body)}`,
        signal: AbortSignal.timeout(12_000),
      })
      if (!res.ok) throw new Error(`Overpass ${res.status} @ ${url}`)
      const data = (await res.json()) as { elements?: OverpassElement[] }
      return data.elements ?? []
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('All Overpass mirrors failed')
}

// Progressive radius: start at 5 km, expand to 10 km only if nothing is found.
export async function fetchNearbyPharmacies(lat: number, lng: number): Promise<NearbyPharmacy[]> {
  for (const radius of [5000, 10000]) {
    const elements = await queryOverpass(buildQuery(lat, lng, radius))
    const list = parseElements(elements, lat, lng).sort((a, b) => a.distanceKm - b.distanceKm)
    if (list.length > 0) return list
  }
  return []
}

// Geocode a typed city/neighbourhood to coordinates (fallback when geolocation
// is denied). Server-side only — Nominatim also requires a User-Agent.
export async function geocodePlace(query: string): Promise<{ lat: number; lng: number } | null> {
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(`${query}, Colombia`)}&format=json&limit=1`
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
    signal:  AbortSignal.timeout(10_000),
  })
  if (!res.ok) return null
  const data = (await res.json()) as Array<{ lat: string; lon: string }>
  if (!data.length) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

/* ── Open-now parser ──────────────────────────────────────────────────
   Handles the common OSM opening_hours subset. Returns 'unknown' for any
   construct it cannot parse with confidence, so it never guesses. */

const DAY_INDEX: Record<string, number> = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 }

function parseDays(part: string): number[] | null {
  const text = part.trim()
  if (!text) return [0, 1, 2, 3, 4, 5, 6]   // no day spec -> every day
  const days = new Set<number>()
  for (const token of text.split(',')) {
    const t = token.trim()
    if (t.includes('-')) {
      const [a, b] = t.split('-').map((d) => d.trim())
      if (!(a in DAY_INDEX) || !(b in DAY_INDEX)) return null
      const start = DAY_INDEX[a]
      const span  = (DAY_INDEX[b] - start + 7) % 7
      for (let i = 0; i <= span; i++) days.add((start + i) % 7)
    } else {
      if (!(t in DAY_INDEX)) return null
      days.add(DAY_INDEX[t])
    }
  }
  return [...days]
}

export function computeOpenState(openingHours: string | undefined, now: Date): OpenState {
  if (!openingHours) return 'unknown'
  const s = openingHours.trim()
  if (/^24\s*\/\s*7$/.test(s)) return 'open'

  // Bail out on constructs this parser does not support, to avoid wrong answers.
  if (/\b(PH|SH|off|week|sunrise|sunset|dawn|dusk)\b/i.test(s)) return 'unknown'
  if (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(s)) return 'unknown'

  const today  = now.getDay()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const timeRe = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g
  let parsedAnyRange = false

  for (const rule of s.split(';')) {
    const r = rule.trim()
    if (!r) continue

    const matches = [...r.matchAll(timeRe)]
    if (matches.length === 0) continue

    const dayPart = r.slice(0, r.search(/\d{1,2}:\d{2}/)).trim()
    const days = parseDays(dayPart)
    if (days === null) return 'unknown'     // unrecognized day token
    parsedAnyRange = true
    if (!days.includes(today)) continue

    for (const m of matches) {
      const start = parseInt(m[1]) * 60 + parseInt(m[2])
      const end   = parseInt(m[3]) * 60 + parseInt(m[4])
      const open  = end <= start
        ? nowMin >= start || nowMin < end   // crosses midnight
        : nowMin >= start && nowMin < end
      if (open) return 'open'
    }
  }

  return parsedAnyRange ? 'closed' : 'unknown'
}

/* ── Ordering ─────────────────────────────────────────────────────────
   Priority per spec: distance, then open now, then has price data.
   Distance is bucketed (500 m) so the secondary keys can actually reorder
   pharmacies that are roughly equidistant. (OSM has no ratings to sort by.) */

export interface NearbyPharmacyView extends NearbyPharmacy {
  openState: OpenState
  hasPrices: boolean
}

export function orderPharmacies(list: NearbyPharmacyView[]): NearbyPharmacyView[] {
  const rank = (s: OpenState) => (s === 'open' ? 0 : s === 'unknown' ? 1 : 2)
  return [...list].sort((a, b) => {
    const bucketA = Math.round(a.distanceKm / 0.5)
    const bucketB = Math.round(b.distanceKm / 0.5)
    if (bucketA !== bucketB) return bucketA - bucketB
    if (rank(a.openState) !== rank(b.openState)) return rank(a.openState) - rank(b.openState)
    if (a.hasPrices !== b.hasPrices) return a.hasPrices ? -1 : 1
    return a.distanceKm - b.distanceKm
  })
}
