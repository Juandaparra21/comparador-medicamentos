import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contacto - MediCompara',
  description:
    'Contacta al equipo de MediCompara para reportar precios incorrectos, sugerir farmacias o resolver dudas sobre la plataforma.',
}

const TOPICS = [
  { icon: '⚠', label: 'Precio incorrecto', desc: 'El precio que ves en nuestra app no coincide con el de la farmacia.' },
  { icon: '🏥', label: 'Sugerir farmacia', desc: 'Quieres que agreguemos una farmacia o drogueria que no esta en la lista.' },
  { icon: '🔒', label: 'Privacidad y datos', desc: 'Solicitud de eliminacion de datos, Habeas Data (Ley 1581/2012).' },
  { icon: '💡', label: 'Sugerencia general', desc: 'Mejoras, errores en la interfaz o cualquier otra inquietud.' },
]

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5 py-8 sm:py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#717786] mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-[#1a1b1f] font-medium">Contacto</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] sm:text-[30px] font-bold text-[#1a1b1f] tracking-tight mb-3">
          Contacto
        </h1>
        <p className="text-[15px] text-[#414755] leading-relaxed">
          Respondemos todos los mensajes en un plazo de 1 a 3 dias habiles.
        </p>
      </div>

      {/* Aviso medico */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
        <p className="text-[12px] text-amber-900 leading-relaxed">
          <strong>Aviso:</strong> No brindamos asesorıa medica ni farmaceutica. Si tienes preguntas
          sobre un medicamento, consulta a un medico o farmaceutico licenciado.
        </p>
      </div>

      {/* Temas */}
      <section className="mb-8">
        <p className="text-[11px] font-bold tracking-widest uppercase text-[#717786] mb-4">
          Para que podemos ayudarte
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOPICS.map((t) => (
            <div
              key={t.label}
              className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-xl shadow-sm p-4"
            >
              <p className="text-[13px] font-bold text-[#1a1b1f] mb-1">{t.label}</p>
              <p className="text-[12px] text-[#414755] leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Email */}
      <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
        <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-4">Escribenos</h2>
        <p className="text-[13px] text-[#414755] leading-relaxed mb-5">
          Envıa tu mensaje directamente a nuestro correo. Incluye el nombre del medicamento y la
          farmacia si tu consulta es sobre un precio especıfico.
        </p>

        <a
          href="mailto:contacto@medicompara.co?subject=Consulta%20MediCompara"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          contacto@medicompara.co
        </a>

        <p className="text-[11px] text-[#717786] mt-4 leading-relaxed">
          Para solicitudes de Habeas Data (eliminacion de datos personales) conforme a la
          Ley 1581 de 2012, incluye en el asunto: <em>Habeas Data - [tu nombre]</em>.
          Atendemos estas solicitudes en un maximo de 10 dias habiles.
        </p>
      </section>

      {/* Precio incorrecto */}
      <section className="bg-primary/5 border border-primary/15 rounded-2xl p-5 sm:p-6 mb-8">
        <h2 className="text-[14px] font-bold text-primary mb-2">Reportar un precio incorrecto</h2>
        <p className="text-[13px] text-[#414755] leading-relaxed mb-3">
          Si el precio que ves en MediCompara no coincide con el que muestra la farmacia, escribenos con:
        </p>
        <ul className="space-y-1.5">
          {[
            'Nombre del medicamento',
            'Nombre de la farmacia',
            'Precio que muestra MediCompara',
            'Precio real en la farmacia (con captura de pantalla si es posible)',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-[12px] text-[#414755]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/sobre-nosotros"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#c1c6d7]/50 bg-white/60 text-[13px] font-semibold text-[#414755] hover:bg-white/80 transition-all"
        >
          Sobre nosotros
        </Link>
        <Link
          href="/privacidad"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#c1c6d7]/50 bg-white/60 text-[13px] font-semibold text-[#414755] hover:bg-white/80 transition-all"
        >
          Politica de privacidad
        </Link>
      </div>
    </div>
  )
}
