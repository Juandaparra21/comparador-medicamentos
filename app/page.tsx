import { Suspense } from 'react'
import { SearchBar } from '@/app/components/SearchBar'
import { QuickChips } from '@/app/components/QuickChips'
import { DiscountsSection } from '@/app/components/DiscountsSection'
import { NearbyMapSection } from '@/app/components/NearbyMapSection'
import { Reveal } from '@/app/components/Reveal'
import {
  TrustStrip,
  ValueProps,
  HowItWorks,
  PharmacyStrip,
  GenericVsBrand,
  HomeFaq,
  HomeCta,
} from '@/app/components/HomeSections'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-24 sm:pt-44 pb-20 sm:pb-32">
        {/* Calm breathing glow — a single, very slow ambient pulse */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
          <div
            className="animate-breathe mt-[-6%] h-[440px] w-[680px] sm:h-[620px] sm:w-[960px] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(0,88,188,0.12), rgba(0,110,40,0.06) 55%, transparent 76%)' }}
          />
        </div>
        <div className="mx-auto px-4 sm:px-5 max-w-3xl">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-black/[0.04] border border-black/[0.06] text-[#6e6e73] text-[12px] font-semibold px-3.5 py-1.5 rounded-full mb-6 tracking-wide">
              <svg className="w-3.5 h-3.5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              Genericos &middot; Marcas &middot; Precios reales
            </div>
            <h1 className="text-[36px] sm:text-[60px] font-bold leading-[1.04] tracking-[-0.03em] text-[#1d1d1f] mb-4 sm:mb-5">
              El mejor precio de tus{' '}
              <span className="text-primary">medicamentos</span>
            </h1>
            <p className="text-[17px] sm:text-[22px] text-[#6e6e73] leading-relaxed max-w-xl mx-auto">
              Busca por nombre generico o de marca y compara, en segundos, las
              principales farmacias de Colombia.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <SearchBar />
            <QuickChips />
            <TrustStrip />
          </div>
        </div>
      </section>

      <Reveal><ValueProps /></Reveal>
      <Reveal><NearbyMapSection /></Reveal>

      <Suspense fallback={null}>
        <Reveal><DiscountsSection /></Reveal>
      </Suspense>

      <Reveal><HowItWorks /></Reveal>
      <Reveal><PharmacyStrip /></Reveal>
      <Reveal><GenericVsBrand /></Reveal>
      <Reveal><HomeFaq /></Reveal>
      <Reveal><HomeCta /></Reveal>
    </>
  )
}
