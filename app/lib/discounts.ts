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

// Consumo facil: productos que se compran sin pensarlo mucho (vitaminas,
// cuidado diario, condones, cuidado de piel). Junto con belleza/cuidado
// personal, son la prioridad editorial de la seccion de descuentos.
// Ojo: "magnesio"/"zinc" sueltos NO sirven, son sales de medicamentos
// (p. ej. "esomeprazol magnesio trihidrato"); se exige contexto de suplemento.
const EASY_CONSUMPTION_RE =
  /\b(vitamina|multivitam[ií]n|suplemento|col[aá]geno|omega\s?3|(citrato|cloruro|gluconato)\s+de\s+magnesio|crema dental|enjuague bucal|hidratante|humectante|exfoliante|mascarilla|s[eé]rum|acondicionador|tratamiento capilar|pa[ñn]itos|suero oral|electrolitos|cond[oó]n|condones|preservativo|lubricante|gel antibacterial|alcohol antis[eé]ptico|repelente|pa[ñn]al|crema (corporal|facial|de manos)|locion|loci[oó]n|talco|curitas?|venditas?)/i

// Marcas y genericos de venta libre que cualquiera reconoce en una historia
// de Instagram. Es la segunda capa de la historia cuando no alcanzan los de
// consumo; los medicamentos de formula poco conocidos no entran a la historia.
const KNOWN_OTC_RE =
  /\b(apronax|dolex|advil|aspirina|alka.?seltzer|acetaminof[eé]n|ibuprofeno|naproxeno|buscapina|noraver|vick|isodine|mylanta|milanta|sal de frutas|ensure|pediasure|pedialyte|smecta|gaseosol|acetaminofen)/i

// Producto reconocible para publicar en redes: consumo facil o marca OTC.
export function isKnownOtcDiscount(r: { activeIngredient: string; productName: string }): boolean {
  return KNOWN_OTC_RE.test(`${r.activeIngredient} ${r.productName}`)
}

export function isRelevantDiscount(r: { activeIngredient: string; productName: string }): boolean {
  const text = `${r.activeIngredient} ${r.productName}`
  if (NON_HEALTH_RE.test(text)) return false
  return DOSAGE_FORM_RE.test(text) || PERSONAL_CARE_RE.test(text) || EASY_CONSUMPTION_RE.test(text)
}

// Belleza/cuidado personal y consumo facil van primero en los destacados.
export function isPriorityDiscount(r: { activeIngredient: string; productName: string }): boolean {
  const text = `${r.activeIngredient} ${r.productName}`
  return PERSONAL_CARE_RE.test(text) || EASY_CONSUMPTION_RE.test(text)
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

// Deterministic shuffle: same order during the whole day (stable across the
// hourly ISR regenerations), different order the next day.
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items]
  let s = seed || 1
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4_294_967_296
    return s / 4_294_967_296
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Semilla del día: la selección rota a las 7:00 am hora Bogotá (UTC-5), la
// hora a la que el dueño publica la historia en Instagram. Se resta 12h
// (5 de zona horaria + 7 de corte) para que el "día" arranque a esa hora.
export function daySeed(): number {
  return Math.floor((Date.now() - 12 * 3_600_000) / 86_400_000)
}

// Daily featured picks: rotate among the best offers instead of always showing
// the single highest discount (long-running promos made the section look
// frozen). Beauty/personal-care and easy-consumption items go first,
// medications fill the rest. Max 2 per pharmacy so one aggressive source
// cannot monopolize. Shared by the home section and the IG image.
export function selectDailyFeatured(
  pool: (PharmacyResult & { lastUpdated?: string })[],
  limit: number,
): PharmacyResult[] {
  const seed = daySeed()
  const priority = pool.filter(isPriorityDiscount)
  const rest = pool.filter((r) => !isPriorityDiscount(r))
  const candidates = [
    ...seededShuffle(priority.slice(0, 40), seed),
    ...seededShuffle(rest.slice(0, 60), seed + 1),
  ]

  const featured: PharmacyResult[] = []
  const chosen = new Set<string>()
  const perPharmacy: Record<string, number> = {}
  for (const r of candidates) {
    if (featured.length >= limit) break
    if (chosen.has(r.id) || (perPharmacy[r.pharmacy] ?? 0) >= 2) continue
    featured.push(r)
    chosen.add(r.id)
    perPharmacy[r.pharmacy] = (perPharmacy[r.pharmacy] ?? 0) + 1
  }
  // Si el tope por farmacia dejó huecos (pocas fuentes con ofertas), rellenar.
  for (const r of candidates) {
    if (featured.length >= limit) break
    if (!chosen.has(r.id)) { featured.push(r); chosen.add(r.id) }
  }
  return featured.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
}
