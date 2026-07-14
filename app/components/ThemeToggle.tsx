'use client'

import { useState, useEffect } from 'react'
import { getEffectiveDark, hasManualTheme, setManualTheme, THEME_EVENT } from '@/app/lib/theme'

/* Deslizador claro/noche. El tema vive como data-theme="dark" en <html>:
   lo pone antes del primer pintado el script inline del layout, siguiendo
   el tema del sistema operativo si el usuario no eligio uno a mano. Aqui
   solo se lee el estado inicial, se sigue el cambio de sistema en vivo
   (mientras no haya eleccion manual) y se permite forzar un tema. */
export function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setDark(getEffectiveDark())
    setMounted(true)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    function onSystemChange(e: MediaQueryListEvent) {
      if (!hasManualTheme()) setDark(e.matches)
    }
    function onManualChange(e: Event) {
      setDark((e as CustomEvent<{ dark: boolean }>).detail.dark)
    }
    media.addEventListener('change', onSystemChange)
    window.addEventListener(THEME_EVENT, onManualChange)
    return () => {
      media.removeEventListener('change', onSystemChange)
      window.removeEventListener(THEME_EVENT, onManualChange)
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    setManualTheme(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo noche'}
      onClick={toggle}
      className="switch-glass relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors cursor-pointer"
    >
      {/* Perilla deslizante con el icono del modo actual */}
      <span
        className={`switch-glass-knob absolute top-[2px] left-[2px] flex h-[20px] w-[20px] items-center justify-center rounded-full transition-transform duration-200 ${
          mounted && dark ? 'translate-x-[20px] bg-[#1b2145] text-[#ffd76a]' : 'translate-x-0 bg-white text-[#f59e0b]'
        }`}
      >
        {mounted && dark ? (
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        )}
      </span>
    </button>
  )
}
