import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getMedicineInfo, getAllMedicineSlugs } from '@/app/utils/medicineInfo'
import { normalize } from '@/app/utils/search'
import { MedicationImage } from '@/app/components/MedicationImage'
import { PriceTracker } from '@/app/components/PriceTracker'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://farmi.co'

interface Props {
  params: Promise<{ slug: string }>
}

// Pre-render every medication page at build time: faster for users and gives
// crawlers static HTML to index.
export function generateStaticParams() {
  return getAllMedicineSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const info = getMedicineInfo(slug)
  if (!info) return { title: 'Medicamento - FarmiYa' }

  const title = `Precio de ${info.activeIngredient} en Colombia`
  const description = `Compara el precio de ${info.activeIngredient} en La Rebaja, Cruz Verde, Colsubsidio, Farmatodo y mas. Usos, dosis y advertencias de ${info.activeIngredient} (${info.therapeuticClass}).`
  const canonical = `/medicamento/${slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: `${title} | FarmiYa`,
      description,
      url: `${SITE_URL}${canonical}`,
      locale: 'es_CO',
    },
  }
}

export default async function MedicamentoPage({ params }: Props) {
  const { slug } = await params
  const info = getMedicineInfo(slug)
  if (!info) notFound()

  // Structured data: the Drug entity (medical info, accurate) plus breadcrumbs.
  // Offer/price structured data is intentionally omitted until prices are served
  // live on this page — emitting stale prices to Google harms ranking.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Drug',
        name: info.activeIngredient,
        nonProprietaryName: info.activeIngredient,
        drugClass: info.therapeuticClass,
        prescriptionStatus: info.requiresPrescription ? 'PrescriptionOnly' : 'OTC',
        mechanismOfAction: info.mechanism,
        warning: info.warnings.join(' '),
        url: `${SITE_URL}/medicamento/${slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: info.activeIngredient, item: `${SITE_URL}/medicamento/${slug}` },
        ],
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

      {/* Disclaimer banner */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
        <div className="shrink-0 mt-0.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-amber-800 mb-1">
            FarmiYa es un comparador de precios, no una farmacia
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
