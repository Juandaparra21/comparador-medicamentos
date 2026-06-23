'use client'

import { useState, useCallback } from 'react'
import {
  fetchNearbyPharmacies,
  geocodePlace,
  computeOpenState,
  orderPharmacies,
  type NearbyPharmacyView,
} from '@/app/utils/nearbyPharmacies'

type Status = 'idle' | 'locating' | 'loading' | 'ready' | 'error'

export function useNearbyList() {
  const [status,      setStatus]      = useState<Status>('idle')
  const [pharmacies,  setPharmacies]  = useState<NearbyPharmacyView[]>([])
  const [error,       setError]       = useState<string | null>(null)
  const [origin,      setOrigin]      = useState<{ lat: number; lng: number } | null>(null)

  const loadFrom = useCallback(async (lat: number, lng: number) => {
    setStatus('loading')
    setError(null)
    setOrigin({ lat, lng })
    try {
      const raw = await fetchNearbyPharmacies(lat, lng)
      const now = new Date()
      const view = raw.map<NearbyPharmacyView>((p) => ({
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
      (pos) => { loadFrom(pos.coords.latitude, pos.coords.longitude) },
      () => {
        setError('Permiso de ubicacion denegado. Escribe tu ciudad o barrio para continuar.')
        setStatus('error')
      },
      { timeout: 10_000, maximumAge: 300_000 },
    )
  }, [loadFrom])

  // Fallback path: geocode a typed city/neighbourhood.
  const searchByPlace = useCallback(async (place: string) => {
    if (!place.trim()) return
    setStatus('locating')
    setError(null)
    try {
      const coords = await geocodePlace(place.trim())
      if (!coords) {
        setError(`No encontramos "${place.trim()}". Prueba con otra ciudad o barrio.`)
        setStatus('error')
        return
      }
      await loadFrom(coords.lat, coords.lng)
    } catch {
      setError('No se pudo ubicar ese lugar. Intenta de nuevo.')
      setStatus('error')
    }
  }, [loadFrom])

  return { status, pharmacies, error, origin, requestLocation, searchByPlace }
}
