import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Condiciones del sitio',
  description: 'Términos de uso, condiciones y aviso legal de Farmi, comparador de precios de medicamentos en Colombia.',
}

const sections = [
  {
    title: '1. Qué es Farmi',
    body: `Farmi es una plataforma gratuita y meramente informativa de comparación de precios de medicamentos en Colombia. Su único propósito es mostrar, de forma neutral, los precios que las farmacias y droguerías publican en sus canales oficiales, para que el usuario pueda comparar y tomar decisiones de compra informadas.

Farmi NO es una farmacia ni un establecimiento farmacéutico. No vende, no ofrece, no dispensa, no almacena ni distribuye medicamentos; no gestiona inventarios; y no interviene ni participa en ninguna transacción comercial entre el usuario y los establecimientos listados.`,
  },
  {
    title: '2. El servicio no constituye publicidad',
    body: `Farmi es una herramienta de información y comparación de precios, no un medio publicitario. Farmi no realiza publicidad, promoción, patrocinio, incentivo ni inducción al consumo de medicamentos, marcas, laboratorios o farmacias.

La información se muestra únicamente como respuesta a las búsquedas que el propio usuario realiza de forma voluntaria, con carácter referencial y comparativo. El orden de los resultados responde a criterios informativos (como el precio o la cercanía) y no a contraprestaciones publicitarias: ningún medicamento, laboratorio o farmacia es destacado o recomendado comercialmente por encima de otro.

Farmi no anuncia ni promociona medicamentos de venta bajo fórmula médica. Respecto de estos, la información mostrada es estrictamente de referencia y su adquisición y dispensación están sujetas a la presentación de fórmula médica válida, conforme a la regulación sanitaria colombiana (INVIMA y normas concordantes). Farmi no facilita ni promueve la adquisición de medicamentos sin el cumplimiento de dichos requisitos.`,
  },
  {
    title: '3. Naturaleza de la información de precios',
    body: `Los precios mostrados en Farmi corresponden a los precios de lista (precios públicos) que cada farmacia o droguería pública en sus canales oficiales. Se obtienen de fuentes públicas (sitios web, APIs oficiales y fuentes equivalentes) con fines estrictamente informativos.

Estos precios son propiedad de cada farmacia y NO son fijados, definidos ni controlados por Farmi. Farmi únicamente los recopila y los muestra para facilitar la comparación; no son precios nuestros.

Los precios de lista NO contemplan descuentos personales ni precios preferenciales derivados de afiliaciones o condiciones particulares del usuario, tales como:

- Afiliación a EPS, cajas de compensación o planes corporativos.
- Tarjetas de lealtad, membresías o convenios de la farmacia.
- Descuentos presenciales, promociones por sede o cupones personales.
- Coberturas, subsidios o autorizaciones de planes de salud.

Por lo anterior, el precio final que pague el usuario en la farmacia puede ser menor o mayor al precio de lista mostrado. También pueden existir diferencias por cambios de precio posteriores a la consulta, stock limitado o agotado, o errores de sincronización entre la fuente y nuestra plataforma.

Farmi no garantiza la exactitud, vigencia ni disponibilidad de los precios mostrados.`,
  },
  {
    title: '4. Sitios de terceros',
    body: `Cada farmacia listada en Farmi es un negocio independiente y autónomo. Al hacer clic en "Comprar" o en cualquier enlace que lleve a un sitio externo, el usuario será redirigido al sitio web oficial de esa farmacia.

Farmi no es responsable de:
- El contenido, políticas o funcionamiento de sitios de terceros.
- Transacciones, pagos o disputas realizadas en esos sitios.
- La calidad, autenticidad o condiciones de los productos adquiridos.
- Políticas de devolución, garantía o atención al cliente de cada farmacia.

Recomendamos al usuario verificar siempre el precio directamente en el sitio de la farmacia antes de completar cualquier compra.`,
  },
  {
    title: '5. Información médica y de salud',
    body: `La información sobre medicamentos publicada en Farmi (usos, dosis, advertencias, contraindicaciones y efectos secundarios) tiene carácter exclusivamente educativo e informativo. No constituye publicidad, consejo médico, diagnóstico, prescripción ni invitación a automedicarse.

Las orientaciones del asistente virtual se limitan a medicamentos de venta libre para molestias leves, son generadas por inteligencia artificial, pueden contener errores y no reemplazan la consulta con un profesional de salud.

Antes de iniciar, modificar o suspender cualquier tratamiento farmacológico, consulte siempre a un médico o químico farmacéutico licenciado. Farmi no asume ninguna responsabilidad por decisiones de salud, por la automedicación ni por el uso de medicamentos tomados con base en el contenido de esta plataforma.`,
  },
  {
    title: '6. Limitación de responsabilidad',
    body: `El servicio se presta "tal cual" y "según disponibilidad", sin garantías de ningún tipo sobre la exactitud, vigencia, completitud o disponibilidad de la información.

En la máxima medida permitida por la ley aplicable, Farmi y sus desarrolladores no serán responsables por danos o perjuicios directos, indirectos, incidentales o consecuenciales derivados de:

- El uso o la imposibilidad de uso de la plataforma.
- Diferencias entre los precios mostrados y los precios reales en la farmacia.
- Decisiones de compra, de consumo o de salud tomadas con base en la información.
- Actos, omisiones, productos, precios o servicios de las farmacias u otros terceros.

El usuario utiliza Farmi bajo su propia responsabilidad y reconoce el carácter referencial e informativo de todo su contenido.`,
  },
  {
    title: '7. Uso adecuado e indemnidad',
    body: `El usuario se compromete a usar Farmi de forma lícita, de buena fe y conforme a estas condiciones y a la ley.

El usuario mantendrá indemne a Farmi y a sus desarrolladores frente a cualquier reclamación, queja, sanción o demanda de terceros que se derive del uso indebido de la plataforma o del incumplimiento de estas condiciones por parte del usuario.`,
  },
  {
    title: '8. Gratuidad del servicio',
    body: `El uso básico de Farmi es gratuito para los usuarios. No intervenimos en el precio que paga el usuario al momento de comprar en una farmacia.

La plataforma puede incorporar modelos de monetización en el futuro, los cuales serán claramente identificados como tal.`,
  },
  {
    title: '9. Propiedad intelectual',
    body: `Los nombres, logotipos y marcas de las farmacias y laboratorios listados son propiedad de sus respectivos dueños y se utilizan únicamente con fines referenciales, identificativos e informativos (uso nominativo). Farmi no reclama derechos sobre dichas marcas, y su uso no implica afiliación, asociación, patrocinio ni respaldo entre Farmi y dichos titulares.

El diseño, código y contenido propio de Farmi son propiedad de sus desarrolladores.`,
  },
  {
    title: '10. Privacidad de datos',
    body: `Farmi no solicita datos personales sensibles para el uso básico de la plataforma. En caso de registro voluntario, los datos proporcionados se utilizan únicamente para funcionalidades como guardar favoritos o historial de búsquedas, y no son compartidos con terceros con fines comerciales.

El tratamiento de datos personales se rige por nuestra Política de privacidad, disponible en farmi.com.co/privacidad, conforme a la Ley 1581 de 2012 (Habeas Data, Colombia).`,
  },
  {
    title: '11. Ley aplicable y resolución de controversias',
    body: `Estas condiciones se rigen e interpretan conforme a las leyes de la República de Colombia, incluyendo el Estatuto del Consumidor (Ley 1480 de 2011) y la Ley 1581 de 2012 sobre protección de datos personales.

Cualquier controversia derivada del uso de la plataforma se procurará resolver de buena fe y de manera directa; en su defecto, se someterá a la jurisdicción de los jueces y autoridades competentes de Colombia.`,
  },
  {
    title: '12. Modificaciones',
    body: `Farmi se reserva el derecho de modificar estas condiciones en cualquier momento. Los cambios se publicarán en esta misma página. El uso continuado de la plataforma después de una modificación implica la aceptacion de los nuevos términos.`,
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
          Última actualización: junio de 2026
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 sm:p-6 mb-8">
        <p className="text-[13px] font-bold text-primary mb-1">En resumen</p>
        <ul className="space-y-2 mt-3">
          {[
            'Farmi solo compara precios: no vende, no ofrece ni dispensa medicamentos, y no cobra nada.',
            'No hacemos publicidad ni promovemos el consumo de medicamentos; mostramos información solo cuando tu la buscas.',
            'Mostramos los precios de lista (públicos) de cada farmacia, no son nuestros y no incluyen descuentos por afiliaciones. Verificalos antes de comprar.',
            'La información médica es educativa y no reemplaza al médico. La usas bajo tu responsabilidad.',
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
          href="/#search-input"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#c1c6d7]/50 bg-white/60 text-[13px] font-semibold text-[#414755] hover:bg-white/80 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          Buscar medicamentos
        </Link>
      </div>
    </div>
  )
}
