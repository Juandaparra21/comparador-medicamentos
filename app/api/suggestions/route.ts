import { NextRequest, NextResponse } from 'next/server'

const ALGOLIA_URL = 'https://api-search.farmatodo.com/1/indexes/products/query'
const ALGOLIA_HEADERS = {
  'x-algolia-api-key': 'eb9544fe7bfe7ec4c1aa5e5bf7740feb',
  'x-algolia-application-id': 'VCOJEYD2PO',
  'content-type': 'application/json',
}

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '')
}

export interface Suggestion {
  label: string
  sublabel: string
  type: 'ingredient' | 'product'
  query: string
  badge: 'Generico' | 'Marca'
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim()
  if (q.length < 2) return NextResponse.json({ suggestions: [] })

  try {
    const res = await fetch(ALGOLIA_URL, {
      method: 'POST',
      headers: ALGOLIA_HEADERS,
      body: JSON.stringify({
        query: q,
        hitsPerPage: 20,
        filters: "categorie:'Salud y medicamentos' OR subCategory:'Drogueria'",
      }),
      signal: AbortSignal.timeout(4000),
    })

    if (!res.ok) return NextResponse.json({ suggestions: [] })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await res.json() as { hits?: Record<string, any>[] }
    const hits = data.hits ?? []
    const nq = normalize(q)

    const seenIngredients = new Set<string>()
    const seenProducts = new Set<string>()
    const suggestions: Suggestion[] = []

    for (const h of hits) {
      // Extract ingredient from large_description or sup_description
      let ingredient = ''
      const ld = String(h.large_description ?? '')
      if (ld) {
        const m = ld.match(/Principio\s+Activo:\s*(.+?)(?:\s*\d|\s*$)/i)
        if (m) ingredient = m[1].trim()
      }
      if (!ingredient) ingredient = String(h.sup_description ?? '').split(/\s/)[0]?.trim() ?? ''
      if (!ingredient) ingredient = String(h.description ?? '').split(/\s/)[0]?.trim() ?? ''

      const productName = String(h.description ?? h.mediaDescription ?? '').trim()
      const isGeneric = Boolean(h.isGeneric || h.generic)
      const badge = isGeneric ? 'Generico' : 'Marca'

      // Ingredient suggestions — first word match
      if (
        ingredient &&
        normalize(ingredient).includes(nq) &&
        !seenIngredients.has(ingredient.toLowerCase())
      ) {
        seenIngredients.add(ingredient.toLowerCase())
        suggestions.push({
          label: ingredient,
          sublabel: 'Principio activo',
          type: 'ingredient',
          query: ingredient,
          badge: 'Generico',
        })
      }

      // Product name suggestions
      if (
        productName &&
        (normalize(productName).includes(nq) || normalize(ingredient).includes(nq)) &&
        !seenProducts.has(productName.toLowerCase())
      ) {
        seenProducts.add(productName.toLowerCase())
        suggestions.push({
          label: productName,
          sublabel: ingredient || 'Medicamento',
          type: 'product',
          query: productName,
          badge,
        })
      }
    }

    // Ingredients first, then products, max 8 total
    const sorted = [
      ...suggestions.filter((s) => s.type === 'ingredient').slice(0, 4),
      ...suggestions.filter((s) => s.type === 'product').slice(0, 4),
    ].slice(0, 8)

    return NextResponse.json({ suggestions: sorted })
  } catch {
    return NextResponse.json({ suggestions: [] })
  }
}
