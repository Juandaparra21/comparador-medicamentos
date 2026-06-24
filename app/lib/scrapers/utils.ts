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

export function extractConcentration(name: string): string {
  const m = name.match(/(\d+(?:[.,]\d+)?)\s*(mg|g|ml|mcg|ui|%|ug)/i)
  if (!m) return ''
  const num  = m[1].replace(',', '.')
  const unit = m[2].toLowerCase()
  return `${num}${unit}`
}

export const LIQUID_PRESENTATIONS = new Set([
  'Jarabe', 'Solucion', 'Gotas', 'Suspension', 'Spray',
])

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
export function extractPackQuantity(name: string, presentation: string): number {
  const s = name.toLowerCase()

  // ── LIQUIDS: extract total volume ────────────────────────────────────────
  if (LIQUID_PRESENTATIONS.has(presentation)) {
    // Avoid matching concentrations like "250mg/5ml" — require no preceding /
    const ml = s.match(/(?:^|[^/\d])(\d+(?:[.,]\d+)?)\s*ml\b/)
    if (ml) return Math.round(parseFloat(ml[1].replace(',', '.')))
    const g = s.match(/(?:^|[^/\d])(\d+(?:[.,]\d+)?)\s*g\b(?!\s*\/)/)
    if (g) return Math.round(parseFloat(g[1].replace(',', '.')))
    return 1
  }

  // ── SPRAY / AEROSOL: dose count ──────────────────────────────────────────
  if (presentation === 'Spray') {
    const doses = s.match(/(\d+)\s*dosis/)
    if (doses) return parseInt(doses[1])
  }

  // ── SOLIDS ───────────────────────────────────────────────────────────────

  // "N BLISTER(S) X M" → N × M   e.g. "2 blister x 10" → 20
  const blisterMul = s.match(/(\d+)\s*blisters?\s*(?:[x×]|de)\s*(\d+)/)
  if (blisterMul) return parseInt(blisterMul[1]) * parseInt(blisterMul[2])

  // "X N TABLETAS / CAPSULAS / COMPRIMIDOS / …" — explicit solid unit, most reliable
  const xSolid = s.match(/[x×]\s*(\d+)\s*(?:tabletas?|capsulas?|comprimidos?|pastillas?|grageas?|gelcaps?)\b/)
  if (xSolid) return parseInt(xSolid[1])

  // "N TABLETAS / CAPSULAS" without x prefix  e.g. "30 tabletas"
  const nSolid = s.match(/\b(\d+)\s*(?:tabletas?|capsulas?|comprimidos?|pastillas?|grageas?)\b/)
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

const GENERIC_HINTS = [
  'genfar', ' mk', 'laproff', 'procaps', 'chalver',
  'bussie', 'coaspharma', 'tecnoquimicas', 'laboquimia', 'afidro', 'audifarma',
  'memphis', 'colmed', 'colfarma', 'labder', 'recalcine',
]

export function classify(isGeneric: boolean, name: string): 'generic' | 'brand' {
  if (isGeneric) return 'generic'
  const lower = name.toLowerCase()
  for (const hint of GENERIC_HINTS) {
    if (lower.includes(hint)) return 'generic'
  }
  return 'brand'
}
