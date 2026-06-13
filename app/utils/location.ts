export interface DetectedLocation {
  lat: number
  lng: number
  city: string
  displayName: string
}

export async function detectBrowserLocation(): Promise<DetectedLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalizacion no disponible en este navegador'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords

        // TODO: reemplazar con Google Geocoding API
        // const res = await fetch(
        //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
        // )
        // const data = await res.json()
        // const city = data.results[0]?.address_components.find(c => c.types.includes('locality'))?.long_name

        const city = guessColombiancity(lat, lng)
        resolve({ lat, lng, city, displayName: `${city}, Colombia` })
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Permiso denegado. Activa la ubicacion en tu navegador.',
          2: 'Ubicacion no disponible.',
          3: 'Tiempo de espera agotado.',
        }
        reject(new Error(messages[err.code] ?? 'Error desconocido'))
      },
      { timeout: 8000, maximumAge: 300_000 }
    )
  })
}

// Aproximacion basada en coordenadas colombianas — reemplazar con geocoding real
function guessColombiancity(lat: number, lng: number): string {
  if (lat > 5.8 && lng < -75) return 'Medellín'
  if (lat < 4.0 && lng < -76) return 'Cali'
  if (lat > 6.8) return 'Barranquilla'
  if (lat > 6.2 && lng > -73.5) return 'Bucaramanga'
  return 'Bogotá'
}

// Estructura preparada para busqueda de farmacias cercanas via Google Places
// export async function findNearbyPharmacies(lat: number, lng: number, radiusMeters = 3000) {
//   const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
//   url.searchParams.set('location', `${lat},${lng}`)
//   url.searchParams.set('radius', String(radiusMeters))
//   url.searchParams.set('type', 'pharmacy')
//   url.searchParams.set('key', process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!)
//   const res = await fetch(url.toString())
//   const data = await res.json()
//   return data.results as GooglePlacesResult[]
// }
