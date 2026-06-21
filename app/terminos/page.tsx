import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Condiciones del sitio - Farmi',
  description: 'Terminos de uso, condiciones y aviso legal de Farmi, comparador de precios de medicamentos en Colombia.',
}

const sections = [
  {
    title: '1. Que es Farmi',
    body: `Farmi es una plataforma gratuita de comparacion de precios de medicamentos en Colombia. Su unico proposito es mostrar al usuario los precios publicados por farmacias y droguerias para que pueda tomar decisiones de compra informadas.

Farmi no es una farmacia, no vende medicamentos, no gestiona inventarios y no interviene en ninguna transaccion comercial entre el usuario y los establecimientos listados.`,
  },
  {
    title: '2. Naturaleza de la informacion de precios',
    body: `Los precios mostrados en Farmi son obtenidos de fuentes publicas (sitios web de farmacias, APIs oficiales y fuentes equivalentes) con fines estrictamente informativos. Pueden existir diferencias entre el precio publicado y el precio real al momento de la compra debido a:

- Cambios de precio por parte de la farmacia despues de la consulta.
- Disponibilidad de stock limitado o agotado.
- Precios especiales por tarjetas de lealtad, convenios o descuentos presenciales.
- Errores de sincronizacion entre la fuente y nuestra plataforma.

Farmi no garantiza la exactitud, vigencia ni disponibilidad de los precios mostrados.`,
  },
  {
    title: '3. Sitios de terceros',
    body: `Cada farmacia listada en Farmi es un negocio independiente y autónomo. Al hacer clic en "Comprar" o en cualquier enlace que lleve a un sitio externo, el usuario sera redirigido al sitio web oficial de esa farmacia.

Farmi no es responsable de:
- El contenido, politicas o funcionamiento de sitios de terceros.
- Transacciones, pagos o disputas realizadas en esos sitios.
- La calidad, autenticidad o condiciones de los productos adquiridos.
- Politicas de devolucion, garantia o atencion al cliente de cada farmacia.

Recomendamos al usuario verificar siempre el precio directamente en el sitio de la farmacia antes de completar cualquier compra.`,
  },
  {
    title: '4. Informacion medica y de salud',
    body: `La informacion sobre medicamentos publicada en Farmi (usos, dosis, advertencias, contraindicaciones y efectos secundarios) tiene caracter exclusivamente educativo e informativo. No constituye consejo medico, diagnostico ni prescripcion.

Antes de iniciar, modificar o suspender cualquier tratamiento farmacologico, consulte siempre a un medico o farmaceutico licenciado. Farmi no asume ninguna responsabilidad por decisiones de salud tomadas con base en el contenido de esta plataforma.`,
  },
  {
    title: '5. Gratuidad del servicio',
    body: `El uso basico de Farmi es gratuito para los usuarios. No intervenimos en el precio que paga el usuario al momento de comprar en una farmacia.

La plataforma puede incorporar modelos de monetizacion en el futuro, los cuales seran claramente identificados como tal.`,
  },
  {
    title: '6. Propiedad intelectual',
    body: `Los nombres, logotipos y marcas de las farmacias listadas son propiedad de sus respectivos duenos y se utilizan con fines referenciales e informativos. Farmi no reclama derechos sobre dichas marcas.

El diseño, codigo y contenido propio de Farmi son propiedad de sus desarrolladores.`,
  },
  {
    title: '7. Privacidad de datos',
    body: `Farmi no solicita datos personales sensibles para el uso basico de la plataforma. En caso de registro voluntario, los datos proporcionados se utilizan unicamente para funcionalidades como guardar favoritos o historial de busquedas, y no son compartidos con terceros con fines comerciales.

En desarrollo: politica de privacidad completa conforme a la Ley 1581 de 2012 (Habeas Data, Colombia).`,
  },
  {
    title: '8. Modificaciones',
    body: `Farmi se reserva el derecho de modificar estas condiciones en cualquier momento. Los cambios se publicaran en esta misma pagina. El uso continuado de la plataforma despues de una modificacion implica la aceptacion de los nuevos terminos.`,
  },
]

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5 py-8 sm:py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#717786] mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-[#1a1b1f] font-medium">Condiciones del sitio</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] sm:text-[30px] font-bold text-[#1a1b1f] tracking-tight">
          Condiciones del sitio
        </h1>
        <p className="text-[13px] text-[#717786] mt-2">
          Ultima actualizacion: junio de 2026
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 sm:p-6 mb-8">
        <p className="text-[13px] font-bold text-primary mb-1">Resumen en tres puntos</p>
        <ul className="space-y-2 mt-3">
          {[
            'Farmi compara precios. No vendemos medicamentos ni cobramos nada.',
            'Los precios son orientativos. Verificalos en el sitio de la farmacia antes de comprar.',
            'La informacion medica es educativa. Consulta siempre a un profesional de salud.',
          ].map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#414755]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((s) => (
          <section
            key={s.title}
            className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6"
          >
            <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-3">{s.title}</h2>
            {s.body.split('\n\n').map((para, i) => {
              const lines = para.split('\n')
              const isList = lines.some((l) => l.startsWith('- '))
              if (isList) {
                const intro = lines.filter((l) => !l.startsWith('- ')).join(' ').trim()
                const items = lines.filter((l) => l.startsWith('- ')).map((l) => l.slice(2))
                return (
                  <div key={i} className={i > 0 ? 'mt-3' : ''}>
                    {intro && <p className="text-[13px] text-[#414755] leading-relaxed mb-2">{intro}</p>}
                    <ul className="space-y-1.5">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-[12px] sm:text-[13px] text-[#414755]">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#c1c6d7] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              }
              return (
                <p key={i} className={`text-[13px] text-[#414755] leading-relaxed ${i > 0 ? 'mt-3' : ''}`}>
                  {para}
                </p>
              )
            })}
          </section>
        ))}
      </div>

      {/* Back */}
      <div className="mt-8 pt-4 border-t border-[#c1c6d7]/30 flex flex-wrap gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </Link>
        <Link
          href="/buscar?q=acetaminofen"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#c1c6d7]/50 bg-white/60 text-[13px] font-semibold text-[#414755] hover:bg-white/80 transition-all"
        >
          Buscar medicamentos
        </Link>
      </div>
    </div>
  )
}
