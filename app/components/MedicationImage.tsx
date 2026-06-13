import { useId } from 'react'

interface Theme {
  bg: string
  bgAccent: string
  cap1: string
  cap2: string
  label: string
}

const THEMES: Record<string, Theme> = {
  'Acetaminofén': { bg: '#fffbeb', bgAccent: '#fef3c7', cap1: '#f59e0b', cap2: '#fde68a', label: '#92400e' },
  'Ibuprofeno':   { bg: '#eff6ff', bgAccent: '#dbeafe', cap1: '#3b82f6', cap2: '#93c5fd', label: '#1e40af' },
  'Losartán':     { bg: '#f5f3ff', bgAccent: '#ede9fe', cap1: '#8b5cf6', cap2: '#c4b5fd', label: '#4c1d95' },
  'Metformina':   { bg: '#ecfdf5', bgAccent: '#d1fae5', cap1: '#10b981', cap2: '#6ee7b7', label: '#065f46' },
}

const DEFAULT_THEME: Theme = {
  bg: '#f8fafc', bgAccent: '#e2e8f0', cap1: '#64748b', cap2: '#cbd5e1', label: '#334155',
}

interface Props {
  ingredient: string
  height?: number
}

export function MedicationImage({ ingredient, height = 88 }: Props) {
  const uid = useId().replace(/:/g, '')
  const t = THEMES[ingredient] ?? DEFAULT_THEME

  return (
    <div
      style={{ height, background: `linear-gradient(135deg, ${t.bg} 0%, ${t.bgAccent} 100%)` }}
      className="w-full relative overflow-hidden flex items-center justify-center rounded-t-xl"
    >
      {/* Subtle dots pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`dots-${uid}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.5" fill={t.cap1} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${uid})`} />
      </svg>

      {/* Capsule illustration */}
      <svg
        viewBox="0 0 120 48"
        style={{ width: 120, height: 48, transform: 'rotate(-12deg)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <clipPath id={`left-${uid}`}>
            <rect x="0" y="0" width="60" height="48" />
          </clipPath>
          <clipPath id={`right-${uid}`}>
            <rect x="60" y="0" width="60" height="48" />
          </clipPath>
          <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="60%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left half */}
        <rect x="0" y="0" width="120" height="48" rx="24" fill={t.cap1} clipPath={`url(#left-${uid})`} />
        {/* Right half */}
        <rect x="0" y="0" width="120" height="48" rx="24" fill={t.cap2} clipPath={`url(#right-${uid})`} />
        {/* Center seam */}
        <line x1="60" y1="4" x2="60" y2="44" stroke="white" strokeWidth="2" opacity="0.5" />
        {/* Shine */}
        <rect x="0" y="0" width="120" height="48" rx="24" fill={`url(#shine-${uid})`} />
        {/* Outline */}
        <rect x="1" y="1" width="118" height="46" rx="23" stroke="white" strokeWidth="1.5" opacity="0.3" />
      </svg>

      {/* Label */}
      <span
        style={{ color: t.label, backgroundColor: `${t.cap1}18`, border: `1px solid ${t.cap1}30` }}
        className="absolute bottom-2 right-3 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full"
      >
        {ingredient}
      </span>
    </div>
  )
}
