'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { WishlistItem } from '@/app/types'
import { useAuth } from '@/app/context/AuthContext'
import {
  getWishlistDB, removeFromWishlistDB, WISHLIST_EVENT,
} from '@/app/utils/wishlist'
import { formatCOP } from '@/app/utils/format'
import { thumbnailUrl } from '@/app/utils/imageUrl'
import { MedicationImage } from '@/app/components/MedicationImage'
import { ListComparison } from '@/app/components/ListComparison'
import { BrandLoader } from '@/app/components/BrandLoader'

function ItemImage({ imageUrl, ingredient }: { imageUrl?: string; ingredient: string }) {
  const [failed, setFailed] = useState(false)
  if (imageUrl && !failed) {
    return (
      <div className="w-full h-[90px] bg-white overflow-hidden rounded-t-xl">
        <img
          src={thumbnailUrl(imageUrl, 120)}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="w-full h-full object-contain p-2"
        />
      </div>
    )
  }
  return <MedicationImage ingredient={ingredient} height={90} />
}

export default function ListaClient() {
  const { user, loading: authLoading } = useAuth()
  const [items,     setItems]     = useState<WishlistItem[]>([])
  const [dbLoading, setDbLoading] = useState(false)
  const [mounted,   setMounted]   = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || authLoading) return
    if (user) {
      setDbLoading(true)
      getWishlistDB().then(setItems).finally(() => setDbLoading(false))
    } else {
      setItems([])
    }
  }, [user, authLoading, mounted])

  async function remove(id: string) {
    if (user) await removeFromWishlistDB(id)
    setItems(prev => prev.filter(i => i.id !== id))
    window.dispatchEvent(new Event(WISHLIST_EVENT()))
  }

  if (!mounted || authLoading) return null

  // Not logged in
  if (!user) {
    return (
      <section className="mx-auto px-4 sm:px-5 max-w-lg pt-16 pb-16 flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-2xl glass-card rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-[#c1c6d7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>
        <div>
          <p className="text-[18px] font-bold text-[#1a1b1f] mb-1">Necesitas una cuenta</p>
          <p className="text-[13px] text-[#717786]">
            Crea una cuenta gratuita para guardar medicamentos y acceder a tu lista desde cualquier dispositivo.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/register"
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity">
            Crear cuenta
          </Link>
          <Link href="/login"
            className="px-5 py-2.5 bg-white/70 border border-white/50 text-[#414755] text-[14px] font-semibold rounded-xl hover:bg-white/90 transition-all">
            Iniciar sesión
          </Link>
        </div>
      </section>
    )
  }

  if (dbLoading) {
    return (
      <div className="mx-auto px-4 sm:px-5 max-w-5xl pt-16 flex justify-center">
        <BrandLoader />
      </div>
    )
  }

  const total   = items.reduce((s, i) => s + i.price, 0)
  const savings = items.reduce((s, i) =>
    i.referencePrice && i.referencePrice > i.price ? s + (i.referencePrice - i.price) : s, 0
  )

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl pt-8 pb-16">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-[#1a1b1f] tracking-tight">
            Lista de medicamentos
          </h1>
          <p className="text-[13px] text-[#717786] mt-0.5">
            {items.length > 0
              ? `${items.length} medicamento${items.length !== 1 ? 's' : ''} guardado${items.length !== 1 ? 's' : ''}`
              : 'Guarda los medicamentos que quieres seguir'}
          </p>
        </div>
        {items.length > 0 && (
          <Link href="/"
            className="text-[13px] font-semibold text-primary hover:opacity-75 transition-opacity whitespace-nowrap">
            + Agregar más
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-5">
          <img
            src="/fotos/loratadina-monedas.webp"
            alt="Caja de loratadina 10 mg junto a monedas colombianas"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className="w-56 h-40 object-cover rounded-2xl border border-white/50 shadow-sm"
          />
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[#1a1b1f] mb-1">Tu lista esta vacia</p>
            <p className="text-[13px] text-[#717786]">
              Busca un medicamento y toca el corazon para guardarlo aquí
            </p>
          </div>
          <Link href="/"
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity">
            Buscar medicamentos
          </Link>
        </div>
      ) : (
        <>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Card grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id}
                className="group flex flex-col glass-card glass-card-hover rounded-2xl transition-all duration-300 overflow-hidden">

                <ItemImage imageUrl={item.imageUrl} ingredient={item.activeIngredient} />

                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.type === 'generic'
                          ? 'bg-secondary/10 text-secondary border border-secondary/20'
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {item.type === 'generic' ? 'Genérico' : 'Marca'}
                      </span>
                      <button onClick={() => remove(item.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-[#c1c6d7] hover:text-red-400 hover:bg-red-50/60 transition-all cursor-pointer shrink-0"
                        aria-label="Quitar">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                    </div>
                    <p className="font-semibold text-[13px] text-[#1a1b1f] leading-snug line-clamp-2">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-[#717786] mt-0.5">{item.pharmacy}</p>
                    {(item.activeIngredient || item.concentration) && (
                      <p className="text-[11px] text-[#c1c6d7] mt-0.5">
                        {item.activeIngredient} {item.concentration}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-2 border-t border-white/40">
                    <p className="text-[20px] font-bold text-[#1a1b1f] tabular-nums leading-none mb-2.5">
                      {formatCOP(item.price)}
                    </p>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white text-[12px] font-semibold hover:opacity-90 transition-opacity">
                        Comprar en {item.pharmacy}
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                        </svg>
                      </a>
                    ) : (
                      <Link href={`/buscar?q=${encodeURIComponent(item.activeIngredient || item.productName)}`}
                        className="w-full flex items-center justify-center py-2 rounded-lg bg-white/60 border border-white/40 text-[12px] font-semibold text-primary hover:bg-white/90 transition-all">
                        Ver precios actuales
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="w-full lg:w-64 shrink-0 glass-card rounded-2xl p-5 sticky top-20">
            <h2 className="text-[14px] font-bold text-[#1a1b1f] mb-4">Resumen</h2>
            <div className="flex flex-col gap-2 mb-4">
              {items.map(i => (
                <div key={i.id} className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-[#414755] truncate flex-1">{i.productName}</p>
                  <p className="text-[11px] font-semibold text-[#1a1b1f] tabular-nums shrink-0">{formatCOP(i.price)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/40 pt-3 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#414755]">Total estimado</p>
              <p className="text-[16px] font-bold text-[#1a1b1f] tabular-nums">{formatCOP(total)}</p>
            </div>

            {/* Savings callout */}
            {savings > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <svg className="w-4 h-4 text-secondary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1m0-12V4m0 16v-1" />
                  </svg>
                  <p className="text-[11px] font-bold text-secondary">Has ahorrado</p>
                </div>
                <p className="text-[22px] font-black text-secondary tabular-nums leading-tight">
                  {formatCOP(savings)}
                </p>
                <p className="text-[10px] text-secondary/70 mt-0.5">
                  al elegir el precio más bajo frente al precio de referencia
                </p>
              </div>
            )}

            <p className="text-[10px] text-[#c1c6d7] mt-3">
              Los precios pueden variar. Verifica en cada farmacia.
            </p>
          </div>
        </div>

        {/* Comparación consolidada: total por farmacia (pacientes crónicos) */}
        <ListComparison items={items} />
        </>
      )}
    </section>
  )
}
