import Link from 'next/link'
import { PharmacyLogo } from './PharmacyLogo'

/* Static, server-rendered home sections (no client JS) to keep the page light. */

const CARD = 'bg-white border border-black/[0.06] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]'

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 sm:mb-14 text-center">
      <h2 className="text-[26px] sm:text-[36px] font-bold tracking-[-0.02em] text-[#1d1d1f] leading-tight">{title}</h2>
      {subtitle && <p className="text-[15px] sm:text-[18px] text-[#6e6e73] mt-2.5 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  )
}

/* ── Trust strip (under the hero search) ───────────────────────────── */

const TRUST_SIGNALS = [
  'Precios en tiempo real',
  '6 farmacias en una busqueda',
  '100% gratis, sin registro',
]

export function TrustStrip() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-semibold text-[#414755]">
      {TRUST_SIGNALS.map((label) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4 text-secondary shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
          {label}
        </span>
      ))}
    </div>
  )
}

/* ── Why Farmi ─────────────────────────────────────────────────────── */

const VALUES: { title: string; desc: string; path: string }[] = [
  { title: '100% gratis',            desc: 'Sin registro ni costos. Solo busca y compara.', path: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
  { title: 'Precios en tiempo real', desc: 'Consultamos cada farmacia en el momento de tu busqueda.', path: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
  { title: '6 farmacias a la vez',   desc: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam y Olimpica.', path: 'M3.75 21h16.5M4.5 3h15l-.75 4.5h-13.5L4.5 3Zm.75 4.5V21m13.5-13.5V21M9 21v-6h6v6' },
  { title: 'Generico o de marca',    desc: 'Compara equivalentes y elige segun tu presupuesto.', path: 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9' },
]

export function ValueProps() {
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {VALUES.map((v) => (
          <div key={v.title} className={`${CARD} p-4 sm:p-5`}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={v.path} />
              </svg>
            </div>
            <p className="text-[14px] font-bold text-[#1d1d1f] leading-snug">{v.title}</p>
            <p className="text-[12px] text-[#6e6e73] mt-1 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── How it works ──────────────────────────────────────────────────── */

const STEPS = [
  { n: 1, title: 'Busca tu medicamento', desc: 'Escribe el nombre generico (ibuprofeno) o de marca (Advil).' },
  { n: 2, title: 'Compara los precios',  desc: 'Te mostramos las farmacias de menor a mayor precio, al instante.' },
  { n: 3, title: 'Compra al mejor precio', desc: 'Vas directo a la farmacia con el precio mas bajo. Tu eliges.' },
]

export function HowItWorks() {
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <SectionHeading title="Como funciona" subtitle="Encuentra el mejor precio en tres pasos." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {STEPS.map((s) => (
          <div key={s.n} className={`${CARD} p-5`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-tertiary text-white flex items-center justify-center font-bold text-[15px] mb-3">
              {s.n}
            </div>
            <p className="text-[15px] font-bold text-[#1d1d1f]">{s.title}</p>
            <p className="text-[13px] text-[#6e6e73] mt-1 leading-relaxed">{s.desc}</p>
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
  return (
    <div className="mt-8 sm:mt-9">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9ca3af] mb-3.5">
        Precios en tiempo real de
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-3 gap-y-4 max-w-sm sm:max-w-2xl mx-auto">
        {PHARMACIES.map((p) => (
          <div key={p.key} className="flex flex-col items-center gap-1.5">
            <PharmacyLogo name={p.key} size={46} />
            <span className="text-[10px] sm:text-[11px] font-medium text-[#717786] text-center leading-tight">
              {p.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PharmacyStrip() {
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <SectionHeading title="Comparamos estas farmacias" subtitle="Precios en tiempo real de las cadenas mas grandes de Colombia." />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PHARMACIES.map((p) => (
          <div key={p.key} className={`${CARD} p-4 flex flex-col items-center gap-2 text-center`}>
            <PharmacyLogo name={p.key} size={40} />
            <span className="text-[12px] font-semibold text-[#414755] leading-tight">{p.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[#c1c6d7] mt-3 text-center">
        Logos y marcas pertenecen a sus respectivos titulares. Farmi es un comparador independiente,
        no afiliado ni patrocinado por estas farmacias.
      </p>
    </section>
  )
}

/* ── Generic vs brand ──────────────────────────────────────────────── */

export function GenericVsBrand() {
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-32">
      <SectionHeading title="Generico o de marca?" subtitle="Mismo efecto, distinto precio. Tu decides." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className={`${CARD} p-5`}>
          <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 mb-3">
            Generico
          </span>
          <p className="text-[14px] font-semibold text-[#1d1d1f] mb-1.5">El mismo principio activo, mas barato</p>
          <p className="text-[13px] text-[#6e6e73] leading-relaxed">
            Tiene el mismo principio activo, dosis y forma que el de marca, y esta regulado por el INVIMA.
            Suele costar entre 30% y 80% menos.
          </p>
        </div>
        <div className={`${CARD} p-5`}>
          <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
            Marca
          </span>
          <p className="text-[14px] font-semibold text-[#1d1d1f] mb-1.5">El laboratorio que ya conoces</p>
          <p className="text-[13px] text-[#6e6e73] leading-relaxed">
            Es el producto original de un laboratorio reconocido. Cuesta mas, pero algunas personas
            prefieren la marca de confianza. Farmi te muestra ambos para que compares.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── FAQ (native details, no JS) ───────────────────────────────────── */

const FAQS: { q: string; a: string }[] = [
  { q: 'Farmi vende medicamentos?', a: 'No. Farmi compara precios y te lleva a la pagina de la farmacia para que compres directamente con ella. No vendemos ni intervenimos en la compra.' },
  { q: 'Los precios son exactos?',  a: 'Son referenciales y se obtienen en tiempo real de cada farmacia. Pueden variar por sede, disponibilidad o promociones. Confirma siempre el precio final en la farmacia.' },
  { q: 'Necesito registrarme?',     a: 'No. Puedes buscar y comparar sin crear cuenta. El registro solo sirve para guardar tu lista de favoritos.' },
  { q: 'Que farmacias comparan?',   a: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam y Olimpica. Consultamos sus precios cuando haces una busqueda.' },
  { q: 'Tiene algun costo?',        a: 'No. Farmi es 100% gratis para los usuarios.' },
]

export function HomeFaq() {
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-3xl mb-20 sm:mb-32">
      <SectionHeading title="Preguntas frecuentes" />
      <div className="flex flex-col gap-2.5">
        {FAQS.map((f) => (
          <details key={f.q} className={`${CARD} group px-5 py-0.5`}>
            <summary className="flex items-center justify-between gap-3 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="text-[14px] font-semibold text-[#1d1d1f]">{f.q}</span>
              <svg className="w-4 h-4 text-[#9ca3af] shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </summary>
            <p className="text-[13px] text-[#6e6e73] leading-relaxed pb-4 -mt-1">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/* ── Closing CTA ───────────────────────────────────────────────────── */

export function HomeCta() {
  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl mb-20 sm:mb-28">
      <div className="bg-gradient-to-br from-primary to-tertiary rounded-3xl shadow-sm p-10 sm:p-16 text-center">
        <h2 className="text-[26px] sm:text-[40px] font-bold text-white tracking-[-0.02em] leading-tight">
          Deja de pagar de mas por tus medicamentos
        </h2>
        <p className="text-[14px] sm:text-[15px] text-white/85 mt-2 max-w-xl mx-auto leading-relaxed">
          Compara en segundos y encuentra el precio mas bajo entre las principales farmacias de Colombia.
        </p>
        <Link
          href="/#search-input"
          className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-white text-primary text-[15px] font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          Buscar un medicamento
        </Link>
      </div>
    </section>
  )
}
