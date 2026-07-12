import Link from 'next/link'
import type { Metadata } from 'next'
import { SearchBar } from '@/app/components/SearchBar'
import { PopularMeds } from '@/app/components/PopularMeds'
import { SITE_URL } from '@/app/lib/siteUrl'

// Página pilar del cluster "medicamentos baratos / económicos / a bajo precio".
// Una sola página fuerte para todos los sinónimos (Google los agrupa como una
// misma intención); las búsquedas por medicamento puntual las capturan las
// páginas /precio/[slug], a las que esta página enlaza.
export const metadata: Metadata = {
  title: 'Medicamentos baratos en Colombia: compara y paga menos',
  description:
    'Encuentra medicamentos baratos y económicos en Colombia. Compara precios en La Rebaja, Cruz Verde, Farmatodo, Colsubsidio, Cafam y Olímpica y elige la farmacia más barata.',
  alternates: { canonical: '/medicamentos-baratos' },
  openGraph: {
    type: 'website',
    title: 'Medicamentos baratos en Colombia | Farmi',
    description:
      'Compara precios de medicamentos en las principales farmacias de Colombia y encuentra la opción más económica en segundos.',
    url: `${SITE_URL}/medicamentos-baratos`,
    locale: 'es_CO',
  },
}

const CARD = 'glass-card rounded-2xl'

const faqs = [
  {
    q: '¿Dónde comprar medicamentos baratos en Colombia?',
    a: 'No hay una farmacia que siempre sea la más barata: cada cadena tiene sus propios precios y promociones, y la más económica cambia según el medicamento y el momento. Lo más efectivo es comparar el precio del medicamento que necesitas en varias farmacias a la vez, que es lo que hace Farmi con Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olímpica, Farmacia Pasteur y Farmacenter.',
  },
  {
    q: '¿Los medicamentos genéricos son igual de buenos que los de marca?',
    a: 'Un genérico tiene el mismo principio activo, la misma dosis y la misma forma que el de marca, y está regulado por el INVIMA. La diferencia principal es el precio: al no pagar el costo de la marca, suele ser bastante más económico. Si tu médico no indicó una marca específica, el genérico es la forma más sencilla de pagar menos.',
  },
  {
    q: '¿Por qué el mismo medicamento cuesta distinto en cada farmacia?',
    a: 'Cada cadena define sus precios, maneja marcas propias y lanza promociones diferentes. Además influyen la presentación (una caja de 30 tabletas suele salir más barata por unidad que una de 10) y el laboratorio que lo fabrica. Por eso comparar antes de comprar puede representar un ahorro importante.',
  },
  {
    q: '¿Los precios de Farmi están actualizados?',
    a: 'Sí. Farmi consulta el precio directamente en el sitio de cada farmacia en el momento de tu búsqueda, así que ves valores en tiempo real y no listas viejas. Los precios son referenciales y pueden variar por sede y promociones.',
  },
]

