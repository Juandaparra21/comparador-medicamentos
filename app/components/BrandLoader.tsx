'use client'

interface Props {
  /** Optional caption under the logo (e.g. "Buscando precios...") */
  label?: string
  /** Size in px of the animated logo */
  size?: number
  className?: string
}

/**
 * Looping Farmi logo animation used as the loading indicator across the app.
 * Autoplays muted and inline so it works on mobile without user interaction.
 */
export function BrandLoader({ label, size = 84, className = '' }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-[#717786] ${className}`}>
      <video
        src="/fotos/farmi-logo-loader.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="object-contain"
      />
      {label && <p className="text-[14px]">{label}</p>}
    </div>
  )
}
