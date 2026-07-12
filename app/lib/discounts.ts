import { getAdminClient } from '@/app/lib/supabase/admin'
import type { PharmacyResult } from '@/app/types'

// Only offers re-confirmed by a real scrape in the last 7 days count as fresh.
export const FRESH_DAYS = 7

// Formas farmaceuticas (medicamentos) o cuidado personal/maquillaje: lo unico
// que queremos destacar. Excluye mercancia de bazar que la farmacia tambien
// vende (papeleria, accesorios) aunque traiga descuento.
const DOSAGE_FORM_RE =
  /\b(\d+\s?(mg|mcg|ml|g)\b|tableta|c[aá]psula|jarabe|comprimido|gotas|suspensi[oó]n|crema|gel|ung[uü]ento|soluci[oó]n|parche|inyectable|polvo|spray|aerosol)/i
const PERSONAL_CARE_RE =
  /\b(maquillaje|labial|r[ií]mel|base de maquillaje|protector solar|bloqueador|shampoo|champ[uú]|jab[oó]n|perfume|colonia|esmalte|delineador|rubor|sombra|corrector|polvo compacto|desodorante)/i
const NON_HEALTH_RE = /\b(papel|hoja|rice paper|toalla|cepillo|peine|bater[ií]a|pila|juguete)/i

export function isRelevantDiscount(r: { activeIngredient: string; productName: string }): boolean {
  const text = `${r.activeIngredient} ${r.productName}`
  if (NON_HEALTH_RE.test(text)) return false
  return DOSAGE_FORM_RE.test(text) || PERSONAL_CARE_RE.test(text)
}

// The full fresh, relevant, discounted pool across all pharmacies (search_results
// is refreshed by every live search and by the daily cron). Ordered by discount desc.
export async function getDiscountPool(): Promise<(PharmacyResult & { lastUpdated?: string })[]> {
  const db = getAdminClient()
  if (!db) return []

  const since = new Date(Date.now() - FRESH_DAYS * 86_400_000).toISOString()
  const { data } = await db
    .from('search_results')
    .select('*')
    .gt('discount', 0)
    .eq('availability', 'available')
    .gte('lastUpdated', since)
    // Filtrar ingredientes que parecen nombres de producto, no principio activo
    .not('activeIngredient', 'ilike', 'oferta%')
    .not('activeIngredient', 'ilike', 'aranda%')
    .order('discount', { ascending: false })
    .limit(300)

  const raw = (data ?? []) as (PharmacyResult & { lastUpdated?: string })[]
  return raw.filter(isRelevantDiscount)
}
