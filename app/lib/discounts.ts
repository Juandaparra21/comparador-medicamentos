import { getAdminClient } from '@/app/lib/supabase/admin'
import type { PharmacyResult } from '@/app/types'

// Only offers re-confirmed by a real scrape in the last 7 days count as fresh.
export const FRESH_DAYS = 7

// Formas farmaceuticas (medicamentos) o cuidado personal/maquillaje: lo unico
// que queremos destacar. Excluye mercancia de bazar que la farmacia tambien
// vende (papeleria, accesorios) aunque traiga descuento.
const DOSAGE_FORM_RE =
  /\b(\d+\s?(mg|mcg|ml|g)\b|tableta|c[aá]psula|jarabe|comprimido|gotas|suspensi[oó]n|crema|gel|ung[uü]ento|soluci[oó]n|parche|inyectable|polvo|spray|aerosol)/i
const NON_HEALTH_RE = /\b(papel|hoja|rice paper|bater[ií]a|pila|juguete)/i

// Belleza y cuidado personal: lo que la gente reconoce y compra sin pensarlo.
const PERSONAL_CARE_RE =
  /\b(maquillaje|labial|b[aá]lsamo labial|r[ií]mel|base de maquillaje|base l[ií]quida|polvo (compacto|suelto)|protector solar|bloqueador solar|autobronceador|bronceador|shampoo|champ[uú]|acondicionador|jab[oó]n (l[ií]quido|de tocador|en barra)?|gel de ducha|perfume|colonia|fragancia|esmalte|quitaesmalte|removedor de esmalte|delineador|rubor|sombra (de ojos)?|corrector( de ojeras)?|contorno de ojos|desodorante|antitranspirante|crema de afeitar|espuma de afeitar|after\s?shave|locion para afeitar|m[aá]quina de afeitar|rastrillo|rasuradora|cera depilatoria|depilaci[oó]n|tinte (para el cabello|capilar)|gel para el cabello|mousse capilar|keratina|crema antiarrugas|crema antiedad|cepillo dental|cepillo de dientes|hilo dental|seda dental|enjuague bucal|pasta dental)/i

// Consumo facil: productos que se compran sin pensarlo mucho (vitaminas,
// cuidado diario, bebe, higiene femenina, primeros auxilios). Junto con
// belleza/cuidado personal, son la prioridad editorial de la seccion de
// descuentos. Ojo: "magnesio"/"zinc" sueltos NO sirven, son sales de
// medicamentos (p. ej. "esomeprazol magnesio trihidrato"); se exige contexto
// de suplemento.
const EASY_CONSUMPTION_RE =
  /\b(vitamina|multivitam[ií]n|suplemento|col[aá]geno|omega\s?3|prote[ií]na (en polvo|whey)|biotina|[aá]cido f[oó]lico|complejo b|melatonina|prop[oó]leo|jalea real|probi[oó]tico|(citrato|cloruro|gluconato)\s+de\s+magnesio|crema dental|hidratante|humectante|exfoliante|mascarilla( facial)?|s[eé]rum|tratamiento capilar|pa[ñn]itos( h[uú]medos)?|toallitas h[uú]medas|suero oral|suero fisiol[oó]gico|soluci[oó]n salina|electrolitos|cond[oó]n(es)?|preservativo|lubricante( [ií]ntimo)?|gel antibacterial|alcohol (antis[eé]ptico|en gel)?|repelente|pa[ñn]al(es)?|f[oó]rmula infantil|leche de f[oó]rmula|biber[oó]n|chupo|chupete|toalla(s)? higi[eé]nica(s)?|toalla(s)? sanitaria(s)?|tamp[oó]n(es)?|protector(es)? diario(s)?|copa menstrual|gasas?|algod[oó]n|agua oxigenada|curitas?|venditas?|tapabocas|mascarilla quir[uú]rgica|term[oó]metro|crema (corporal|facial|de manos|antipa[ñn]alitis)|locion|loci[oó]n)/i

// Marcas y genericos de venta libre que cualquiera reconoce en una historia
// de Instagram: analgesicos/gripales de mostrador, digestivos, marcas de
// higiene/cuidado personal masivas, bebidas/geles de rehidratacion. Es la
// segunda capa cuando no alcanzan los de consumo; los medicamentos de formula
// poco conocidos no entran aqui.
const KNOWN_OTC_RE =
  /\b(apronax|dolex|advil|aspirina|bayaspirina|alka.?seltzer|acetaminof[eé]n|ibuprofeno|naproxeno|loratadina|cetirizina|clarityne|allegra|benadryl|actifed|bisolvon|ambroxol|resfrialivio|coldrex|buscapina|noraver|winasorb|dolofin|tafirol|mejoral|aliviax|dolo ?neurobion|cafiaspirina|omeprazol|ranitidina|vick|vaporub|isodine|betadine|mylanta|milanta|gelusil|rennie|alusil|sal de frutas|ensure|boost|centrum|redoxon|emergen-?c|berocca|pediasure|pedialyte|electrolit|smecta|gaseosol|nivea|dove|vaselina|eucerin|cetaphil|cerave|neutrogena|johnson|sedal|head\s?&\s?shoulders|pantene|gillette|colgate|oral-?b|listerine)/i

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

// De consumo masivo: prioridad (belleza/consumo facil) o marca OTC conocida.
// Es el filtro real para "promociones" cara al publico (portada e Instagram):
// deja fuera medicamentos de formula poco reconocibles aunque tengan mas
// descuento, para que solo se destaque lo que de verdad le interesa a la
// gente. La pagina /ofertas (listado completo) NO usa este filtro a proposito:
// ahi sigue entrando todo lo relevante, para quien busca su medicamento puntual.
export function isMassConsumerDiscount(r: { activeIngredient: string; productName: string }): boolean {
  return isPriorityDiscount(r) || isKnownOtcDiscount(r)
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
// frozen). Solo entra consumo masivo (isMassConsumerDiscount): belleza/
// cuidado facil primero, marcas OTC reconocibles rellenan el resto.
// Medicamentos de formula poco conocidos NUNCA aparecen aqui, aunque tengan
// mas descuento. Max 2 por farmacia para que ninguna fuente monopolice.
// Compartido por la portada y el video/imagen de Instagram.
export function selectDailyFeatured(
  pool: (PharmacyResult & { lastUpdated?: string })[],
  limit: number,
): PharmacyResult[] {
  const seed = daySeed()
  const priority = pool.filter(isPriorityDiscount)
  const otc = pool.filter((r) => !isPriorityDiscount(r) && isKnownOtcDiscount(r))
  const candidates = [
    ...seededShuffle(priority.slice(0, 40), seed),
    ...seededShuffle(otc.slice(0, 60), seed + 1),
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
