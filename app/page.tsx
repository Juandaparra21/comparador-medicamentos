import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchBar } from '@/app/components/SearchBar'
import { HomeHeroText, HeroSearchNote } from '@/app/components/HomeHero'
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
  GenericVsBrand,
  AppShowcase,
  CercanasPromo,
  MadeInColombia,
  HomeFaq,
  HomeCta,
} from '@/app/components/HomeSections'
import { PopularMeds } from '@/app/components/PopularMeds'
import { SITE_URL } from '@/app/lib/siteUrl'

// Self-canonical for the homepage so Google fija la raíz como versión oficial.
// URL absoluta con barra final: https://www.farmi.com.co/
export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
}

// La portada se regenera cada hora para que "Descuentos destacados" muestre el
// fondo de ofertas fresco (lo alimentan las búsquedas en vivo y el cron diario).
export const revalidate = 3600

export default function Home() {
  return (
    <>
      {/* Fondo glass de la portada: lavado azul suave + manchas de color fijas
         detras de todo. Son gradientes radiales (baratos de pintar), no filtros
         blur. Solo esta pagina lo monta; el resto del sitio no cambia. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #e8edf9 0%, #eff3fb 45%, #f7f9fd 100%)' }}
        />
        <div
          className="absolute -top-[12%] -left-[18%] h-[420px] w-[420px] sm:h-[640px] sm:w-[640px] rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(0,112,235,0.18), transparent 70%)' }}
        />
        <div
          className="absolute top-[4%] -right-[22%] h-[380px] w-[380px] sm:h-[580px] sm:w-[580px] rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(102,100,228,0.16), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-[12%] left-[8%] h-[380px] w-[380px] sm:h-[600px] sm:w-[600px] rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(111,251,133,0.12), transparent 70%)' }}
        />
      </div>

      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-10 sm:pt-20 pb-20 sm:pb-32">
        {/* Calm breathing glow — a single, very slow ambient pulse */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
          <div
            className="animate-breathe mt-[-6%] h-[440px] w-[680px] sm:h-[620px] sm:w-[960px] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(0,88,188,0.12), rgba(0,110,40,0.06) 55%, transparent 76%)' }}
          />
        </div>

        {/* Adornos flotantes de vidrio, como en el diseño de referencia.
           Decorativos, solo en escritorio y detras del contenido (-z). */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5] hidden lg:block">
          <div className="glass-card animate-floaty absolute left-[7%] top-[24%] flex h-14 w-14 items-center justify-center rounded-full">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="7" width="14" height="6" rx="3" />
              <line x1="10" y1="7" x2="10" y2="13" />
            </svg>
          </div>
          <div className="glass-card animate-floaty absolute right-[8%] top-[18%] flex h-12 w-12 items-center justify-center rounded-full" style={{ animationDelay: '-2s' }}>
            <svg className="w-5 h-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="glass-card animate-floaty absolute left-[9%] bottom-[26%] flex h-12 w-12 items-center justify-center rounded-full" style={{ animationDelay: '-1.2s' }}>
            <svg className="w-5 h-5 text-tertiary" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.012C4.045 12.455 2 9.93 2 6.5a4.5 4.5 0 018-2.826A4.5 4.5 0 0118 6.5c0 3.43-2.045 5.955-3.885 7.708a22.049 22.049 0 01-3.744 2.694l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
            </svg>
          </div>
          <div className="glass-card animate-floaty absolute right-[6%] bottom-[22%] flex items-center gap-2 rounded-full px-4 py-2.5" style={{ animationDelay: '-3.5s' }}>
            <svg className="w-4 h-4 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 5L5 19" />
              <circle cx="6.5" cy="6.5" r="2.5" />
              <circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
            <span className="text-[12px] font-bold text-[#414755] whitespace-nowrap">6 farmacias en una búsqueda</span>
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-5 max-w-3xl">
          <HomeHeroText />

          <div className="max-w-2xl mx-auto">
            {/* Panel de vidrio del hero: agrupa buscador, logos y chips,
               como la "ventana" central del diseño de referencia. */}
            <div className="glass-card rounded-[28px] sm:rounded-[32px] p-4 sm:p-7 pb-6 sm:pb-8">
              <SearchBar />
              <HeroSearchNote />
              <HeroPharmacies />
              <QuickChips />
            </div>
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
      <Reveal><CercanasPromo /></Reveal>
      <Reveal><GenericVsBrand /></Reveal>
      <Reveal><MadeInColombia /></Reveal>
      <Reveal><HomeFaq /></Reveal>
      <Reveal><HomeCta /></Reveal>
    </>
  )
}
