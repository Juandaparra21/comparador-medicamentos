'use client'

import Link from 'next/link'
import { useLang } from '@/app/i18n/LanguageProvider'

export interface PopularMed {
  slug: string
  activeIngredient: string
  therapeuticClass: string
}

const CARD = 'glass-card rounded-3xl'

// Client list so the section heading and CTA translate. The medication data is
// computed server-side (see PopularMeds) and passed in, so the SEO catalog is not
// bundled into the client.
export function PopularMedsList({ meds }: { meds: PopularMed[] }) {
  const { t } = useLang()
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <div className="mb-10 sm:mb-14 text-center">
        <h2 className="text-[26px] sm:text-[36px] font-bold tracking-[-0.02em] text-[#1d1d1f] leading-tight">{t('popular.title')}</h2>
        <p className="text-[15px] sm:text-[18px] text-[#6e6e73] mt-2.5 max-w-2xl mx-auto leading-relaxed">{t('popular.subtitle')}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {meds.map((m) => (
          <Link
            key={m.slug}
            href={`/precio/${m.slug}`}
            className={`${CARD} p-4 flex flex-col gap-1 hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(0,88,188,0.08)] transition-all`}
          >
            <span className="text-[14px] font-bold text-[#1d1d1f] leading-snug">{m.activeIngredient}</span>
            <span className="text-[11px] text-[#6e6e73] leading-snug">{m.therapeuticClass}</span>
            <span className="mt-1 text-[12px] font-semibold text-primary">{t('popular.cta')} &rarr;</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
