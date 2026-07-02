import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getMedicineInfo, getAllMedicineSlugs } from '@/app/utils/medicineInfo'
import { normalize } from '@/app/utils/search'
import { LivePriceCompare } from '@/app/components/LivePriceCompare'
import { SITE_URL } from '@/app/lib/siteUrl'

interface Props {
  params: Promise<{ slug: string }>
}

// One transactional "precio de <medicamento> en Colombia" page per medication,
// pre-rendered at build time so crawlers get static HTML.
export function generateStaticParams() {
  return getAllMedicineSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const info = getMedicineInfo(slug)
  if (!info) return { title: 'Precio de medicamentos - Farmi' }

  const ing = info.activeIngredient
  const title = `Precio de ${ing} en Colombia`
  const description = `Compara el precio de ${ing.toLowerCase()} en La Rebaja, Cruz Verde, Farmatodo, Colsubsidio, Cafam y Olimpica. Encuentra hoy la farmacia mas barata en Colombia.`
  const canonical = `/precio/${slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: `${title} | Farmi`,
      description,
      url: `${SITE_URL}${canonical}`,
      locale: 'es_CO',
    },
  }
}

const CARD = 'bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm'

export default async function PrecioPage({ params }: Props) {
  const { slug } = await params
  const info = getMedicineInfo(slug)
  if (!info) notFound()

  const ing = info.activeIngredient
  // Lowercased for natural mid-sentence use ("el precio de acetaminofén...").
  const lc = ing.charAt(0).toLowerCase() + ing.slice(1)
  const otc = !info.requiresPrescription

  const related = getAllMedicineSlugs()
    .filter((s) => s !== slug)
    .map((s) => getMedicineInfo(s))
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .slice(0, 4)

  const faqs = [
    {
      q: `¿Cuánto cuesta ${lc} en Colombia?`,
      a: `El precio de ${lc} depende de la presentación (cantidad de tabletas o mililitros), de si eliges el genérico o la marca, y de la farmacia. No hay un precio único: por eso Farmi consulta el valor real en cada farmacia en el momento de tu búsqueda y te muestra de una la opción más barata.`,
    },
    {
      q: `¿Dónde comprar ${lc} más barato?`,
      a: `Puedes comparar el precio de ${lc} en Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam y Olímpica desde una sola búsqueda en Farmi, y luego ir directo a la farmacia con el mejor precio. Casi siempre el genérico y las presentaciones más grandes salen más económicos por unidad.`,
    },
    {
      q: `¿El genérico de ${lc} es más barato que el de marca?`,
      a: `Sí. El genérico tiene el mismo principio activo, la misma dosis y la misma forma que el de marca, está regulado por el INVIMA y suele costar bastante menos. En Farmi ves ambos lado a lado para que decidas según tu presupuesto.`,
    },
    otc
      ? {
          q: `¿${ing} necesita fórmula médica en Colombia?`,
          a: `${ing} es de venta libre para molestias leves, así que puedes compararlo y comprarlo sin receta. Si los síntomas persisten o son fuertes, consulta a un médico o químico farmacéutico.`,
        }
      : {
          q: `¿${ing} necesita fórmula médica en Colombia?`,
          a: `Sí. ${ing} se vende bajo fórmula médica; su compra y dispensación requieren la prescripción de un profesional de salud. Aun así puedes comparar precios en Farmi para pagar menos cuando lo compres.`,
        },
    {
      q: `¿Los precios de ${lc} en Farmi están actualizados?`,
      a: `Sí. Consultamos el precio directamente en el sitio de cada farmacia cuando haces la búsqueda, así que ves valores en tiempo real y no listas viejas. Los precios son de referencia y pueden variar por sede y promociones.`,
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: `Precio de ${ing}`, item: `${SITE_URL}/precio/${slug}` },
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
        <span className="text-[#1a1b1f] font-medium">Precio de {ing}</span>
      </nav>

      {/* Header + intro (keyword in first paragraph) */}
      <header>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-[#1a1b1f] tracking-tight leading-tight">
          Precio de {ing} en Colombia
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[#414755] leading-relaxed mt-3">
          El precio de {lc} en Colombia cambia según la farmacia, la presentación y si compras el
          genérico o el de marca. En vez de llamar o recorrer droguerías, aquí comparas el valor real
          de {lc} en las principales farmacias del país y encuentras, en segundos, dónde está más barato.
        </p>
      </header>

      {/* Comparador en vivo (precios reales) */}
      <LivePriceCompare query={normalize(ing)} ingredient={ing} />

      {/* ¿Cuánto cuesta? */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-[18px] font-bold text-[#1a1b1f] mb-3">¿Cuánto cuesta {lc} en Colombia?</h2>
        <p className="text-[14px] text-[#414755] leading-relaxed">
          No existe un precio único de {lc}. Lo que pagas depende de tres cosas: la <strong>presentación</strong>{' '}
          (no cuesta igual una caja de 10 tabletas que una de 30, ni un frasco pequeño que uno grande), si eliges el{' '}
          <strong>genérico o la marca</strong>, y la <strong>farmacia</strong> donde compres, porque cada cadena maneja
          sus propios precios y promociones. Por eso la forma más justa de saber cuánto cuesta {lc} hoy es comparar el
          valor actual en varias farmacias al mismo tiempo, que es justo lo que hace Farmi.
        </p>
        <p className="text-[14px] text-[#414755] leading-relaxed mt-3">
          {ing} pertenece al grupo de {info.therapeuticClass.toLowerCase()} y {otc
            ? 'es de venta libre, así que puedes compararlo y comprarlo sin fórmula médica'
            : 'se vende bajo fórmula médica, así que necesitarás la receta para comprarlo'}. En el comparador de arriba
          verás el precio más bajo disponible por farmacia en este momento, con la opción más económica marcada como la
          más barata.
        </p>
      </section>

      {/* ¿Por qué cambia el precio? */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-[18px] font-bold text-[#1a1b1f] mb-3">¿Por qué el precio de {lc} cambia entre farmacias?</h2>
        <p className="text-[14px] text-[#414755] leading-relaxed mb-3">
          Es normal encontrar diferencias grandes por el mismo medicamento. Estas son las razones más comunes:
        </p>
        <ul className="space-y-2.5">
          {[
            ['Marca del laboratorio', `El mismo ${lc} lo fabrican varios laboratorios. El genérico de un laboratorio económico puede costar mucho menos que la marca reconocida, con el mismo principio activo.`],
            ['Presentación y cantidad', 'Las cajas o frascos más grandes suelen salir más baratos por unidad. Comparar el precio por tableta o por mililitro ayuda a ver la verdadera diferencia.'],
            ['Promociones de cada cadena', 'Cada farmacia tiene sus propios descuentos y marcas propias, que cambian con el tiempo. Un precio bajo hoy puede no serlo mañana.'],
            ['Disponibilidad', 'Si una farmacia tiene el producto agotado, su precio deja de ser una opción real. Farmi solo tiene en cuenta lo que está disponible.'],
          ].map(([t, d]) => (
            <li key={t} className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-[#414755]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span><strong className="text-[#1a1b1f]">{t}:</strong> {d}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Genérico vs marca */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-[18px] font-bold text-[#1a1b1f] mb-3">{ing} genérico o de marca: ¿dónde está el ahorro?</h2>
        <p className="text-[14px] text-[#414755] leading-relaxed">
          El genérico de {lc} tiene el <strong>mismo principio activo, la misma dosis y la misma forma</strong> que el de
          marca, y está regulado por el INVIMA. La diferencia principal está en el precio: el genérico suele costar bastante
          menos porque no incluye el costo de la marca. Para muchas personas es la forma más sencilla de pagar menos sin
          cambiar el tratamiento. Aun así, la marca sigue siendo una opción válida si es la que te recomendó tu médico o la
          que prefieres; en Farmi te mostramos ambas para que compares con datos y elijas con tranquilidad.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="rounded-xl border border-secondary/20 bg-secondary/[0.06] p-4">
            <p className="text-[12px] font-bold text-secondary mb-1">Genérico</p>
            <p className="text-[13px] text-[#414755] leading-relaxed">Mismo efecto, precio más bajo. Ideal para ahorrar en el día a día.</p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
            <p className="text-[12px] font-bold text-primary mb-1">Marca</p>
            <p className="text-[13px] text-[#414755] leading-relaxed">El laboratorio de siempre. Cuesta más, pero es la opción de confianza para algunas personas.</p>
          </div>
        </div>
      </section>

      {/* Cómo comprar más barato */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-[18px] font-bold text-[#1a1b1f] mb-3">Cómo comprar {lc} más barato</h2>
        <ol className="space-y-3">
          {[
            ['Compara antes de comprar', `Busca ${lc} en Farmi y mira el precio en las 6 farmacias a la vez. La diferencia entre la más cara y la más barata puede ser importante.`],
            ['Revisa el genérico', 'Si tu tratamiento lo permite, el genérico casi siempre es la opción más económica con el mismo principio activo.'],
            ['Mira el precio por unidad', 'A veces una caja más grande cuesta más en total pero menos por tableta. Compara el precio por unidad, no solo el total.'],
            otc
              ? ['Aprovecha las promociones', 'Los precios cambian. Puedes activar una alerta en Farmi para que te avisemos cuando baje el precio.']
              : ['Ten a mano tu fórmula', `${ing} requiere receta médica. Ten tu fórmula lista y compara antes para pagar menos al comprarlo.`],
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
      </section>

      {/* Enlaces internos */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-[16px] font-bold text-[#1a1b1f] mb-3">Sigue explorando</h2>
        <div className="flex flex-wrap gap-2.5">
          <Link href={`/buscar?q=${encodeURIComponent(ing)}`} className="text-[13px] font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white hover:opacity-90 transition-opacity">
            Comparar precios de {ing}
          </Link>
          <Link href={`/medicamento/${slug}`} className="text-[13px] font-semibold px-4 py-2 rounded-lg border border-[#c1c6d7]/60 bg-white/60 text-[#414755] hover:text-primary hover:border-primary/30 transition-all">
            Para qué sirve {lc}: usos y dosis
          </Link>
          <Link href={`/historial/${slug}`} className="text-[13px] font-semibold px-4 py-2 rounded-lg border border-[#c1c6d7]/60 bg-white/60 text-[#414755] hover:text-primary hover:border-primary/30 transition-all">
            Historial de precios
          </Link>
        </div>
        {related.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#f0f1f5]">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9ca3af] mb-2">Precios de otros medicamentos</p>
            <div className="flex flex-wrap gap-2">
              {related.map((m) => (
                <Link key={m.slug} href={`/precio/${m.slug}`} className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/60 border border-[#c1c6d7]/50 text-[#414755] hover:text-primary hover:border-primary/30 transition-all">
                  {m.activeIngredient}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-[18px] font-bold text-[#1a1b1f] mb-3">Preguntas frecuentes sobre el precio de {lc}</h2>
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
        Farmi es un comparador de precios independiente, no una farmacia: no vende ni dispensa medicamentos y te
        redirige al sitio de cada farmacia para comprar. Los precios son de referencia y pueden variar. La información
        sobre {lc} es educativa y no reemplaza la consulta con un médico o químico farmacéutico.{' '}
        <Link href="/terminos" className="underline hover:text-[#717786] transition-colors">Ver condiciones</Link>.
      </p>
    </div>
  )
}
