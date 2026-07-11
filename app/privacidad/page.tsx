import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Conoce como Farmi recopila, usa y protege tus datos personales conforme a la Ley 1581 de 2012 (Habeas Data) de Colombia.',
}

const SECTIONS = [
  {
    title: '1. Responsable del tratamiento',
    body: `Farmi (en adelante "la Plataforma") es responsable del tratamiento de los datos personales recolectados a través de farmi.com.co.

Para ejercer tus derechos o hacer consultas sobre privacidad, puedes contactarnos en: farmicolombia@gmail.com`,
  },
  {
    title: '2. Marco legal',
    body: `Esta política se rige por la Ley Estatutaria 1581 de 2012 de Colombia (Protección de Datos Personales), el Decreto 1377 de 2013 y demas normas concordantes sobre Habeas Data.`,
  },
  {
    title: '3. Datos que recolectamos',
    body: `Uso anonimo (sin registro):
- No recolectamos datos personales identificables.
- Podemos usar cookies tecnicas anonimas para el funcionamiento de la plataforma (por ejemplo, preferencias de búsqueda guardadas en tu dispositivo).

Uso con registro (cuenta):
- Correo electrónico: para autenticación e identificación de la cuenta.
- Historial de búsquedas y favoritos: almacenados en tu cuenta para funcionalidades de la plataforma.
- Fecha y hora de registro.

NO recolectamos datos sensibles (salud, finanzas, biometria, etc.).`,
  },
  {
    title: '4. Finalidades del tratamiento',
    body: `Tratamos tus datos únicamente para:
- Crear y gestionar tu cuenta de usuario.
- Permitirte guardar medicamentos en favoritos y listas de compra.
- Enviarte notificaciones de precio si las activas voluntariamente.
- Mejorar el servicio mediante análisis agregados y anonimizados.

No usamos tus datos para publicidad de terceros ni los vendemos.`,
  },
  {
    title: '5. Comparticion de datos',
    body: `No compartimos tus datos personales con terceros, salvo:
- Proveedores de infraestructura tecnica (Supabase, Vercel) bajo contratos de confidencialidad y conforme a sus políticas de privacidad.
- Cuando sea exigido por autoridad competente colombiana conforme a la ley.

Las farmacias listadas en la plataforma son negocios independientes. No compartimos tu información con ellas.`,
  },
  {
    title: '6. Tus derechos (Habeas Data)',
    body: `Conforme a la Ley 1581 de 2012 tienes derecho a:
- Conocer los datos personales que tenemos sobre ti.
- Actualizarlos o corregirlos si están desactualizados o son inexactos.
- Solicitar su eliminación cuando consideres que no hay causa legal para su tratamiento.
- Revocar la autorización de tratamiento.
- Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).

Para ejercer cualquiera de estos derechos escribe a farmicolombia@gmail.com con el asunto "Habeas Data - [tu nombre]". Responderemos en un plazo máximo de 10 días hábiles.`,
  },
  {
    title: '7. Almacenamiento y seguridad',
    body: `Tus datos se almacenan en servidores seguros operados por Supabase con cifrado en transito (TLS) y en reposo. Aplicamos medidas tecnicas y organizativas razonables para proteger tu información.

Conservamos los datos de cuenta mientras la cuenta este activa. Si eliminas tu cuenta, eliminamos o anonimizamos tus datos en un plazo de 30 días.`,
  },
  {
    title: '8. Cookies y almacenamiento local',
    body: `Usamos almacenamiento local del navegador (localStorage) para:
- Guardar temporalmente el historial de búsquedas en tu dispositivo (no en nuestros servidores).
- Guardar preferencias de la interfaz (como si cerraste el aviso de disclaimer médico).

No utilizamos cookies de seguimiento o publicidad de terceros.`,
  },
  {
    title: '9. Menores de edad',
    body: `Farmi no está dirigida a menores de 14 años. Si eres menor, requieres autorización de un adulto para registrarte. Si detectamos que un menor se ha registrado sin autorización, eliminaremos la cuenta.`,
  },
  {
    title: '10. Cambios en esta política',
    body: `Podemos actualizar esta política para reflejar cambios legales o en el servicio. La fecha de actualización aparece al inicio de este documento. El uso continuado de la plataforma implica la aceptacion de los cambios.`,
  },
]

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5 py-8 sm:py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#717786] mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-[#1a1b1f] font-medium">Política de privacidad</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] sm:text-[30px] font-bold text-[#1a1b1f] tracking-tight">
          Política de privacidad
        </h1>
        <p className="text-[13px] text-[#717786] mt-2">
          Última actualización: junio de 2026. Conforme a la Ley 1581 de 2012 de Colombia.
        </p>
      </div>

      {/* Resumen */}
      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 sm:p-6 mb-8">
        <p className="text-[13px] font-bold text-primary mb-3">Resumen rápido</p>
        <ul className="space-y-2">
          {[
            'Sin cuenta no guardamos ningún dato personal tuyo.',
            'Con cuenta solo guardamos tu correo y tus favoritos. Nada más.',
            'No vendemos tus datos ni los compartimos con anunciantes.',
            'Puedes pedir que eliminemos tu cuenta y datos en cualquier momento.',
          ].map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-[13px] text-[#414755]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="glass-card rounded-2xl p-5 sm:p-6"
          >
            <h2 className="text-[14px] font-bold text-[#1a1b1f] mb-3">{s.title}</h2>
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

      {/* Contacto Habeas Data */}
      <div className="mt-8 bg-secondary/5 border border-secondary/15 rounded-2xl p-5 sm:p-6">
        <h2 className="text-[14px] font-bold text-secondary mb-2">Ejercer tus derechos</h2>
        <p className="text-[13px] text-[#414755] leading-relaxed mb-3">
          Para consultas, actualizaciones o solicitudes de eliminación de datos personales (Habeas Data):
        </p>
        <a
          href="mailto:farmicolombia@gmail.com?subject=Habeas%20Data"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-secondary hover:opacity-75 transition-opacity"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          farmicolombia@gmail.com
        </a>
        <p className="text-[11px] text-[#717786] mt-2">
          Asunto del correo: &quot;Habeas Data - [tu nombre]&quot; · Plazo de respuesta: 10 días hábiles.
        </p>
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
          href="/terminos"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#c1c6d7]/50 bg-white/60 text-[13px] font-semibold text-[#414755] hover:bg-white/80 transition-all"
        >
          Condiciones del sitio
        </Link>
        <Link
          href="/contacto"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#c1c6d7]/50 bg-white/60 text-[13px] font-semibold text-[#414755] hover:bg-white/80 transition-all"
        >
          Contacto
        </Link>
      </div>
    </div>
  )
}
