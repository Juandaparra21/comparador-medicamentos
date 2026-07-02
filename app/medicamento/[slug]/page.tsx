import Link from 'next/link'
import type { Metadata } from 'next'
import { getMedicineInfo, getAllMedicineSlugs } from '@/app/utils/medicineInfo'
import { normalize } from '@/app/utils/search'
import { MedicationImage } from '@/app/components/MedicationImage'
import { PriceTracker } from '@/app/components/PriceTracker'
import { LivePriceCompare } from '@/app/components/LivePriceCompare'
import { SITE_URL } from '@/app/lib/siteUrl'

interface Props {
  params: Promise<{ slug: string }>
}

// A search slug is normalized (lowercase, no accents). We can't recover the exact
// accents for a medication that has no curated sheet, so we title-case the slug for
// a readable heading. Prices/history below use the slug as the (already normalized)
// query, which is exactly what /api/search expects.
function prettyName(slug: string): string {
  return slug
    .split('-')
    .join(' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Pre-render every medication page at build time: faster for users and gives
// crawlers static HTML to index.
export function generateStaticParams() {
  return getAllMedicineSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const info = getMedicineInfo(slug)
  // No curated sheet: the page still works (prices + history), but it is thin content
  // for search engines, so we keep it out of the index while letting links be followed.
  if (!info) {
    const name = prettyName(slug)
    return {
      title: `Precio de ${name} - Farmi`,
      description: `Compara el precio de ${name} en las principales farmacias de Colombia.`,
      robots: { index: false, follow: true },
      alternates: { canonical: `/medicamento/${slug}` },
    }
  }

  // Informational intent: this page answers "para que sirve / dosis / advertencias".
  // The price-transactional query ("precio de X en Colombia") is owned by /precio/[slug],
  // so the two pages don't compete for the same search.
  const lc = info.activeIngredient.charAt(0).toLowerCase() + info.activeIngredient.slice(1)
  const title = `${info.activeIngredient}: para qué sirve, dosis y advertencias`
  const description = `Para qué sirve ${lc}, dosis orientativa, efectos secundarios y advertencias. Descubre si ${lc} necesita fórmula médica en Colombia y compara su precio.`
  const canonical = `/medicamento/${slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: `${title} | Farmi`,
      description,
      url: `${SITE_URL}${canonical}`,
      locale: 'es_CO',
    },
  }
}

export default async function MedicamentoPage({ params }: Props) {
  const { slug } = await params
  const info = getMedicineInfo(slug)
  // No curated clinical sheet yet: show a safe page (real prices + history) instead
  // of a 404. We never invent doses, warnings or contraindications.
  if (!info) return <MedicamentoFallback slug={slug} />

  // FAQs derived from the medication's own data — real content that targets
  // common "para que sirve / necesita formula / donde comprar" search queries
  // and powers the FAQPage rich result below.
  const faqs = [
    {
      q: `Para que sirve el ${info.activeIngredient}?`,
      a: `${info.activeIngredient} (${info.therapeuticClass}) se usa para: ${info.uses.join('; ')}.`,
    },
    {
      q: `El ${info.activeIngredient} necesita formula medica en Colombia?`,
      a: info.requiresPrescription
        ? `Si. ${info.activeIngredient} es un medicamento de venta bajo formula medica; su compra y dispensacion requieren prescripcion de un profesional de salud.`
        : `${info.activeIngredient} es de venta libre para molestias leves. Si los sintomas persisten, consulta a un medico o quimico farmaceutico.`,
    },
    {
      q: `Cual es la dosis del ${info.activeIngredient}?`,
      a: `La dosis orientativa es ${info.typicalDose} (maximo ${info.maxDailyDose}). Es solo informativa: la dosis correcta la determina tu medico o quimico farmaceutico.`,
    },
    {
      q: `El generico de ${info.activeIngredient} es igual al de marca?`,
      a: `Si. El generico tiene el mismo principio activo, dosis y forma que el de marca, esta regulado por el INVIMA y suele costar bastante menos.`,
    },
    {
      q: `Donde comprar ${info.activeIngredient} mas barato en Colombia?`,
      a: `En Farmi puedes comparar el precio de ${info.activeIngredient} en La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam y Olimpica, y elegir la opcion mas economica.`,
    },
  ]

  // Structured data: breadcrumbs + a FAQ rich result. We deliberately do NOT emit
  // a schema.org Drug node: Drug is a subtype of Product, so Google validates it as
  // a merchant listing and demands offers/review/aggregateRating — which we cannot
  // provide honestly (no live price in the static HTML, no invented ratings). The
  // FAQPage is the valuable rich result here; Drug yields no rich result in Search.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: info.activeIngredient, item: `${SITE_URL}/medicamento/${slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-5 py-8 sm:py-12 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#717786]">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <Link href={`/buscar?q=${encodeURIComponent(info.activeIngredient)}`} className="hover:text-primary transition-colors">
          {info.activeIngredient}
        </Link>
        <span>/</span>
        <span className="text-[#1a1b1f] font-medium">Informacion</span>
      </nav>

      {/* Header */}
      <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm overflow-hidden">
        <MedicationImage ingredient={info.activeIngredient} height={100} />
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#1a1b1f] tracking-tight">
              {info.activeIngredient}
            </h1>
            {info.requiresPrescription ? (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 self-center whitespace-nowrap">
                Requiere formula medica
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 self-center whitespace-nowrap">
                Venta libre
              </span>
            )}
          </div>
          <p className="text-[13px] font-semibold text-[#717786]">{info.therapeuticClass}</p>
        </div>
      </div>

      {/* Precio (cross-link to the transactional page) */}
      <Link
        href={`/precio/${slug}`}
        className="flex items-center justify-between gap-3 bg-primary/[0.06] border border-primary/15 rounded-xl p-4 hover:bg-primary/[0.09] transition-colors group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1m0-12V4m0 16v-1" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-[#1a1b1f] leading-tight">Ver el precio de {info.activeIngredient} en Colombia</p>
            <p className="text-[12px] text-[#717786] leading-tight mt-0.5">Compara el valor real en 6 farmacias</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </Link>

      {/* Disclaimer banner */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
        <div className="shrink-0 mt-0.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-amber-800 mb-1">
            Farmi es un comparador de precios, no una farmacia
          </p>
          <p className="text-[12px] text-amber-700 leading-relaxed">
            No vendemos medicamentos. Toda la informacion medica es de caracter educativo y no reemplaza la consulta con un profesional de salud. Para comprar, seras redirigido al sitio oficial de cada farmacia.{' '}
            <Link href="/terminos" className="underline font-semibold hover:text-amber-900 transition-colors">
              Ver condiciones del sitio
            </Link>
          </p>
        </div>
      </div>

      {/* Uses */}
      <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6">
        <h2 className="text-[16px] font-bold text-[#1a1b1f] mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.012C4.045 12.455 2 9.93 2 6.5a4.5 4.5 0 018-2.826A4.5 4.5 0 0118 6.5c0 3.43-2.045 5.955-3.885 7.708a22.049 22.049 0 01-3.744 2.694l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
            </svg>
          </span>
          Para que se usa
        </h2>
        <ul className="space-y-2">
          {info.uses.map((use, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#414755]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
              {use}
            </li>
          ))}
        </ul>
      </section>

      {/* Mechanism + Dosage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5">
          <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-primary" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            Como actua
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[#414755] leading-relaxed">{info.mechanism}</p>
        </section>

        <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5">
          <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-tertiary/10 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-tertiary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </span>
            Dosis orientativa
          </h2>
          <p className="text-[12px] font-bold text-[#1a1b1f] mb-1">{info.typicalDose}</p>
          <p className="text-[11px] text-[#717786]">
            Dosis maxima diaria:{' '}
            <span className="font-semibold text-[#414755]">{info.maxDailyDose}</span>
          </p>
          <p className="text-[11px] text-amber-600 mt-2 font-medium">
            La dosis correcta la determina tu medico o farmaceutico.
          </p>
        </section>
      </div>

      {/* Warnings */}
      <section className="bg-red-50/70 backdrop-blur-[20px] border border-red-100 rounded-2xl shadow-sm p-5 sm:p-6">
        <h2 className="text-[15px] font-bold text-red-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Advertencias importantes
        </h2>
        <ul className="space-y-2">
          {info.warnings.map((w, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[12px] sm:text-[13px] text-red-800">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {w}
            </li>
          ))}
        </ul>
      </section>

      {/* Side effects + Contraindications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5">
          <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-3">Efectos secundarios</h2>
          <ul className="space-y-1.5">
            {info.sideEffects.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-[#414755]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5">
          <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-3">Contraindicaciones</h2>
          <ul className="space-y-1.5">
            {info.contraindications.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-[#414755]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Real price history + tracking */}
      <PriceTracker query={normalize(info.activeIngredient)} label={info.activeIngredient} />

      {/* FAQ */}
      <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6">
        <h2 className="text-[16px] font-bold text-[#1a1b1f] mb-3">
          Preguntas frecuentes sobre {info.activeIngredient}
        </h2>
        <div className="flex flex-col">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-[#f0f1f5] last:border-0">
              <summary className="flex items-center justify-between gap-3 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-[13px] font-semibold text-[#1a1b1f]">{f.q}</span>
                <svg className="w-4 h-4 text-[#9ca3af] shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
                </svg>
              </summary>
              <p className="text-[12px] sm:text-[13px] text-[#6e6e73] leading-relaxed pb-3 -mt-0.5">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href={`/buscar?q=${encodeURIComponent(info.activeIngredient)}`}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          Comparar precios de {info.activeIngredient}
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#c1c6d7]/50 bg-white/60 text-[13px] font-semibold text-[#414755] hover:bg-white/80 transition-all"
        >
          Buscar otro medicamento
        </Link>
      </div>
    </div>
  )
}

// Shown when a medication has no curated clinical sheet. It NEVER invents medical
// content (doses, warnings, contraindications). It only surfaces verifiable data:
// the real live price comparison and the price history, plus the legal disclaimer.
function MedicamentoFallback({ slug }: { slug: string }) {
  const name = prettyName(slug)
  const query = normalize(slug)

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-5 py-8 sm:py-12 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#717786]">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <Link href={`/buscar?q=${encodeURIComponent(name)}`} className="hover:text-primary transition-colors">
          {name}
        </Link>
        <span>/</span>
        <span className="text-[#1a1b1f] font-medium">Informacion</span>
      </nav>

      {/* Header */}
      <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm overflow-hidden">
        <MedicationImage ingredient={name} height={100} />
        <div className="p-5 sm:p-6">
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#1a1b1f] tracking-tight mb-2">
            {name}
          </h1>
          <p className="text-[13px] text-[#717786] leading-relaxed">
            Todavia estamos preparando la ficha detallada de {name}. Mientras tanto, aqui
            puedes comparar su precio real en las farmacias y ver como ha cambiado.
          </p>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
        <div className="shrink-0 mt-0.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-amber-800 mb-1">
            Farmi es un comparador de precios, no una farmacia
          </p>
          <p className="text-[12px] text-amber-700 leading-relaxed">
            No vendemos medicamentos y no damos consejo medico. Para saber si {name} es
            adecuado para ti, su dosis o sus advertencias, consulta a un medico o quimico
            farmaceutico.{' '}
            <Link href="/terminos" className="underline font-semibold hover:text-amber-900 transition-colors">
              Ver condiciones del sitio
            </Link>
          </p>
        </div>
      </div>

      {/* Comparador en vivo (precios reales) */}
      <LivePriceCompare query={query} ingredient={name} />

      {/* Historial de precios real */}
      <PriceTracker query={query} label={name} />

      {/* Navigation */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href={`/buscar?q=${encodeURIComponent(name)}`}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          Comparar precios de {name}
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#c1c6d7]/50 bg-white/60 text-[13px] font-semibold text-[#414755] hover:bg-white/80 transition-all"
        >
          Buscar otro medicamento
        </Link>
      </div>
    </div>
  )
}
