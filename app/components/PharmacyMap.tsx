'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { NearbyPharmacyView, OpenState } from '@/app/utils/nearbyPharmacies'
import { formatDistance, formatTripShort, directionsUrl } from '@/app/utils/geo'

interface Props {
  origin:     { lat: number; lng: number }
  pharmacies: NearbyPharmacyView[]
}

const PIN_COLOR: Record<OpenState, string> = {
  open:    '#006e28', // secondary green
  closed:  '#c0392b', // red
  unknown: '#0058bc', // primary blue
}

function pinHtml(color: string): string {
  return `<svg width="30" height="30" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3))">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="3.2" fill="white" stroke="none"/>
    <path d="M12 7.3v3.4M10.3 9h3.4" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/>
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
  const chain = p.chainName ? `<span style="color:#0058bc;font-weight:700"> &middot; ${escapeHtml(p.chainName)}</span>` : ''
  return `<div style="font-family:inherit;min-width:160px">
    <p style="font-weight:700;font-size:13px;margin:0 0 2px;color:#1a1b1f">${escapeHtml(p.name)}${chain}</p>
    <p style="font-size:12px;margin:0 0 2px;color:#006e28;font-weight:600">a ${formatDistance(p.distanceKm)} &middot; ${formatTripShort(p.distanceKm)}</p>
    <p style="font-size:11px;margin:0 0 6px;color:#717786">${open}</p>
    <a href="${directionsUrl(p.lat, p.lng)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;font-weight:600;color:#0058bc;text-decoration:none">Como llegar &rarr;</a>
  </div>`
}

export default function PharmacyMap({ origin, pharmacies }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([origin.lat, origin.lng], 14)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    L.marker([origin.lat, origin.lng], {
      icon: L.divIcon({ className: '', html: userHtml(), iconSize: [16, 16], iconAnchor: [8, 8] }),
      zIndexOffset: 1000,
    }).addTo(map).bindPopup('Tu ubicacion')

    const group = L.featureGroup()
    for (const p of pharmacies) {
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: '',
          html: pinHtml(PIN_COLOR[p.openState]),
          iconSize: [30, 30],
          iconAnchor: [15, 28],
          popupAnchor: [0, -26],
        }),
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
