'use client'

import { useState } from 'react'
import { useLang } from '@/app/i18n/LanguageProvider'

interface Props {
  /** the searched term, used to rebuild a shareable results URL */
  query: string
  className?: string
}

// "Compartir esta comparación": builds a link to the same search (/buscar?q=...)
// so whoever opens it lands directly on these results. Uses the native Web Share
// sheet on mobile, falls back to copying the link on desktop.
export function ShareComparison({ query, className }: Props) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = `${window.location.origin}/buscar?q=${encodeURIComponent(query)}`
    const title = `${t('share.titlePrefix')} ${query} ${t('share.titleSuffix')}`

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: title, url })
        return
      } catch {
        // user cancelled the share sheet — do nothing
        return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // last-resort fallback when clipboard is blocked
      window.prompt(t('share.copyPrompt'), url)
    }
  }

  return (
    <button
      onClick={share}
      className={
        className ??
        'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 border border-white/50 text-[13px] font-semibold text-[#414755] hover:bg-white/90 hover:text-primary transition-all cursor-pointer'
      }
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-secondary shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
          Enlace copiado
        </>
      ) : (
        <>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Compartir esta comparación
        </>
      )}
    </button>
  )
}
