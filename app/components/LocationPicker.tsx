'use client'

import { useState } from 'react'
import { detectBrowserLocation, type DetectedLocation } from '@/app/utils/location'

export function LocationPicker() {
  const [state, setState] = useState<'idle' | 'detecting' | 'detected' | 'error'>('idle')
  const [location, setLocation] = useState<DetectedLocation | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function detect() {
    setState('detecting')
    try {
      const loc = await detectBrowserLocation()
      setLocation(loc)
      setState('detected')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Error al detectar ubicación')
      setState('error')
    }
  }

  function reset() {
    setState('idle')
    setLocation(null)
    setErrorMsg('')
  }

  if (state === 'detected' && location) {
    return (
      <div className="mx-auto px-4 sm:px-5 max-w-5xl mb-6">
        <div className="flex items-center gap-2.5 bg-secondary/8 border border-secondary/20 rounded-xl px-4 py-3">
          <div className="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-secondary leading-none">
              Mostrando farmacias en {location.city}
            </p>
            <p className="text-[11px] text-secondary/70 mt-0.5">
              Ubicación detectada automáticamente
            </p>
          </div>
          <button
            onClick={reset}
            className="text-[12px] font-semibold text-secondary/60 hover:text-secondary transition-colors cursor-pointer whitespace-nowrap"
          >
            Cambiar &times;
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 sm:px-5 max-w-5xl mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/60 backdrop-blur-[20px] border border-white/50 rounded-xl px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#1a1b1f]">
              Encuentra farmacias cerca de ti
            </p>
            <p className="text-[12px] text-[#717786] mt-0.5">
              {state === 'error' ? errorMsg : 'Usa tu ubicación para ver las más cercanas'}
            </p>
          </div>
        </div>
        <button
          onClick={detect}
          disabled={state === 'detecting'}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
        >
          {state === 'detecting' ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Detectando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
              Detectar ubicación
            </>
          )}
        </button>
      </div>
    </div>
  )
}
