'use client'

import { useLang } from '@/app/i18n/LanguageProvider'

export function HomeHeroText() {
  const { t } = useLang()
  return (
    <div className="text-center mb-12 sm:mb-16">
      <h1 className="text-[36px] sm:text-[60px] font-bold leading-[1.04] tracking-[-0.03em] text-[#1d1d1f] mb-4 sm:mb-5">
        {t('home.heroLead')}
        <span className="text-primary">{t('home.heroKeyword')}</span>
        {t('home.heroTail')}
      </h1>
      <p className="text-[17px] sm:text-[22px] text-[#6e6e73] leading-relaxed max-w-xl mx-auto">
        {t('home.heroSubtitle')}
      </p>
    </div>
  )
}

export function HeroSearchNote() {
  const { t } = useLang()
  return (
    <p className="mt-3 text-center text-[12px] sm:text-[13px] text-[#6e6e73]">
      {t('home.searchNote')}
    </p>
  )
}
