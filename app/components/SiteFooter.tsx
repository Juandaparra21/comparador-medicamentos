'use client'

import Link from 'next/link'
import { useLang } from '@/app/i18n/LanguageProvider'

// Redes sociales oficiales de Farmi (tambien declaradas como sameAs en el
// JSON-LD de Organization en layout.tsx; mantener ambas listas en sincronia).
const SOCIALS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/farmi_col/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61591334621058',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.2 0-1-.1-1.9-.1-1.9 0-3.3 1.2-3.3 3.4V11H8.5v3h2.7v7h2.3z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@farmi_col',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
        <path d="M16.6 3c.3 1.7 1.5 3 3.4 3.3v2.9c-1.3 0-2.5-.4-3.4-1v6.4c0 3.4-2.4 5.4-5.3 5.4-2.9 0-5.3-2.2-5.3-5.2 0-3 2.4-5.2 5.3-5.2.3 0 .6 0 .9.1v3c-.3-.1-.6-.2-.9-.2-1.3 0-2.3 1-2.3 2.3s1 2.3 2.3 2.3 2.3-.9 2.3-2.4V3h3z" />
      </svg>
    ),
  },
]

export function SiteFooter() {
  const { t } = useLang()
  return (
    <footer className="bg-white/40 backdrop-blur-xl border-t border-white/30 pt-8 pb-24 md:pb-8 px-4" aria-label={t('footer.about')}>
      <div className="mx-auto max-w-5xl">
        {/* Top row: brand + nav links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div>
            <p className="font-bold text-[16px] tracking-tight brand-gradient-text inline-block">
              Farmi
            </p>
            <p className="text-[12px] text-[#717786] mt-1">{t('footer.tagline')}</p>
            <div className="flex items-center gap-2 mt-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Farmi en ${s.name}`}
                  title={`Farmi en ${s.name}`}
                  className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-[#717786] hover:text-primary hover:scale-105 active:scale-95 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={t('footer.about')} className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
            <Link href="/medicamentos-baratos" className="text-[#717786] hover:text-primary transition-colors font-medium">
              {t('footer.cheap')}
            </Link>
            <Link href="/sobre-nosotros" className="text-[#717786] hover:text-primary transition-colors font-medium">
              {t('footer.about')}
            </Link>
            <Link href="/contacto" className="text-[#717786] hover:text-primary transition-colors font-medium">
              {t('footer.contact')}
            </Link>
            <Link href="/terminos" className="text-[#717786] hover:text-primary transition-colors font-medium">
              {t('footer.terms')}
            </Link>
            <Link href="/privacidad" className="text-[#717786] hover:text-primary transition-colors font-medium">
              {t('footer.privacy')}
            </Link>
          </nav>
        </div>

        {/* Disclaimer (legal — se mantiene en español; pendiente traducción revisada) */}
        <div className="border-t border-[#c1c6d7]/30 pt-5">
          <p className="text-[11px] text-[#717786] leading-relaxed">
            <strong className="text-[#414755]">Aviso legal:</strong> Farmi es una plataforma de comparación de precios y no sustituye la asesoría médica o farmacéutica profesional. Los precios mostrados son referenciales, obtenidos de fuentes públicas, y pueden variar. Farmi no vende medicamentos ni interviene en ningún proceso de compra. Las marcas y logos de las farmacias pertenecen a sus respectivos titulares; Farmi es un comparador independiente y no está afiliado ni patrocinado por ellas. Conforme a la Ley 1581 de 2012 puedes ejercer tus derechos de Habeas Data escribiendo a farmicolombia@gmail.com.
          </p>
          <p className="text-[11px] text-[#c1c6d7] mt-3">
            &copy; {new Date().getFullYear()} Farmi. Colombia.
          </p>
        </div>
      </div>
    </footer>
  )
}
