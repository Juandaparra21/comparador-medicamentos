'use client'

import { useState, useMemo } from 'react'
import type { NearbyPharmacy } from '@/app/utils/nearbyPharmacies'

export type PharmacyDistances = Record<string, number> // pharmacy display name → km

// Nearest branch of a chain: distance plus the coordinates needed for directions.
export interface NearestStore {
  lat: number
  lng: number
  km:  number
}
export type PharmacyStores = Record<string, NearestStore> // pharmacy display name → nearest branch

// Reduce all nearby pharmacies to the nearest branch of each chain we price.
function nearestByChain(pharmacies: NearbyPharmacy[]): PharmacyStores {
  const stores: PharmacyStores = {}
  for (const p of pharmacies) {
    if (!p.chainName) continue
    if (!(p.chainName in stores) || p.distanceKm < stores[p.chainName].km) {
      stores[p.chainName] = { lat: p.lat, lng: p.lng, km: p.distanceKm }
    }
  }
  return stores
}

export function useNearbyPharmacies() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [stores,   setStores]   = useState<PharmacyStores>({})
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  // Uses /api/nearby (server-side: proper User-Agent + mirror fallback), then
  // keeps only the nearest branch per priced chain for the result-card pills.
  async function loadFrom(lat: number, lng: number) {
    try {
      const res = await fetch(`/api/nearby?lat=${lat}&lng=${lng}`)
      if (!res.ok) throw new Error(`http ${res.status}`)
      const data = (await res.json()) as { pharmacies: NearbyPharmacy[] }
      const s = nearestByChain(data.pharmacies ?? [])
      if (Object.keys(s).length === 0) setError('No encontramos farmacias conocidas cerca de ti')
      setStores(s)
    } catch {
      setError('No se pudo obtener distancias a farmacias')
    }
    setLoading(false)
  }

  function request() {
    if (!navigator?.geolocation) {
      setError('Geolocalización no disponible en este dispositivo')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPosition(coords)
        loadFrom(coords.lat, coords.lng)
      },
      () => {
        setError('Permiso de ubicación denegado — actívalo en tu navegador')
        setLoading(false)
      },
      { timeout: 10_000, maximumAge: 300_000 },
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
