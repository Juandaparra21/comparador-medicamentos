import { VOLUME_PRESENTATIONS, ML_PER_ONZA } from '@/app/utils/units'
import { ACTIVE_INGREDIENTS, POPULAR_BRANDS } from '@/app/utils/medicationVocabulary'

export function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '')
}

/**
 * Recall-friendly relevance check. Keeps a product when the main word of the
 * query (the longest token, usually the drug/brand name) appears in the given
 * fields. Multi-word queries no longer require the exact phrase, and qualifier
 * words (mg, 400, jarabe) no longer wrongly exclude otherwise-relevant results.
 */
export function matchesQuery(query: string, ...fields: string[]): boolean {
  const tokens = normalize(query).split(/\s+/).filter((t) => t.length >= 3)
  if (tokens.length === 0) return true
  const hay  = normalize(fields.join(' '))
  const main = tokens.reduce((a, b) => (b.length > a.length ? b : a))
  // Match the main token, and also require any other long tokens (>=5) that exist
  // so "losartan hidroclorotiazida" stays specific, but "ibuprofeno 400" does not.
  const strong = tokens.filter((t) => t.length >= 5)
  if (strong.length >= 2) return strong.every((t) => hay.includes(t))
  return hay.includes(main)
}

// Solid oral forms where a bare "g" is a real dose strength (e.g. "amoxicilina 1 g"
// tablet). For creams, ointments and liquids a bare "g"/"ml" is the net content of
// the container, NOT a concentration, so it must never be shown as a strength.
const SOLID_DOSE_PRESENTATIONS = new Set([
  'Tableta', 'Capsula', 'Polvo', 'Supositorio', 'Ovulo',
])

/**
 * Drug strength shown next to the name (e.g. "500mg", "5%", "250mg/5ml").
 *
 * A bare volume/weight ("120ml", "400ml", "30g") is the PACKAGE CONTENT of a frasco
 * or tube, not the active-ingredient concentration, so it is deliberately not
 * returned here — it surfaces as the pack quantity instead. Otherwise a body lotion
 * like "CREMA LUBRIDERM 120 ML" wrongly reads as "concentration 120ml".
 */
export function extractConcentration(name: string, presentation = ''): string {
  const s = name.toLowerCase()

  // Ratio strength of a syrup/suspension, e.g. "250mg/5ml" — the true concentration.
  // Matched first so the volume part ("5ml") is never mistaken for package content.
  const ratio = s.match(/(\d+(?:[.,]\d+)?)\s*(mg|g|mcg|ug|ui)\s*\/\s*(\d+(?:[.,]\d+)?)\s*ml\b/)
  if (ratio) return `${ratio[1].replace(',', '.')}${ratio[2]}/${ratio[3].replace(',', '.')}ml`

  // Percentage strength, e.g. a "5%" cream.
  const pct = s.match(/(\d+(?:[.,]\d+)?)\s*%/)
  if (pct) return `${pct[1].replace(',', '.')}%`

  // Dose units that always denote drug strength, never package content.
  const dose = s.match(/(\d+(?:[.,]\d+)?)\s*(mg|mcg|ug|ui)\b/)
  if (dose) return `${dose[1].replace(',', '.')}${dose[2]}`

  // A bare "g" counts as a strength only for solid oral forms; for creams/liquids it
  // is content and is intentionally dropped.
  if (SOLID_DOSE_PRESENTATIONS.has(presentation)) {
    const g = s.match(/(\d+(?:[.,]\d+)?)\s*g\b/)
    if (g) return `${g[1].replace(',', '.')}g`
  }

  return ''
}

// Content-volume forms (liquids, creams, gels, ointments): the ml/g figure is the
// net content of a single container, not a unit count. Re-exported from the shared
// units module so the scrapers, cards and filters can never drift apart.
export const LIQUID_PRESENTATIONS = VOLUME_PRESENTATIONS

/**
 * Rigorous pack-quantity extractor shared across all pharmacy scrapers.
 *
 * Handles the most common Colombian pharmacy name patterns:
 *   - "X 10 TABLETAS"                   → 10
 *   - "CAJA X 30"                        → 30
 *   - "CAJA X 1 BLISTER X 10 TABLETAS"  → 10  (caja=1 skipped, blister wins)
 *   - "2 BLISTER X 10"                  → 20  (multiplied)
 *   - "JARABE 120ML"                     → 120 (liquid volume)
 *   - "AEROSOL 200 DOSIS"               → 200
 *
 * Never mistakes concentrations ("400MG", "250MG/5ML") for quantities.
 */
