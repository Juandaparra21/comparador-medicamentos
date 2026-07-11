'use client'

import { useState, useRef, useEffect } from 'react'
import { useLang } from '@/app/i18n/LanguageProvider'
import { LOCALES, LOCALE_NAMES, LOCALE_FLAGS } from '@/app/i18n/config'

export function LanguageSwitcher({
  dropDirection = 'up',
  compact = false,
}: {
  dropDirection?: 'up' | 'down'
  compact?: boolean
}) {
  const { locale, setLocale, t } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('footer.language')}
        className={`flex items-center gap-1.5 rounded-xl bg-white/70 border border-[#c1c6d7]/50 text-[13px] font-semibold text-[#414755] hover:bg-white transition-colors cursor-pointer shrink-0 ${
          compact ? 'px-2 py-1.5' : 'px-3 py-2 gap-2'
        }`}
      >
        <span className={compact ? 'text-[16px] leading-none' : ''}>{LOCALE_FLAGS[locale]}</span>
        {!compact && <span>{LOCALE_NAMES[locale]}</span>}
        <svg className={`w-3.5 h-3.5 text-[#9ca3af] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute right-0 w-44 glass-card-opaque rounded-xl shadow-[0_12px_32px_rgba(0,88,188,0.14)] overflow-hidden z-50 py-1 ${
            dropDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                role="option"
                aria-selected={l === locale}
                onClick={() => { setLocale(l); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[13px] transition-colors cursor-pointer ${
                  l === locale ? 'bg-primary/[0.06] text-primary font-bold' : 'text-[#414755] hover:bg-black/[0.03]'
                }`}
              >
                <span className="text-[15px]">{LOCALE_FLAGS[l]}</span>
                {LOCALE_NAMES[l]}
                {l === locale && (
                  <svg className="w-4 h-4 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 5.29a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06l2.97 2.97 6.97-6.97a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