export default function MedicamentosBaratosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Medicamentos baratos', item: `${SITE_URL}/medicamentos-baratos` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#717786]" aria-label="Ruta de navegación">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-[#1a1b1f] font-medium">Medicamentos baratos</span>
      </nav>

      {/* Header + buscador */}
      <header>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-[#1a1b1f] tracking-tight leading-tight">
          Medicamentos baratos en Colombia: compara y paga menos
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[#414755] leading-relaxed mt-3">
          Conseguir medicamentos económicos en Colombia no depende de la suerte ni de recorrer
          droguerías: depende de comparar. El mismo medicamento puede costar el doble en una farmacia
          que en otra, y el genérico suele valer bastante menos que el de marca con el mismo principio
          activo. Busca el tuyo y mira el precio real en las 8 farmacias principales del país al mismo tiempo.
        </p>
        <div className="mt-5">
          <SearchBar />
        </div>
      </header>

      {/* Cómo encontrar el precio más bajo */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-[18px] font-bold text-[#1a1b1f] mb-3">Cómo encontrar medicamentos a bajo precio</h2>
        <ol className="space-y-3">
          {[
            ['Compara entre farmacias', 'Ningún medicamento tiene un precio único. Farmi consulta en tiempo real La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olímpica, Pasteur y Farmacenter y te muestra de una la opción más barata disponible.'],
            ['Prefiere el genérico', 'El genérico tiene el mismo principio activo y la misma dosis que el de marca, está regulado por el INVIMA y casi siempre es la opción más económica.'],
            ['Mira el precio por unidad', 'Una caja más grande puede costar más en total pero menos por tableta. Comparar por unidad revela el verdadero ahorro, sobre todo en tratamientos largos.'],
            ['Aprovecha ofertas y alertas', 'Los precios cambian todos los días. Revisa las ofertas activas o crea una alerta para que te avisemos cuando baje el precio del medicamento que necesitas.'],
          ].map(([t, d], i) => (
            <li key={t} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-tertiary text-white flex items-center justify-center font-bold text-[13px] shrink-0">{i + 1}</span>
              <div>
                <p className="text-[14px] font-semibold text-[#1a1b1f]">{t}</p>
                <p className="text-[13px] text-[#6e6e73] leading-relaxed mt-0.5">{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2.5 mt-5">
          <Link href="/ofertas" className="text-[13px] font-semibold px-4 py-2 rounded-xl vitality-gradient text-white hover:opacity-90 transition-opacity">
            Ver ofertas activas
          </Link>
          <Link href="/cercanas" className="text-[13px] font-semibold px-4 py-2 rounded-lg border border-[#c1c6d7]/60 bg-white/60 text-[#414755] hover:text-primary hover:border-primary/30 transition-all">
            Farmacias cercanas
          </Link>
        </div>
      </section>

      {/* Genérico vs marca */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-[18px] font-bold text-[#1a1b1f] mb-3">El secreto de los medicamentos económicos: el genérico</h2>
        <p className="text-[14px] text-[#414755] leading-relaxed">
          La forma más segura de pagar menos en la droguería es elegir el genérico cuando tu tratamiento
          lo permite. Tiene el <strong>mismo principio activo, la misma dosis y la misma forma</strong> que
          el de marca, con vigilancia del INVIMA. La marca sigue siendo válida si tu médico la indicó o la
          prefieres; en Farmi ves ambas lado a lado, con el precio de cada farmacia, para decidir con datos.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="rounded-xl border border-secondary/20 bg-secondary/[0.06] p-4">
            <p className="text-[12px] font-bold text-secondary mb-1">Genérico</p>
            <p className="text-[13px] text-[#414755] leading-relaxed">Mismo efecto, precio más bajo. La opción barata para el día a día.</p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
            <p className="text-[12px] font-bold text-primary mb-1">Marca</p>
            <p className="text-[13px] text-[#414755] leading-relaxed">El laboratorio de siempre. Cuesta más, pero es la opción de confianza para algunas personas.</p>
          </div>
        </div>
      </section>

      {/* Enlaces a todas las páginas /precio (mismo componente del home) */}
      <PopularMeds />

      {/* FAQ */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-[18px] font-bold text-[#1a1b1f] mb-3">Preguntas frecuentes sobre medicamentos baratos</h2>
        <div className="flex flex-col">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-[#f0f1f5] last:border-0">
              <summary className="flex items-center justify-between gap-3 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-[13px] sm:text-[14px] font-semibold text-[#1a1b1f]">{f.q}</span>
                <svg className="w-4 h-4 text-[#9ca3af] shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
                </svg>
              </summary>
              <p className="text-[13px] text-[#6e6e73] leading-relaxed pb-3 -mt-0.5">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <p className="text-[11px] text-[#c1c6d7] leading-relaxed">
        Farmi es un comparador de precios independiente, no una farmacia: no vende ni dispensa medicamentos
        y te redirige al sitio de cada farmacia para comprar. Los precios son de referencia y pueden variar.
        Esta información es educativa y no reemplaza la consulta con un médico o químico farmacéutico.{' '}
        <Link href="/terminos" className="underline hover:text-[#717786] transition-colors">Ver condiciones</Link>.
      </p>
    </div>
  )
}
