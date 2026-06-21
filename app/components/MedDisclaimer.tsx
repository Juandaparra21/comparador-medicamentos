'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'medicompara-disclaimer-v1'

export function MedDisclaimer() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* noop */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="note"
      aria-label="Aviso importante sobre informacion medica"
      className="bg-amber-50 border-b border-amber-200"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-5 py-2.5 flex items-center gap-3">
        <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <p className="text-[12px] text-amber-900 flex-1 leading-snug">
          <strong>Esta plataforma no sustituye la asesoria medica profesional.</strong>{' '}
          Los precios son referenciales y pueden cambiar. MediCompara no vende medicamentos.
        </p>
        <button
          onClick={dismiss}
          aria-label="Cerrar aviso"
          className="shrink-0 text-amber-600 hover:text-amber-800 transition-colors cursor-pointer p-1 rounded"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
