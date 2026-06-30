'use client'

import { useEffect, useState } from 'react'
import { formatRelativeShort } from '@/app/utils/format'

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
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const rel = formatRelativeShort(iso)
  if (!rel) return null

  return (
    <span className={className} suppressHydrationWarning>
      {prefix ? `${prefix} ${rel}` : rel}
    </span>
  )
}
