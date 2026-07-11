// Supported languages for Farmi's UI. Spanish (Colombia) is the default and the
// SEO/canonical language; the rest are client-side translations.
export const LOCALES = ['es', 'en', 'fr', 'it', 'de', 'pt'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'es'

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  pt: 'Português',
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  fr: '🇫🇷',
  it: '🇮🇹',
  de: '🇩🇪',
  pt: '🇵🇹',
}

export const STORAGE_KEY = 'farmi_lang'

// Map a raw navigator language tag ("en-US", "pt-BR") to one of our locales.
export function resolveLocale(raw: string | undefined | null): Locale {
  if (!raw) return DEFAULT_LOCALE
  const base = raw.toLowerCase().split('-')[0]
  return (LOCALES as readonly string[]).includes(base) ? (base as Locale) : DEFAULT_LOCALE
}
