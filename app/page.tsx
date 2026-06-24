import { Suspense } from 'react'
import { SearchBar } from '@/app/components/SearchBar'
import { QuickChips } from '@/app/components/QuickChips'
import { DiscountsSection } from '@/app/components/DiscountsSection'
import { NearbyMapSection } from '@/app/components/NearbyMapSection'
import {
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
      <section className="pt-14 sm:pt-24 pb-10 sm:pb-14">
        <div className="mx-auto px-4 sm:px-5 max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary text-[12px] font-bold px-3 py-1.5 rounded-full mb-5 tracking-wide">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              Genericos &middot; Marcas &middot; Precios reales
            </div>
            <h1 className="text-[26px] sm:text-[36px] font-bold leading-tight tracking-[-0.02em] text-[#1a1b1f] mb-3">
              Compara precios de{' '}
              <span className="text-primary">medicamentos</span>{' '}
              en Colombia
            </h1>
            <p className="text-[15px] sm:text-[17px] text-[#414755] leading-relaxed max-w-lg mx-auto">
              Busca por nombre generico o de marca. Encuentra el mejor precio en Drogas La Rebaja,
              Cruz Verde, Colsubsidio y mas.
            </p>
          </div>

          <SearchBar />
          <QuickChips />
        </div>
      </section>

      {/* Por que FarmiYa */}
      <ValueProps />

      {/* Mapa de farmacias cercanas */}
      <NearbyMapSection />

      {/* Discounts */}
      <Suspense fallback={null}>
        <DiscountsSection />
      </Suspense>

      {/* Contenido informativo */}
      <HowItWorks />
      <PharmacyStrip />
      <GenericVsBrand />
      <HomeFaq />
      <HomeCta />
    </>
  )
}
