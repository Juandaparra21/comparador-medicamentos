'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { DEFAULT_LOCALE, STORAGE_KEY, resolveLocale, type Locale } from './config'
import { TRANSLATIONS } from './translations'
import { AutomaticTranslator } from './AutomaticTranslator'

interface LangCtx {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const Ctx = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start on the default locale so the server render and the first client
  // render match (no hydration mismatch). Switch to the stored/detected locale
  // right after mount.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    let next: Locale
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    if (stored) {
      next = resolveLocale(stored)
    } else {
      next = resolveLocale(typeof navigator !== 'undefined' ? navigator.language : null)
    }
    setLocaleState(next)
    document.documentElement.lang = next
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try { window.localStorage.setItem(STORAGE_KEY, l) } catch { /* ignore */ }
    document.documentElement.lang = l
  }, [])

  const t = useCallback(
    (key: string) => {
      const entry = TRANSLATIONS[key]
      if (!entry) return key
      return entry[locale] ?? entry[DEFAULT_LOCALE] ?? key
    },
    [locale],
  )

  return <Ctx.Provider value={{ locale, setLocale, t }}><AutomaticTranslator locale={locale} />{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx)
  // Fallback so components can call useLang() even if rendered outside the provider
  // (e.g. isolated tests): returns default-locale strings.
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key: string) => TRANSLATIONS[key]?.[DEFAULT_LOCALE] ?? key,
    }
  }
  return ctx
}
