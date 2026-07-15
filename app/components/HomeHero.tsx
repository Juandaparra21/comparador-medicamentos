'use client'

import { useLang } from '@/app/i18n/LanguageProvider'

export function HomeHeroText() {
  const { t } = useLang()
  return (
    <div className="text-center mb-8 sm:mb-10">
      {/* h1 se mantiene para SEO pero visualmente lo reemplaza la foto */}
      <h1 className="sr-only">
        {t('home.heroLead')}
        {t('home.heroKeyword')}
        {t('home.heroTail')}
      </h1>
      <div className="glass-card mx-auto mb-5 sm:mb-6 max-w-2xl overflow-hidden rounded-[24px] sm:rounded-[28px] p-1.5 sm:p-2">
        <img
          className="block w-full h-auto rounded-[18px] sm:rounded-[22px]"
          src="/fotos/comparando-en-farmacia.webp"
          alt="Persona comparando precios de un producto en el estante de una farmacia"
          width={900}
          height={1200}
          loading="eager"
          decoding="async"
        />
      </div>
      <p className="text-[16px] sm:text-[20px] text-[#6e6e73] leading-relaxed max-w-xl mx-auto">
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
