'use client'

import Link from 'next/link'
import { PharmacyLogo } from './PharmacyLogo'
import { useLang } from '@/app/i18n/LanguageProvider'

/* Home sections. Rendered on the server for the default language (SEO) and
   translated on the client via useLang once a different locale is selected. */

/* Todas las tarjetas de la portada comparten el estilo vidrio (glass-card
   en globals.css): fondo translucido, blur y borde blanco. */
const CARD = 'glass-card rounded-3xl'

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 sm:mb-14 text-center">
      <h2 className="text-[26px] sm:text-[36px] font-bold tracking-[-0.02em] text-[#1d1d1f] leading-tight">{title}</h2>
      {subtitle && <p className="text-[15px] sm:text-[18px] text-[#6e6e73] mt-2.5 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  )
}

/* ── Trust strip (under the hero search) ───────────────────────────── */

const TRUST_KEYS = ['home.trust1', 'home.trust2', 'home.trust3']

export function TrustStrip() {
  const { t } = useLang()
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-semibold text-[#e2e4f3]">
      {TRUST_KEYS.map((key) => (
        <span key={key} className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#6ffb85] shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
          {t(key)}
        </span>
      ))}
    </div>
  )
}

/* ── Why Farmi ─────────────────────────────────────────────────────── */

const VALUES: { titleKey: string; descKey: string; path: string }[] = [
  { titleKey: 'value1.title', descKey: 'value1.desc', path: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
  { titleKey: 'value2.title', descKey: 'value2.desc', path: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
  { titleKey: 'value3.title', descKey: 'value3.desc', path: 'M3.75 21h16.5M4.5 3h15l-.75 4.5h-13.5L4.5 3Zm.75 4.5V21m13.5-13.5V21M9 21v-6h6v6' },
  { titleKey: 'value4.title', descKey: 'value4.desc', path: 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9' },
]

export function ValueProps() {
  const { t } = useLang()
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {VALUES.map((v) => (
          <div key={v.titleKey} className={`${CARD} p-4 sm:p-5`}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={v.path} />
              </svg>
            </div>
            <p className="text-[14px] font-bold text-[#1d1d1f] leading-snug">{t(v.titleKey)}</p>
            <p className="text-[12px] text-[#6e6e73] mt-1 leading-relaxed">{t(v.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── How it works ──────────────────────────────────────────────────── */

const STEPS = [
  { n: 1, titleKey: 'step1.title', descKey: 'step1.desc' },
  { n: 2, titleKey: 'step2.title', descKey: 'step2.desc' },
  { n: 3, titleKey: 'step3.title', descKey: 'step3.desc' },
]

export function HowItWorks() {
  const { t } = useLang()
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <SectionHeading title={t('howItWorks.title')} subtitle={t('howItWorks.subtitle')} />
      <div className={`${CARD} overflow-hidden mb-3 sm:mb-4`}>
        <img
          src="/fotos/tres-pasos.webp"
          alt="Tres celulares mostrando los pasos de Farmi: buscar el medicamento, comparar precios y comprar en la farmacia"
          width={1600}
          height={1067}
          loading="lazy"
          decoding="async"
          className="w-full h-auto"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {STEPS.map((s) => (
          <div key={s.n} className={`${CARD} p-5`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-tertiary text-white flex items-center justify-center font-bold text-[15px] mb-3">
              {s.n}
            </div>
            <p className="text-[15px] font-bold text-[#1d1d1f]">{t(s.titleKey)}</p>
            <p className="text-[13px] text-[#6e6e73] mt-1 leading-relaxed">{t(s.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Pharmacies we compare ─────────────────────────────────────────── */

const PHARMACIES: { key: string; label: string }[] = [
  { key: 'Drogas La Rebaja',      label: 'Drogas La Rebaja' },
  { key: 'Cruz Verde',            label: 'Cruz Verde' },
  { key: 'Drogueria Colsubsidio', label: 'Colsubsidio' },
  { key: 'Farmatodo',             label: 'Farmatodo' },
  { key: 'Cafam',                 label: 'Cafam' },
  { key: 'Olimpica Drogueria',    label: 'Olimpica' },
]

// Compact, above-the-fold logo strip for the hero: shows the real pharmacy logos
// the moment the page loads, so the user sees which sources are compared.
export function HeroPharmacies() {
  const { t } = useLang()
  return (
    <div className="mt-8 sm:mt-9">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-[#aab0cf] mb-3.5">
        {t('heroPharmacies.label')}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-3 gap-y-4 max-w-sm sm:max-w-2xl mx-auto">
        {PHARMACIES.map((p) => (
          <div key={p.key} className="flex flex-col items-center gap-1.5">
            <PharmacyLogo name={p.key} size={46} />
            <span className="text-[10px] sm:text-[11px] font-medium text-[#c7cbe0] text-center leading-tight">
              {p.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PharmacyStrip() {
  const { t } = useLang()
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <SectionHeading title={t('pharmacyStrip.title')} subtitle={t('pharmacyStrip.subtitle')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PHARMACIES.map((p) => (
          <div key={p.key} className={`${CARD} p-4 flex flex-col items-center gap-2 text-center`}>
            <PharmacyLogo name={p.key} size={40} />
            <span className="text-[12px] font-semibold text-[#414755] leading-tight">{p.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[#c1c6d7] mt-3 text-center">
        {t('pharmacyStrip.disclaimer')}
      </p>
    </section>
  )
}

/* ── Generic vs brand ──────────────────────────────────────────────── */

export function GenericVsBrand() {
  const { t } = useLang()
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <SectionHeading title={t('generic.title')} subtitle={t('generic.subtitle')} />
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.3fr] gap-3 sm:gap-4 items-stretch">
        <div className={`${CARD} overflow-hidden max-w-xs mx-auto sm:max-w-none sm:mx-0`}>
          <img
            src="/fotos/comparacion-generico-marca.webp"
            alt="Celular con Farmi comparando acetaminofen genérico y de marca junto a una tableta de pastillas"
            width={900}
            height={1260}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className={`${CARD} p-5 flex-1`}>
            <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 mb-3">
              {t('badge.generic')}
            </span>
            <p className="text-[14px] font-semibold text-[#1d1d1f] mb-1.5">{t('generic.card1Title')}</p>
            <p className="text-[13px] text-[#6e6e73] leading-relaxed">{t('generic.card1Desc')}</p>
          </div>
          <div className={`${CARD} p-5 flex-1`}>
            <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
              {t('badge.brand')}
            </span>
            <p className="text-[14px] font-semibold text-[#1d1d1f] mb-1.5">{t('generic.card2Title')}</p>
            <p className="text-[13px] text-[#6e6e73] leading-relaxed">{t('generic.card2Desc')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── App showcase (real search photos) ─────────────────────────────── */

const SHOWCASE: { src: string; alt: string; label: string; labelKey?: string }[] = [
  { src: '/fotos/busqueda-loratadina.webp',  alt: 'Farmi comparando precios de loratadina 10 mg entre farmacias',        label: 'Loratadina' },
  { src: '/fotos/busqueda-suero.webp',       alt: 'Farmi mostrando el precio de suero rehidratante en varias farmacias', label: 'Suero rehidratante', labelKey: 'showcase.suero' },
  { src: '/fotos/busqueda-vitamina-c.webp',  alt: 'Farmi comparando precios de vitamina C 500 mg',                       label: 'Vitamina C' },
  { src: '/fotos/busqueda-condones.webp',    alt: 'Farmi comparando precios de condones entre farmacias',                label: 'Condones', labelKey: 'showcase.condones' },
]

export function AppShowcase() {
  const { t } = useLang()
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <SectionHeading title={t('showcase.title')} subtitle={t('showcase.subtitle')} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {SHOWCASE.map((s) => (
          <figure key={s.src} className={`${CARD} overflow-hidden`}>
            <img
              src={s.src}
              alt={s.alt}
              width={700}
              height={875}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
            <figcaption className="text-[12px] font-semibold text-[#414755] text-center py-2.5">
              {s.labelKey ? t(s.labelKey) : s.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ── Cercanas promo (lifestyle photo + link to /cercanas) ──────────── */

export function CercanasPromo() {
  const { t } = useLang()
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <div className={`${CARD} overflow-hidden`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch">
          <img
            src="/fotos/farmi-donde-estes.webp"
            alt="Persona caminando por un parque mientras consulta farmacias cercanas en Farmi"
            width={900}
            height={1350}
            loading="lazy"
            decoding="async"
            className="w-full h-[240px] sm:h-full object-cover object-[center_55%]"
          />
          <div className="p-6 sm:p-10 flex flex-col justify-center text-center sm:text-left">
            <h2 className="text-[22px] sm:text-[30px] font-bold tracking-[-0.02em] text-[#1d1d1f] leading-tight">
              {t('cercanasPromo.title')}
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#6e6e73] mt-2.5 leading-relaxed">
              {t('cercanasPromo.desc')}
            </p>
            <div className="mt-5">
              <Link
                href="/cercanas"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                </svg>
                {t('cercanasPromo.cta')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Made in Colombia (brand strip) ────────────────────────────────── */

export function MadeInColombia() {
  const { t } = useLang()
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <div className={`${CARD} p-5 sm:p-8`}>
        <div className="grid grid-cols-2 sm:grid-cols-[220px_1fr_220px] gap-4 sm:gap-8 items-center">
          <img
            src="/fotos/hecho-en-colombia.webp"
            alt="Sello Hecho en Colombia con la bandera y el skyline de una ciudad colombiana"
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-2xl"
          />
          <div className="col-span-2 sm:col-span-1 order-last sm:order-none text-center">
            <h2 className="text-[20px] sm:text-[26px] font-bold tracking-[-0.02em] text-[#1d1d1f] leading-tight">
              {t('madeIn.title')}
            </h2>
            <p className="text-[13px] sm:text-[15px] text-[#6e6e73] mt-2 leading-relaxed">
              {t('madeIn.desc')}
            </p>
          </div>
          <img
            src="/fotos/logo-farmi-app.webp"
            alt="Logo de Farmi en la pantalla de un celular"
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-2xl"
          />
        </div>
      </div>
    </section>
  )
}

/* ── FAQ ────────────────────────────────────────────────────────────── */

const FAQ_KEYS = [
  { q: 'faq1.q', a: 'faq1.a' },
  { q: 'faq2.q', a: 'faq2.a' },
  { q: 'faq3.q', a: 'faq3.a' },
  { q: 'faq4.q', a: 'faq4.a' },
  { q: 'faq5.q', a: 'faq5.a' },
]

export function HomeFaq() {
  const { t } = useLang()
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-3xl mb-20 sm:mb-32">
      <SectionHeading title={t('faq.title')} />
      <img
        src="/fotos/comparando-en-farmacia.webp"
        alt="Persona comparando el precio de un producto en el estante de una farmacia"
        width={900}
        height={1200}
        loading="lazy"
        decoding="async"
        className="mx-auto h-56 sm:h-64 w-auto max-w-full object-contain rounded-3xl border border-white/70 shadow-[0_8px_32px_rgba(24,59,124,0.08)] mb-6"
      />
      <div className="flex flex-col gap-2.5">
        {FAQ_KEYS.map((f) => (
          <details key={f.q} className={`${CARD} group px-5 py-0.5`}>
            <summary className="flex items-center justify-between gap-3 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="text-[14px] font-semibold text-[#1d1d1f]">{t(f.q)}</span>
              <svg className="w-4 h-4 text-[#9ca3af] shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </summary>
            <p className="text-[13px] text-[#6e6e73] leading-relaxed pb-4 -mt-1">{t(f.a)}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/* ── Closing CTA ───────────────────────────────────────────────────── */

export function HomeCta() {
  const { t } = useLang()
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-28">
      <div className="bg-gradient-to-br from-primary to-tertiary rounded-3xl shadow-[0_8px_32px_rgba(24,59,124,0.18)] ring-1 ring-white/40 p-8 sm:p-14 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="text-center sm:text-left">
            <h2 className="text-[26px] sm:text-[40px] font-bold text-white tracking-[-0.02em] leading-tight">
              {t('cta.title')}
            </h2>
            <p className="text-[14px] sm:text-[15px] text-white/85 mt-2 max-w-xl mx-auto sm:mx-0 leading-relaxed">
              {t('cta.desc')}
            </p>
            <Link
              href="/#search-input"
              className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-white text-primary text-[15px] font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              {t('cta.button')}
            </Link>
          </div>
          <div className="max-w-[260px] sm:max-w-xs mx-auto w-full">
            <img
              src="/fotos/farmi-frente-drogueria.webp"
              alt="Mano sosteniendo un celular con Farmi abierto frente a una droguería en Colombia"
              width={900}
              height={1350}
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-2xl shadow-lg ring-1 ring-white/20"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
