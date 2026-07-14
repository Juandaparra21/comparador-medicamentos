interface Config {
  bg: string
  abbr: string
  icon: 'cross' | 'pill' | 'text'
}

const PHARMACY_CONFIG: Record<string, Config> = {
  'Drogas La Rebaja': { bg: '#dc2626', abbr: 'DR', icon: 'pill' },
  'Cruz Verde':       { bg: '#15803d', abbr: 'CV', icon: 'cross' },
  'Drogueria Colsubsidio': { bg: '#1d4ed8', abbr: 'CS', icon: 'text' },
  // La tabla pharmacies de la base usa el nombre corto "Colsubsidio"
  'Colsubsidio':      { bg: '#1d4ed8', abbr: 'CS', icon: 'text' },
  'Cafam':            { bg: '#1e3a8a', abbr: 'CF', icon: 'text' },
  'Farmatodo':        { bg: '#ea580c', abbr: 'FT', icon: 'pill' },
  'Olimpica Drogueria':{ bg: '#6d28d9', abbr: 'OD', icon: 'text' },
  'Farmacia Pasteur': { bg: '#0a4f9e', abbr: 'FP', icon: 'cross' },
  'Farmacenter':      { bg: '#d81e2c', abbr: 'FC', icon: 'text' },
  'Tu Drogueria Virtual': { bg: '#e5195a', abbr: 'TU', icon: 'text' },
}

function CrossSvg({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="white">
      <rect x="8" y="1" width="4" height="18" rx="1.5" />
      <rect x="1" y="8" width="18" height="4" rx="1.5" />
    </svg>
  )
}

function PillSvg({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="9" width="18" height="6" rx="3" fill="white" opacity="0.25" />
      <rect x="3" y="9" width="9" height="6" rx="3" fill="white" opacity="0.65" />
      <rect x="3" y="9" width="18" height="6" rx="3" stroke="white" strokeWidth="1.5" />
      <line x1="12" y1="9" x2="12" y2="15" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

// Real brand logos (in /public/pharmacy-logos). Only pharmacies with a usable
// logo file are listed; the rest fall back to the stylized tile below.
// Logos are property of each pharmacy; shown only to identify whose price it is.
const LOGO_FILES: Record<string, string> = {
  'Drogas La Rebaja':      'la-rebaja.png',
  'Drogueria Colsubsidio': 'colsubsidio.png',
  'Colsubsidio':           'colsubsidio.png',
  'Cafam':                 'cafam.png',
  'Farmatodo':             'farmatodo.png',
  'Olimpica Drogueria':    'olimpica.png',
  'Farmacia Pasteur':      'pasteur.png',
  'Farmacenter':           'farmacenter.png',
  'Tu Drogueria Virtual':  'tudrogueria-virtual.png',
}

interface Props {
  name: string
  size?: number
}

export function PharmacyLogo({ name, size = 36 }: Props) {
  const logoFile = LOGO_FILES[name]
  if (logoFile) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-xl bg-white border border-[#eef0f4] shadow-sm shrink-0 overflow-hidden flex items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/pharmacy-logos/${logoFile}`}
          alt={name}
          width={size}
          height={size}
          className="w-full h-full object-contain p-1"
        />
      </div>
    )
  }

  const config: Config = PHARMACY_CONFIG[name] ?? {
    bg: '#6b7280',
    abbr: name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
    icon: 'text',
  }
  const iconSize = Math.round(size * 0.52)
  const fontSize = Math.round(size * 0.32)

  return (
    <div
      style={{ width: size, height: size, backgroundColor: config.bg }}
      className="rounded-xl flex items-center justify-center shrink-0 shadow-sm"
    >
      {config.icon === 'cross' && <CrossSvg s={iconSize} />}
      {config.icon === 'pill' && <PillSvg s={iconSize} />}
      {config.icon === 'text' && (
        <span style={{ fontSize }} className="font-bold text-white leading-none tracking-tight select-none">
          {config.abbr}
        </span>
      )}
    </div>
  )
}
