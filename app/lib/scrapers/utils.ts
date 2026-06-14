export function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '')
}

export function extractConcentration(name: string): string {
  const m = name.match(/(\d+(?:[.,]\d+)?\s*(?:mg|g|ml|mcg|ui|%|ug))/i)
  return m ? m[1].trim() : ''
}

export function extractPresentation(name: string): string {
  const forms = [
    'tabletas', 'capsulas', 'capsula', 'tableta', 'jarabe', 'suspension',
    'solucion', 'gotas', 'ampolla', 'supositorio', 'crema', 'gel',
    'pomada', 'spray', 'parche', 'polvo', 'inyectable',
  ]
  const lower = name.toLowerCase()
  for (const form of forms) {
    if (lower.includes(form)) return form.charAt(0).toUpperCase() + form.slice(1)
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
