import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchBar } from '@/app/components/SearchBar'
import { QuickChips } from '@/app/components/QuickChips'
import { DiscountsSection } from '@/app/components/DiscountsSection'
import { NearbyMapSection } from '@/app/components/NearbyMapSection'
import { Reveal } from '@/app/components/Reveal'
import { HeroStats } from '@/app/components/HeroStats'
import { HomeBanner } from '@/app/components/HomeBanner'
import {
  TrustStrip,
  HeroPharmacies,
  ValueProps,
  HowItWorks,
  PharmacyStrip,
  PopularMeds,
  GenericVsBrand,
  AppShowcase,
  MadeInColombia,
  HomeFaq,
  HomeCta,
} from '@/app/components/HomeSections'
import { SITE_URL } from '@/app/lib/siteUrl'

// Self-canonical for the homepage so Google fija la raíz como versión oficial.
// URL absoluta con barra final: https://www.farmi.com.co/
export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-10 sm:pt-20 pb-20 sm:pb-32">
        {/* Calm breathing glow — a single, very slow ambient pulse */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
          <div
            className="animate-breathe mt-[-6%] h-[440px] w-[680px] sm:h-[620px] sm:w-[960px] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(0,88,188,0.12), rgba(0,110,40,0.06) 55%, transparent 76%)' }}
          />
        </div>
        <div className="mx-auto px-4 sm:px-5 max-w-3xl">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-[36px] sm:text-[60px] font-bold leading-[1.04] tracking-[-0.03em] text-[#1d1d1f] mb-4 sm:mb-5">
              Compara precios de{' '}
              <span className="text-primary">medicamentos</span> en Colombia
            </h1>
            <p className="text-[17px] sm:text-[22px] text-[#6e6e73] leading-relaxed max-w-xl mx-auto">
              Busca por nombre genérico o de marca y encuentra, en segundos, el mejor
              precio entre las principales farmacias de Colombia.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <SearchBar />
            <p className="mt-3 text-center text-[12px] sm:text-[13px] text-[#6e6e73]">
              Precios consultados en el momento de tu búsqueda.
            </p>
            <HeroPharmacies />
            <QuickChips />
            <TrustStrip />
            <HeroStats />
          </div>
        </div>
      </section>

      {/* Banner promocional (se oculta solo si aún no está la imagen) */}
      <Reveal><HomeBanner /></Reveal>

      <Reveal><ValueProps /></Reveal>
      <Reveal><NearbyMapSection /></Reveal>

      <Suspense fallback={null}>
        <Reveal><DiscountsSection /></Reveal>
      </Suspense>

      <Reveal><HowItWorks /></Reveal>
      <Reveal><AppShowcase /></Reveal>
      <Reveal><PharmacyStrip /></Reveal>
      <Reveal><PopularMeds /></Reveal>
      <Reveal><GenericVsBrand /></Reveal>
      <Reveal><MadeInColombia /></Reveal>
      <Reveal><HomeFaq /></Reveal>
      <Reveal><HomeCta /></Reveal>
    </>
  )
}