// Solid unit words, including the abbreviations Colombian pharmacies use
// ("tab", "cap", "comp", "und"). Used by both the "x N <unit>" and "N <unit>"
// patterns below so e.g. "30 COMP" and "15 CAP" are not lost.
const SOLID_UNIT = '(?:tabletas?|tabs?|capsulas?|caps?|comprimidos?|comps?|pastillas?|grageas?|gelcaps?|unds?)'

export function extractPackQuantity(name: string, presentation: string): number {
  const s = name.toLowerCase()

  // ── SPRAY / AEROSOL: dose (puff) count ───────────────────────────────────
  // Checked BEFORE liquids: 'Spray' is also in LIQUID_PRESENTATIONS, and the
  // actuation count ("200 dosis") is the real pack size, not any ml of solution.
  if (presentation === 'Spray') {
    const doses = s.match(/(\d+)\s*dosis/)
    if (doses) return parseInt(doses[1])
  }

  // ── LIQUIDS: extract total volume ────────────────────────────────────────
  if (LIQUID_PRESENTATIONS.has(presentation)) {
    // Avoid matching concentrations like "250mg/5ml" — require no preceding /
    const ml = s.match(/(?:^|[^/\d])(\d+(?:[.,]\d+)?)\s*ml\b/)
    if (ml) return Math.round(parseFloat(ml[1].replace(',', '.')))
    // Onzas: many syrups/lotions are sold "por onzas" (e.g. "JARABE X 4 ONZAS").
    // An onza is a VOLUME, never a unit count — convert it to ml (1 onza = 30 ml)
    // so it lives on the same ml scale as the rest and is priced per ml.
    const oz = s.match(/(?:^|[^/\d])(\d+(?:[.,]\d+)?)\s*(?:onzas?|onz|oz)\b/)
    if (oz) return Math.round(parseFloat(oz[1].replace(',', '.')) * ML_PER_ONZA)
    const g = s.match(/(?:^|[^/\d])(\d+(?:[.,]\d+)?)\s*g\b(?!\s*\/)/)
    if (g) return Math.round(parseFloat(g[1].replace(',', '.')))
    return 1
  }

  // ── SOLIDS ───────────────────────────────────────────────────────────────

  // "N BLISTER(S) X M" → N × M   e.g. "2 blister x 10" → 20
  const blisterMul = s.match(/(\d+)\s*blisters?\s*(?:[x×]|de)\s*(\d+)/)
  if (blisterMul) return parseInt(blisterMul[1]) * parseInt(blisterMul[2])

  // "X N TABLETAS / CAPSULAS / COMPRIMIDOS / …" — explicit solid unit, most reliable
  const xSolid = s.match(new RegExp(`[x×]\\s*(\\d+)\\s*${SOLID_UNIT}\\b`))
  if (xSolid) return parseInt(xSolid[1])

  // "N TABLETAS / CAPSULAS" without x prefix  e.g. "30 tabletas", "30 comp"
  const nSolid = s.match(new RegExp(`\\b(\\d+)\\s*${SOLID_UNIT}\\b`))
  if (nSolid) {
    const n = parseInt(nSolid[1])
    if (n >= 2 && n <= 1000) return n
  }

  // "CAJA X N" or "BLISTER X N" — skip N=1 (means "1 caja", content still unknown)
  // Also skip when the next word is another container ("blister", "frasco", "vial")
  const cajaX = s.match(/(?:caja|blister|sobre)\s*[x×]\s*(\d+)(?!\s*(?:blisters?|frasco|vial|ampolla))/)
  if (cajaX) {
    const n = parseInt(cajaX[1])
    if (n > 1 && n <= 1000) return n
  }

  // Generic "X N" — guard: N must NOT be followed by a concentration unit.
  // (?!\d) forbids matching a partial number (so "500" can't backtrack to "50"),
  // and \s* lives inside the unit lookahead so "x 500 mg" is rejected entirely.
  const xN = s.match(/[x×]\s*(\d+)(?!\d)(?!\s*(?:mg|g|ml|mcg|ui|ug|%|mm|cm)\b)/)
  if (xN) {
    const n = parseInt(xN[1])
    if (n >= 2 && n <= 500) return n
  }

  return 1
}

