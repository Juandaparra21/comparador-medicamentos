export function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '')
}

export function extractConcentration(name: string): string {
  const m = name.match(/(\d+(?:[.,]\d+)?)\s*(mg|g|ml|mcg|ui|%|ug)/i)
  if (!m) return ''
  const num  = m[1].replace(',', '.')
  const unit = m[2].toLowerCase()
  return `${num}${unit}`
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
    [['tableta', 'tabletas', 'comprimido', 'tab '],    'Tableta'],
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
]

export function classify(isGeneric: boolean, name: string): 'generic' | 'brand' {
  if (isGeneric) return 'generic'
  const lower = name.toLowerCase()
  for (const hint of GENERIC_HINTS) {
    if (lower.includes(hint)) return 'generic'
  }
  return 'brand'
}
