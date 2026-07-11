function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '')
}

interface Theme {
  bg: string
  bgAccent: string
  icon: string
}

const THEMES: Record<string, Theme> = {
  'Acetaminofén': { bg: '#fffbeb', bgAccent: '#fef3c7', icon: '#d97706' },
  'Ibuprofeno':   { bg: '#eff6ff', bgAccent: '#dbeafe', icon: '#2563eb' },
  'Losartán':     { bg: '#f5f3ff', bgAccent: '#ede9fe', icon: '#7c3aed' },
  'Metformina':   { bg: '#ecfdf5', bgAccent: '#d1fae5', icon: '#059669' },
}

const DEFAULT_THEME: Theme = { bg: '#f8fafc', bgAccent: '#eef1f6', icon: '#94a3b8' }

interface Props {
  ingredient: string
  height?: number
}

const THEMES_NORMALIZED: [string, Theme][] = Object.entries(THEMES).map(
  ([k, v]) => [normalize(k), v]
)

// Respaldo cuando no hay foto real del producto: un icono pequeño y neutro,
// no una ilustracion que aparente ser la foto. El nombre del producto ya se
// muestra debajo de la tarjeta, así que aquí no repetimos texto.
export function MedicationImage({ ingredient, height = 88 }: Props) {
  const normIngredient = normalize(ingredient.split(/\s/)[0] ?? '')
  const t = THEMES_NORMALIZED.find(([k]) => k === normIngredient)?.[1] ?? DEFAULT_THEME

  return (
    <div
      style={{ height, background: `linear-gradient(135deg, ${t.bg} 0%, ${t.bgAccent} 100%)` }}
      className="w-full flex items-center justify-center rounded-t-xl"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.5" y="2.5" width="19" height="19" rx="6" stroke={t.icon} strokeWidth="1.6" strokeOpacity="0.55" />
        <path d="M8 12h8M12 8v8" stroke={t.icon} strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.75" />
      </svg>
    </div>
  )
}
