'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { NearbyPharmacyView } from '@/app/utils/nearbyPharmacies'
import { formatDistance, formatTripShort, directionsUrl } from '@/app/utils/geo'

interface Props {
  origin:     { lat: number; lng: number }
  pharmacies: NearbyPharmacyView[]
  // When provided, the user's blue pin becomes draggable and this fires with the
  // new coordinates on drag end (so the page can offer "search here").
  onPinDrag?: (lat: number, lng: number) => void
}

// Affiliate (one of our priced chains): prominent branded blue pin with a
// medical cross. Generic (any other pharmacy from OSM): smaller muted gray pin.
function affiliatePinHtml(): string {
  return `<svg width="36" height="36" viewBox="0 0 24 24" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#0058bc" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="9" r="3.4" fill="white"/>
    <path d="M12 7.1v3.8M10.1 9h3.8" stroke="#0058bc" stroke-width="1.7" stroke-linecap="round"/>
  </svg>`
}

function genericPinHtml(): string {
  return `<svg width="24" height="24" viewBox="0 0 24 24" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,0.25))">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#9ca3af" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="9" r="2.6" fill="white"/>
  </svg>`
}

function userHtml(): string {
  return `<div style="width:16px;height:16px;border-radius:9999px;background:#0058bc;border:3px solid white;box-shadow:0 0 0 2px rgba(0,88,188,0.4),0 1px 3px rgba(0,0,0,0.3)"></div>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function popupHtml(p: NearbyPharmacyView): string {
  const open = p.openState === 'open' ? 'Abierta ahora'
    : p.openState === 'closed' ? 'Cerrada ahora'
    : 'Horario no verificado'
  const badge = p.chainName
    ? `<span style="display:inline-block;font-size:10px;font-weight:700;color:#fff;background:#0058bc;padding:1px 7px;border-radius:9999px;margin-bottom:5px">${escapeHtml(p.chainName)} &middot; con precios</span>`
    : `<span style="display:inline-block;font-size:10px;font-weight:600;color:#717786;background:#f0f1f5;padding:1px 7px;border-radius:9999px;margin-bottom:5px">Otra farmacia</span>`
  return `<div style="font-family:inherit;min-width:160px">
    ${badge}
    <p style="font-weight:700;font-size:13px;margin:0 0 2px;color:#1a1b1f">${escapeHtml(p.name)}</p>
    <p style="font-size:12px;margin:0 0 2px;color:#006e28;font-weight:600">a ${formatDistance(p.distanceKm)} &middot; ${formatTripShort(p.distanceKm)}</p>
    <p style="font-size:11px;margin:0 0 6px;color:#717786">${open}</p>
    <a href="${directionsUrl(p.lat, p.lng)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;font-weight:600;color:#0058bc;text-decoration:none">Como llegar &rarr;</a>
  </div>`
}

export default function PharmacyMap({ origin, pharmacies, onPinDrag }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Keep the latest callback without making the map effect depend on it.
  const onPinDragRef = useRef(onPinDrag)
  useEffect(() => { onPinDragRef.current = onPinDrag }, [onPinDrag])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([origin.lat, origin.lng], 14)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    const draggable = Boolean(onPinDragRef.current)
    const userMarker = L.marker([origin.lat, origin.lng], {
      icon: L.divIcon({ className: '', html: userHtml(), iconSize: [16, 16], iconAnchor: [8, 8] }),
      zIndexOffset: 1000,
      draggable,
    }).addTo(map).bindPopup(draggable ? 'Arrastrame para fijar tu direccion' : 'Tu ubicacion')

    if (draggable) {
      userMarker.on('dragend', () => {
        const { lat, lng } = userMarker.getLatLng()
        onPinDragRef.current?.(lat, lng)
      })
    }

    const group = L.featureGroup()
    for (const p of pharmacies) {
      const affiliate = Boolean(p.chainName)
      const size = affiliate ? 36 : 24
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: '',
          html: affiliate ? affiliatePinHtml() : genericPinHtml(),
          iconSize: [size, size],
          iconAnchor: [size / 2, size - 2],
          popupAnchor: [0, -(size - 4)],
        }),
        zIndexOffset: affiliate ? 500 : 0, // affiliates render on top
      }).bindPopup(popupHtml(p)).addTo(group)
    }
    group.addTo(map)

    if (pharmacies.length > 0) {
      const bounds = group.getBounds().extend([origin.lat, origin.lng])
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 15 })
    }

    // Leaflet needs a re-measure once the container has its final size.
    const t = setTimeout(() => map.invalidateSize(), 150)

    return () => {
      clearTimeout(t)
      map.remove()
    }
  }, [origin, pharmacies])

  return <div ref={containerRef} className="w-full h-full" aria-label="Mapa de farmacias cercanas" />
}
