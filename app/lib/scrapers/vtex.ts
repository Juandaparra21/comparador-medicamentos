import type { ScrapedProduct } from './types'
import { extractConcentration, extractPresentation, extractPackQuantity, classify, matchesQuery } from './utils'
import { withCache } from './cache'

// Scraper generico para tiendas VTEX (misma API publica de catalogo que ya
// usamos en Olimpica). Sirve para cualquier farmacia montada sobre VTEX: hoy
// Farmacia Pasteur y Farmacenter (tienda online farmaexpress.com, el
// e-commerce de Coopidrogas).
interface VtexStore {
  /** id interno estable (se usa en cache y PHARMACY_NAMES) */
  pharmacyId: string
  /** origen de la tienda, sin slash final */
  base: string
}

function headersFor(base: string): Record<string, string> {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Origin': base,
    'Referer': `${base}/`,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(store: VtexStore, p: Record<string, any>): ScrapedProduct | null {
  const name = (String(p.productName ?? '')).trim()
  if (!name) return null

  const items = (p.items ?? []) as Record<string, unknown>[]
  if (!items.length) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sellers = ((items[0] as any).sellers ?? []) as Record<string, unknown>[]
  if (!sellers.length) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const offer = ((sellers[0] as any).commertialOffer ?? {}) as Record<string, number>

  // Sin precio real no hay resultado (campo ausente, nulo o cero)
  const salePrice = Number(offer.Price) || 0
  if (!salePrice || salePrice <= 0 || salePrice > 5_000_000) return null

  const price     = Math.round(salePrice)
  const listPrice = Number(offer.ListPrice) || 0
  const refPrice  = listPrice > salePrice ? Math.round(listPrice) : undefined
  const discount  = refPrice ? Math.round((1 - price / refPrice) * 100) : undefined
  const rawQty    = offer.AvailableQuantity
  const availability: ScrapedProduct['availability'] =
    rawQty === undefined ? 'available' : Number(rawQty) === 0 ? 'unavailable' : Number(rawQty) < 5 ? 'limited' : 'available'

  const presentation = extractPresentation(name)
  const quantity     = extractPackQuantity(name, presentation)

  const brand      = (String(p.brand ?? '')).trim()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstImage = (items[0] as any).images?.[0]?.imageUrl as string | undefined

  return {
    pharmacyId:     store.pharmacyId,
    productName:    name,
    type:           classify({ name, brand }),
    activeIngredient: name.split(/\s/)[0] ?? '',
    concentration:  extractConcentration(name, presentation),
    presentation,
    quantity:       Math.max(quantity, 1),
    price,
    pricePerUnit:   Math.round(price / Math.max(quantity, 1)),
    referencePrice: refPrice,
    discountPct:    discount,
    availability,
    url:      (p.link as string) || `${store.base}/${p.linkText ?? ''}/p`,
    imageUrl: firstImage || undefined,
  }
}

function createVtexScraper(store: VtexStore): (query: string) => Promise<ScrapedProduct[]> {
  const searchUrl = `${store.base}/api/catalog_system/pub/products/search/`
  const headers   = headersFor(store.base)

  return async function search(query: string): Promise<ScrapedProduct[]> {
    return withCache(store.pharmacyId, query, async () => {
      const results: ScrapedProduct[] = []
      let failed = false
      try {
        // Una sola pagina de 50: suficiente para relevancia y rapido.
        const params = new URLSearchParams({ ft: query, _from: '0', _to: '49' })
        const res = await fetch(`${searchUrl}?${params}`, { headers, signal: AbortSignal.timeout(7_000) })
        // VTEX responde 206 cuando hay mas resultados que la pagina pedida.
        if (res.status !== 200 && res.status !== 206) {
          failed = true
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const products = (await res.json()) as Record<string, any>[]
          if (Array.isArray(products)) {
            for (const p of products) {
              const product = mapProduct(store, p)
              if (product) results.push(product)
            }
          }
        }
      } catch (e) {
        console.error(`[${store.pharmacyId}] Error:`, e)
        if (results.length === 0) failed = true
      }
      if (failed) return null // fallo -> servir cache aunque este vieja

      return results.filter(r => matchesQuery(query, r.productName, r.activeIngredient))
    })
  }
}

export const searchPasteur = createVtexScraper({
  pharmacyId: 'pasteur',
  base: 'https://www.farmaciaspasteur.com.co',
})

// Farmacenter vende online a traves de farmaexpress.com (Coopidrogas);
// el link de compra lleva alla.
export const searchFarmacenter = createVtexScraper({
  pharmacyId: 'farmacenter',
  base: 'https://www.farmaexpress.com',
})

// tudrogueriavirtual.com NO es la tienda propia de una sola cadena: es el
// portal compartido de UNIDROGAS S.A.S, que agrupa varias marcas de droguerias
// aliadas (Alemana, Andina, Botica, Drogueria Inglesa, Ahorro Droguerias...).
// El copyright del sitio dice "Tu Drogueria Virtual UNIDROGAS S.A.S"; mostrar
// estos precios como si fueran de una sola cadena (p.ej. "Drogueria Alemana")
// seria inexacto, asi que la fuente se identifica con su propio nombre.
export const searchTuDrogueriaVirtual = createVtexScraper({
  pharmacyId: 'tudrogueria-virtual',
  base: 'https://www.tudrogueriavirtual.com',
})
