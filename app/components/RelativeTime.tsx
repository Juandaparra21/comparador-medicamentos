'use client'

import { useEffect, useState } from 'react'
import { formatRelativeShort } from '@/app/utils/format'
import { useLang } from '@/app/i18n/LanguageProvider'

interface Props {
  /** ISO timestamp of when the data was fetched */
  iso: string
  /** Text before the relative time, e.g. "Actualizado" */
  prefix?: string
  className?: string
}

// Shows "Actualizado hace X" and refreshes itself every 60s so the relative
// time stays accurate while the user keeps the page open. Uses the real fetch
// timestamp passed in iso (never a fixed value).
export function RelativeTime({ iso, prefix, className }: Props) {
  const { locale, t } = useLang()
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  // The prefix arrives in Spanish ("Actualizado"); resolve it through the
  // dictionary so the whole line follows the selected language.
  if (prefix === 'Actualizado') prefix = t('results.updated')
  const rel = formatRelativeShort(iso, locale)
  if (!rel) return null

  return (
    <span className={className} suppressHydrationWarning>
      {prefix ? `${prefix} ${rel}` : rel}
    </span>
  )
}
