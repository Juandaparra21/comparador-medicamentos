'use client'

import Link from 'next/link'
import { useLang } from '@/app/i18n/LanguageProvider'
import { LanguageSwitcher } from './LanguageSwitcher'

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
          </div>

          <nav aria-label={t('footer.about')} className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
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

        {/* Language switcher */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[12px] font-semibold text-[#717786]">{t('footer.language')}:</span>
          <LanguageSwitcher />
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