export function extractPresentation(name: string): string {
  // Normalize: remove accents, lowercase
  const s = name.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '')
  // Order matters — more specific first
  const forms: [string[], string][] = [
    [['jeringa', 'jeringas', 'pluma', 'pen '],         'Jeringa'],
    [['inyectable', 'inyeccion', 'ampolla', 'vial'],   'Inyectable'],
    [['jarabe', 'suspension', 'suspencion'],            'Jarabe'],
    [['solucion', 'solucion oral'],                    'Solucion'],
    [['locion', 'emulsion'],                            'Locion'],
    [['capsula', 'capsulas', 'encapsulado'],            'Capsula'],
    [['tableta', 'tabletas', 'comprimido', 'tab ', 'pastilla', 'pastillas', 'gragea', 'grageas'], 'Tableta'],
    [['crema'],                                         'Crema'],
    [['pomada', 'unguento'],                            'Pomada'],
    [['gel'],                                           'Gel'],
    [['spray', 'aerosol', 'inhalador'],                 'Spray'],
    [['gotas', 'drops'],                                'Gotas'],
    [['polvo'],                                         'Polvo'],
    [['supositorio'],                                   'Supositorio'],
    [['parche'],                                        'Parche'],
    [['ovulo'],                                         'Ovulo'],
    [['refrigerado', 'refrigerar'],                     'Refrigerado'],
  ]
  for (const [keywords, label] of forms) {
    if (keywords.some(k => s.includes(k))) return label
  }
  return ''
}

// ── Generic vs brand classification ──────────────────────────────────────────
// Robust and data-driven. Combines several signals in priority order: explicit
// pharmacy flag, the feed's brand field, known generic laboratories, known
// commercial brands, and whether the product name starts with an international
// active-ingredient name (INN). Generics are marketed under their INN
// ("ACETAMINOFEN 500MG"); brands lead with a commercial word ("DOLEX 500MG").

// Colombian laboratories that make generics/EQ. Their presence (in the product
// name or the feed's brand field) marks the product as generic.
const GENERIC_LABS = [
  'genfar', 'mk', 'la sante', 'lasante', 'laproff', 'laprof', 'procaps', 'chalver',
  'bussie', 'coaspharma', 'tecnoquimicas', 'laboquimia', 'afidro', 'audifarma',
  'memphis', 'colmed', 'colfarma', 'labder', 'recalcine', 'american generics',
  'americangenerics', 'humax', 'expofarma', 'ropsohn', 'vitalis', 'pharmayect',
  'blaskov', 'siegfried', 'ecar', 'penta', 'closter', 'francol', 'genven',
]

// Whole-word matcher for a list of terms (accent-insensitive). Longer terms first
// so multi-word entries ("la sante") win over any shorter overlap.
function wordListRegex(terms: string[]): RegExp {
  const alternatives = terms
    .map((t) => normalize(t).trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`\\b(?:${alternatives.join('|')})\\b`)
}

const GENERIC_LAB_RE = wordListRegex(GENERIC_LABS)
const BRAND_RE       = wordListRegex(POPULAR_BRANDS)
const INN_SORTED     = [...ACTIVE_INGREDIENTS].map((s) => normalize(s)).sort((a, b) => b.length - a.length)

// True when the product name begins with a known active ingredient (INN), i.e. it
// is sold under its international (generic) name rather than a commercial brand.
function startsWithIngredient(n: string): boolean {
  return INN_SORTED.some((ing) => n === ing || n.startsWith(`${ing} `))
}

export interface ClassifyInput {
  name: string
  /** Pharmacy feed explicitly says it is generic (most reliable when present). */
  isGeneric?: boolean
  /** Brand / manufacturer field from the feed, if any. */
  brand?: string
}

export function classify(input: ClassifyInput): 'generic' | 'brand' {
  const { name, isGeneric } = input
  const n = normalize(name)
  const brand = input.brand ? normalize(input.brand) : ''

  // A registered-trademark mark denotes a commercial brand.
  if (/[®™]/.test(name)) return 'brand'

  // Explicit generic flag from the pharmacy feed — trust it first.
  if (isGeneric) return 'generic'

  // Brand field points to a generic lab (or literally says "generico").
  if (brand && (brand === 'generico' || GENERIC_LAB_RE.test(brand))) return 'generic'

  // A known commercial brand name in the product name → marca.
  if (BRAND_RE.test(n)) return 'brand'

  // A generic laboratory named in the product name → generico.
  if (GENERIC_LAB_RE.test(n)) return 'generic'

  // The name literally says "generico".
  if (/\bgeneric[oa]s?\b/.test(n)) return 'generic'

  // The name starts with an international active-ingredient name → generico.
  if (startsWithIngredient(n)) return 'generic'

  // Nothing matched: default to brand (conservative, as before).
  return 'brand'
}
