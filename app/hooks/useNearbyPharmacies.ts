'use client'

import { useState, useMemo } from 'react'

export type PharmacyDistances = Record<string, number> // pharmacy display name → km

// Nearest branch of a chain: distance plus the coordinates needed for directions.
export interface NearestStore {
  lat: number
  lng: number
  km:  number
}
export type PharmacyStores = Record<string, NearestStore> // pharmacy display name → nearest branch

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

async function fetchNearestStores(lat: number, lng: number): Promise<PharmacyStores> {
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
  const stores: PharmacyStores = {}

  for (const el of (data.elements ?? [])) {
    const name = String(el.tags?.name ?? el.tags?.brand ?? '').trim()
    const eLat = el.lat ?? el.center?.lat
    const eLng = el.lon ?? el.center?.lon
    if (!eLat || !eLng || !name) continue

    for (const [pattern, pharmacyName] of PHARMACY_PATTERNS) {
      if (pattern.test(name)) {
        const d = haversineKm(lat, lng, eLat, eLng)
        if (!(pharmacyName in stores) || d < stores[pharmacyName].km) {
          stores[pharmacyName] = { lat: eLat, lng: eLng, km: d }
        }
      }
    }
  }

  return stores
}

export function useNearbyPharmacies() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [stores,   setStores]   = useState<PharmacyStores>({})
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

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
          const s = await fetchNearestStores(coords.lat, coords.lng)
          if (Object.keys(s).length === 0) {
            setError('No encontramos farmacias conocidas cerca de ti')
          }
          setStores(s)
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
    setStores({})
    setError(null)
  }

  // Derived map (pharmacy → km) kept for sorting and existing callers.
  const distances = useMemo<PharmacyDistances>(
    () => Object.fromEntries(Object.entries(stores).map(([k, v]) => [k, v.km])),
    [stores],
  )

  const hasDistances = Object.keys(stores).length > 0

  return { position, distances, stores, loading, error, hasDistances, request, clear }
}
