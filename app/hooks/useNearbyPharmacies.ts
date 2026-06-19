'use client'

import { useState } from 'react'

export type PharmacyDistances = Record<string, number> // pharmacy display name → km

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const toRad = (x: number) => (x * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Maps OSM "name" / "brand" tag → our pharmacy display name
const PHARMACY_PATTERNS: Array<[RegExp, string]> = [
  [/farmatodo/i,            'Farmatodo'],
  [/cruz\s*verde/i,         'Cruz Verde'],
  [/rebaja|la\s*rebaja/i,  'Drogas La Rebaja'],
  [/olimpica/i,             'Olimpica Drogueria'],
  [/colsubsidio/i,          'Drogueria Colsubsidio'],
]

async function fetchNearestStores(lat: number, lng: number): Promise<PharmacyDistances> {
  const overpassQuery = `[out:json][timeout:15];
(
  node["amenity"="pharmacy"](around:20000,${lat},${lng});
  way["amenity"="pharmacy"](around:20000,${lat},${lng});
);
out center;`

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(overpassQuery)}`,
  })

  if (!res.ok) throw new Error(`Overpass error ${res.status}`)
  const data = await res.json()
  const distances: PharmacyDistances = {}

  for (const el of (data.elements ?? [])) {
    const name = String(el.tags?.name ?? el.tags?.brand ?? '').trim()
    const eLat = el.lat ?? el.center?.lat
    const eLng = el.lon ?? el.center?.lon
    if (!eLat || !eLng || !name) continue

    for (const [pattern, pharmacyName] of PHARMACY_PATTERNS) {
      if (pattern.test(name)) {
        const d = haversineKm(lat, lng, eLat, eLng)
        if (!(pharmacyName in distances) || d < distances[pharmacyName]) {
          distances[pharmacyName] = d
        }
      }
    }
  }

  return distances
}

export function useNearbyPharmacies() {
  const [position,  setPosition]  = useState<{ lat: number; lng: number } | null>(null)
  const [distances, setDistances] = useState<PharmacyDistances>({})
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  async function request() {
    if (!navigator?.geolocation) {
      setError('Geolocalización no disponible en este dispositivo')
      return
    }
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPosition(coords)
        try {
          const d = await fetchNearestStores(coords.lat, coords.lng)
          setDistances(d)
        } catch {
          setError('No se pudo obtener distancias a farmacias')
        }
        setLoading(false)
      },
      () => {
        setError('Permiso de ubicación denegado — actívalo en tu navegador')
        setLoading(false)
      },
      { timeout: 10_000, maximumAge: 300_000 }
    )
  }

  function clear() {
    setPosition(null)
    setDistances({})
    setError(null)
  }

  const hasDistances = Object.keys(distances).length > 0

  return { position, distances, loading, error, hasDistances, request, clear }
}
