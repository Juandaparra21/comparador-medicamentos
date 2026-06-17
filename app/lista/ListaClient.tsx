'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { WishlistItem } from '@/app/types'
import { useAuth } from '@/app/context/AuthContext'
import {
  getWishlist, removeFromWishlist, WISHLIST_EVENT,
  getWishlistDB, removeFromWishlistDB,
} from '@/app/utils/wishlist'
import { formatCOP } from '@/app/utils/format'
import { MedicationImage } from '@/app/components/MedicationImage'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const min  = Math.floor(diff / 60_000)
  if (min < 1) return 'Ahora mismo'
  if (min < 60) return `Hace ${min} min`
  const hrs = Math.floor(min / 60)
  if (hrs < 24) return `Hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `Hace ${days} dia${days !== 1 ? 's' : ''}`
}

export default function ListaClient() {
  const { user, loading: authLoading } = useAuth()
  const [items,     setItems]     = useState<WishlistItem[]>([])
  const [dbLoading, setDbLoading] = useState(false)
  const [mounted,   setMounted]   = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    if (user) {
      setDbLoading(true)
      getWishlistDB()
        .then(rows => setItems(rows))
        .finally(() => setDbLoading(false))
    } else if (!authLoading) {
      const sync = () => setItems(getWishlist().sort((a, b) => b.addedAt - a.addedAt))
      sync()
      window.addEventListener(WISHLIST_EVENT(), sync)
      window.addEventListener('storage', sync)
      return () => {
        window.removeEventListener(WISHLIST_EVENT(), sync)
        window.removeEventListener('storage', sync)
      }
    }
  }, [user, authLoading, mounted])

  async function remove(id: string) {
    if (user) {
      await removeFromWishlistDB(id)
    } else {
      removeFromWishlist(id)
    }
    setItems(prev => prev.filter(i => i.id !== id))
  }

  if (!mounted || authLoading) return null
  if (dbLoading) {
    return (
      <div className="mx-auto px-4 sm:px-5 max-w-5xl pt-16 flex justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-5xl pt-8 pb-16">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-[#1a1b1f] tracking-tight">
            Lista de deseos
          </h1>
          <p className="text-[13px] text-[#717786] mt-0.5">
            {items.length > 0
              ? `${items.length} medicamento${items.length !== 1 ? 's' : ''} guardado${items.length !== 1 ? 's' : ''}`
              : 'Guarda los medicamentos que quieres seguir'}
          </p>
        </div>
        {items.length > 0 && (
          <Link href="/buscar?q="
            className="text-[13px] font-semibold text-primary hover:opacity-75 transition-opacity whitespace-nowrap">
            + Agregar mas
          </Link>
        )}
      </div>

      {!user && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15 flex items-center gap-3">
          <svg className="w-4 h-4 text-primary shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          <p className="text-[12px] text-[#414755]">
            <Link href="/login" className="font-semibold text-primary hover:opacity-75">Inicia sesion</Link>
            {' '}para guardar tu lista permanentemente y acceder desde cualquier dispositivo.
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/70 backdrop-blur-[20px] border border-white/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#c1c6d7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[#1a1b1f] mb-1">Tu lista esta vacia</p>
            <p className="text-[13px] text-[#717786]">
              Haz clic en el corazon de cualquier medicamento para guardarlo aqui
            </p>
          </div>
          <Link href="/"
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity">
            Buscar medicamentos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id}
              className="group flex flex-col bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-xl shadow-sm hover:bg-white/85 hover:shadow-[0_8px_32px_rgba(0,88,188,0.10)] transition-all duration-300 overflow-hidden">
              <MedicationImage ingredient={item.activeIngredient} height={70} />

              <div className="p-4 flex flex-col gap-2.5 flex-1">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[14px] text-[#1a1b1f] leading-snug">
                      {item.productName}
                    </p>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.type === 'generic'
                        ? 'bg-secondary/10 text-secondary border border-secondary/20'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {item.type === 'generic' ? 'Generico' : 'Marca'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#717786] mt-0.5">{item.pharmacy}</p>
                  <p className="text-[11px] text-[#c1c6d7] mt-0.5">
                    {item.activeIngredient} {item.concentration}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/40">
                  <div>
                    <p className="text-[18px] font-bold text-[#1a1b1f] tabular-nums leading-none">
                      {formatCOP(item.price)}
                    </p>
                    <p className="text-[10px] text-[#c1c6d7] mt-0.5">{timeAgo(item.addedAt)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="text-[12px] font-semibold text-primary hover:opacity-75 transition-opacity">
                        Comprar
                      </a>
                    ) : (
                      <Link href={`/buscar?q=${encodeURIComponent(item.activeIngredient)}`}
                        className="text-[12px] font-semibold text-primary hover:opacity-75 transition-opacity">
                        Ver precios
                      </Link>
                    )}
                    <button onClick={() => remove(item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-[#c1c6d7] hover:text-red-400 hover:bg-red-50/60 transition-all cursor-pointer"
                      aria-label="Quitar de la lista">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
