'use client'

import { useState, useRef, useEffect } from 'react'
import { useLang } from '@/app/i18n/LanguageProvider'
import { LOCALES, LOCALE_NAMES, LOCALE_FLAGS } from '@/app/i18n/config'
import { ThemeToggle } from '@/app/components/ThemeToggle'

const HINT_KEY = 'farmi_options_hint_seen'

/* Menu de opciones (icono de engranaje) visible para todos los usuarios,
   con o sin sesion: tema claro/noche e idioma. Es el punto de entrada
   para preferencias que no dependen de una cuenta. La primera vez que
   alguien llega muestra una burbuja señalando el engranaje, porque antes
   el idioma tenia su propio boton con bandera y ahora vive aqui adentro. */
export function UserOptionsMenu() {
  const { locale, setLocale, t } = useLang()
  const [open, setOpen] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      if (!localStorage.getItem(HINT_KEY)) setShowHint(true)
    } catch {
      // localStorage puede no estar disponible en navegacion privada
    }
  }, [])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function dismissHint() {
    setShowHint(false)
    try {
      localStorage.setItem(HINT_KEY, '1')
    } catch {
      // localStorage puede no estar disponible en navegacion privada
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((v) => !v); dismissHint() }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('options.title')}
        title={t('options.title')}
        className="relative flex items-center justify-center h-8 w-8 rounded-full bg-white/70 border border-[#e5e7eb] hover:border-primary/40 hover:bg-white transition-colors cursor-pointer shrink-0"
      >
        <svg className="w-[18px] h-[18px] text-[#414755]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {showHint && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary animate-pulse ring-2 ring-white" aria-hidden="true" />
        )}
      </button>

      {showHint && !open && (
        <div
          role="status"
          className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-[#1a1b1f] text-white text-[12px] leading-snug px-3.5 py-3 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <button
            onClick={dismissHint}
            aria-label={t('options.hintClose')}
            className="absolute top-1.5 right-1.5 h-5 w-5 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            ×
          </button>
          <span className="pr-4 block font-medium">{t('options.hint')}</span>
          <span className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 bg-[#1a1b1f]" aria-hidden="true" />
        </div>
      )}

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-60 glass-card-opaque rounded-2xl shadow-[0_12px_32px_rgba(0,88,188,0.14)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-4 py-3 border-b border-[#f0f1f5]">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af] mb-2.5">{t('options.title')}</p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-semibold text-[#414755]">{t('options.appearance')}</span>
              <ThemeToggle />
            </div>
          </div>

          <div className="px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af] mb-2">{t('options.language')}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  role="menuitemradio"
                  aria-checked={l === locale}
                  onClick={() => setLocale(l)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-left text-[12px] transition-colors cursor-pointer ${
                    l === locale ? 'bg-primary/[0.08] text-primary font-bold' : 'text-[#414755] hover:bg-black/[0.03]'
                  }`}
                >
                  <span className="text-[14px] leading-none">{LOCALE_FLAGS[l]}</span>
                  <span className="truncate">{LOCALE_NAMES[l]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
