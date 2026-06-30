'use client'

import { useState, useCallback } from 'react'
import {
  computeOpenState,
  orderPharmacies,
  type NearbyPharmacy,
  type NearbyPharmacyView,
} from '@/app/utils/nearbyPharmacies'

type Status = 'idle' | 'locating' | 'loading' | 'ready' | 'error'

interface NearbyResponse {
  origin:     { lat: number; lng: number }
  pharmacies: NearbyPharmacy[]
}

export function useNearbyList() {
  const [status,     setStatus]     = useState<Status>('idle')
  const [pharmacies, setPharmacies] = useState<NearbyPharmacyView[]>([])
  const [error,      setError]      = useState<string | null>(null)
  const [origin,     setOrigin]     = useState<{ lat: number; lng: number } | null>(null)

  // All OSM access goes through /api/nearby (server-side: proper User-Agent,
  // mirror fallback). The browser cannot call Overpass/Nominatim reliably.
  const loadFromUrl = useCallback(async (url: string, notFoundMsg: string) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await fetch(url)
      if (res.status === 404) { setError(notFoundMsg); setStatus('error'); return }
      if (!res.ok) throw new Error(`http ${res.status}`)

      const data = (await res.json()) as NearbyResponse
      setOrigin(data.origin)
      const now = new Date()
      const view = data.pharmacies.map<NearbyPharmacyView>((p) => ({
        ...p,
        openState: computeOpenState(p.openingHours, now),
        hasPrices: Boolean(p.chainId),
      }))
      setPharmacies(orderPharmacies(view))
      setStatus('ready')
    } catch {
      setError('No se pudo consultar el mapa en este momento. Intenta de nuevo.')
      setStatus('error')
    }
  }, [])

  // Primary path: browser geolocation.
  const requestLocation = useCallback(() => {
    if (!navigator?.geolocation) {
      setError('Geolocalizacion no disponible en este dispositivo')
      setStatus('error')
      return
    }
    setStatus('locating')
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => { loadFromUrl(`/api/nearby?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`, '') },
      () => {
        setError('Permiso de ubicacion denegado. Escribe tu ciudad o barrio para continuar.')
        setStatus('error')
      },
      { timeout: 10_000, maximumAge: 300_000 },
    )
  }, [loadFromUrl])

  // Fallback path: geocode a typed city/neighbourhood (server-side).
  const searchByPlace = useCallback(async (place: string) => {
    const q = place.trim()
    if (!q) return
    setStatus('locating')
    setError(null)
    await loadFromUrl(
      `/api/nearby?place=${encodeURIComponent(q)}`,
      `No encontramos "${q}". Prueba con otra ciudad o barrio.`,
    )
  }, [loadFromUrl])

  // Explicit coordinates: from an autocomplete pick or a dragged map pin.
  const searchByCoords = useCallback(async (lat: number, lng: number) => {
    setError(null)
    await loadFromUrl(`/api/nearby?lat=${lat}&lng=${lng}`, '')
  }, [loadFromUrl])

  return { status, pharmacies, error, origin, requestLocation, searchByPlace, searchByCoords }
}
