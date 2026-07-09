import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description:
    'Farmi es una plataforma gratuita que compara precios de medicamentos en las principales farmacias de Colombia. Conoce nuestra misión y como funcionamos.',
}

const PHARMACIES = [
  'Drogas La Rebaja',
  'Cruz Verde',
  'Drogueria Colsubsidio',
  'Olimpica Drogueria',
  'Farmatodo',
  'Cafam',
]

const HOW_STEPS = [
  {
    n: '01',
    title: 'Consulta pública',
    body: 'Accedemos a los precios directamente desde las APIs y sitios web oficiales de cada farmacia, igual que lo haria cualquier usuario.',
  },
  {
    n: '02',
    title: 'Normalizacion',
    body: 'Procesamos los datos para identificar el principio activo, concentracion, presentación y cantidad de cada producto y hacer comparaciones justas.',
  },
  {
    n: '03',
    title: 'Presentación',
    body: 'Te mostramos los resultados ordenados por precio con el ahorro potencial, para que puedas decidir de forma rápida e informada.',
  },
]

const VALUES = [
  { title: 'Transparencia', body: 'Nunca ocultamos de donde viene cada precio. Cada resultado tiene un enlace directo a la farmacia.' },
  { title: 'Gratuidad', body: 'La plataforma es completamente gratuita para los usuarios. No cobramos comisión por ninguna compra.' },
  { title: 'Neutralidad', body: 'No favorecemos ninguna farmacia. Mostramos todos los resultados disponibles sin patrocinios que alteren el orden.' },
  { title: 'Privacidad', body: 'No vendemos tus datos. El registro es opcional y solo sirve para guardar favoritos y listas.' },
]

export default function SobreNosotrosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5 py-8 sm:py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#717786] mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-[#1a1b1f] font-medium">Sobre nosotros</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-[24px] sm:text-[30px] font-bold text-[#1a1b1f] tracking-tight mb-3">
          Sobre Farmi
        </h1>
        <p className="text-[15px] text-[#414755] leading-relaxed">
          Somos una plataforma gratuita que ayuda a los colombianos a encontrar el mejor precio en
          medicamentos sin tener que visitar o llamar a varias farmacias.
        </p>
      </div>

      {/* Fotos */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        <img
          src="/fotos/logo-farmi-celular.webp"
          alt="Celular mostrando el logo de Farmi frente a una droguería"
          width={900}
          height={1350}
          loading="lazy"
          decoding="async"
          className="w-full h-auto rounded-2xl border border-white/50 shadow-sm"
        />
        <img
          src="/fotos/buscando-farmacias-cerca.webp"
          alt="Persona usando Farmi en la calle para encontrar farmacias cercanas en el mapa"
          width={900}
          height={1350}
          loading="lazy"
          decoding="async"
          className="w-full h-auto rounded-2xl border border-white/50 shadow-sm"
        />
      </div>

      {/* Misión */}
      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 sm:p-6 mb-8">
        <img
          src="/fotos/contando-monedas.webp"
          alt="Persona contando monedas sobre una mesa junto a sus medicamentos"
          width={900}
          height={1350}
          loading="lazy"
          decoding="async"
          className="w-full h-56 sm:h-64 object-cover object-[center_60%] rounded-xl mb-4"
        />
        <p className="text-[11px] font-bold tracking-widest uppercase text-primary mb-2">Nuestra misión</p>
        <p className="text-[15px] font-semibold text-[#1a1b1f] leading-relaxed">
          Hacer que el acceso a medicamentos asequibles sea simple, rápido y transparente para cualquier
          persona en Colombia, sin importar donde viva o cuanto tiempo tenga.
        </p>
      </div>

      {/* Qué hacemos */}
      <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
        <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-3">Qué hacemos</h2>
        <p className="text-[13px] text-[#414755] leading-relaxed mb-3">
          Farmi compara los precios publicados por las principales farmacias y droguerías de Colombia
          en tiempo casi real. Buscamos por nombre genérico o de marca y agrupamos los resultados
          equivalentes para que puedas ver de un vistazo cuanto puedes ahorrar.
        </p>
        <p className="text-[13px] text-[#414755] leading-relaxed">
          <strong className="text-[#1a1b1f]">No somos una farmacia.</strong> No vendemos medicamentos,
          no gestionamos inventarios y no procesamos ninguna transacción. Simplemente te mostramos donde
          esta el mejor precio y te llevamos al sitio oficial de la farmacia.
        </p>
      </section>

      {/* Farmacias */}
      <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
        <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-4">Farmacias que comparamos</h2>
        <div className="flex flex-wrap gap-2">
          {PHARMACIES.map((name) => (
            <span
              key={name}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-[#f1f2f6] text-[#414755] border border-[#e5e7eb]"
            >
              {name}
            </span>
          ))}
        </div>
        <p className="text-[12px] text-[#717786] mt-3">
          Seguimos sumando farmacias. Si quieres que agreguemos alguna, escribenos.
        </p>
      </section>

      {/* Cómo funciona */}
      <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
        <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-5">Cómo obtenemos los precios</h2>
        <div className="flex flex-col gap-5">
          {HOW_STEPS.map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="text-[22px] font-black text-primary/20 leading-none shrink-0 w-8">{s.n}</span>
              <div>
                <p className="text-[13px] font-bold text-[#1a1b1f] mb-1">{s.title}</p>
                <p className="text-[13px] text-[#414755] leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-[#e5e7eb]">
          <p className="text-[12px] text-[#717786] leading-relaxed">
            Los precios se consultan en el momento de cada búsqueda. Pueden existir diferencias con el
            precio final en tienda por cambios de la farmacia, disponibilidad de stock o precios
            diferenciados por ciudad o canal. Siempre verifica el precio definitivo en el sitio de la
            farmacia antes de comprar.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
        <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-5">Nuestros valores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-[#faf9fe] border border-[#e5e7eb] rounded-xl p-4">
              <p className="text-[13px] font-bold text-[#1a1b1f] mb-1">{v.title}</p>
              <p className="text-[12px] text-[#414755] leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Aviso médico */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 mb-8">
        <p className="text-[12px] font-bold text-amber-700 uppercase tracking-widest mb-2">Aviso importante</p>
        <p className="text-[13px] text-amber-900 leading-relaxed">
          La información publicada en Farmi tiene carácter exclusivamente informativo y de
          orientación de precios. <strong>No sustituye la asesorıa médica o farmacéutica profesional.</strong>{' '}
          Consulta siempre a un médico o farmacéutico antes de iniciar, modificar o suspender cualquier
          tratamiento.
        </p>
      </div>

      {/* Hecho en Colombia */}
      <img
        src="/fotos/hecho-en-colombia.webp"
        alt="Sello Hecho en Colombia con la bandera y el skyline de una ciudad colombiana"
        width={800}
        height={800}
        loading="lazy"
        decoding="async"
        className="w-full max-w-[280px] mx-auto h-auto rounded-2xl shadow-sm mb-8"
      />

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          Buscar medicamentos
        </Link>
        <Link
          href="/contacto"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#c1c6d7]/50 bg-white/60 text-[13px] font-semibold text-[#414755] hover:bg-white/80 transition-all"
        >
          Contactanos
        </Link>
      </div>
    </div>
  )
}
