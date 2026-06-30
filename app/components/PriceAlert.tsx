'use client'

import { useState } from 'react'
import { formatCOP } from '@/app/utils/format'

type Channel = 'email' | 'whatsapp'
type Status = 'idle' | 'sending' | 'done' | 'error'

interface Props {
  /** normalized query (lowercase, no accents) */
  query: string
  /** human-readable medication label */
  label: string
  /** current lowest price in COP (stored so we can detect a real drop) */
  currentPrice: number | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// "Avísame si baja de precio": minimal capture of email OR WhatsApp (user picks
// one). No native <form> — pure onClick/onChange handlers. Stores medication,
// current price and channel via /api/price-alerts for later processing.
export function PriceAlert({ query, label, currentPrice }: Props) {
  const [open, setOpen] = useState(false)
  const [channel, setChannel] = useState<Channel>('email')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const trimmed = contact.trim()
  const valid =
    channel === 'email'
      ? EMAIL_RE.test(trimmed)
      : trimmed.replace(/\D/g, '').length >= 7

  async function submit() {
    if (!valid || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, label, price: currentPrice, channel, contact: trimmed }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error ?? 'error')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  function switchChannel(c: Channel) {
    setChannel(c)
    setContact('')
    if (status === 'error') setStatus('idle')
  }

  if (status === 'done') {
    return (
      <div className="flex items-start gap-3 bg-secondary/10 border border-secondary/20 rounded-2xl p-4">
        <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-secondary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-[14px] font-bold text-[#1a1b1f]">Listo, te avisaremos</p>
          <p className="text-[12px] text-[#717786] mt-0.5">
            Te escribiremos por {channel === 'email' ? 'correo' : 'WhatsApp'} solo cuando el precio de{' '}
            <span className="font-semibold text-[#414755]">{label}</span> baje. Sin spam.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-[#1a1b1f] leading-snug">Avísame si baja de precio</p>
          <p className="text-[12px] text-[#717786] mt-0.5">
            {currentPrice
              ? <>Hoy lo más barato está en {formatCOP(currentPrice)}. Te avisamos si baja.</>
              : 'Te avisamos cuando encontremos un precio más bajo.'}
          </p>
        </div>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 text-[12px] font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
          >
            Activar
          </button>
        )}
      </div>

      {open && (
        <div className="mt-4">
          {/* Elegir canal: email o WhatsApp (uno solo) */}
          <div className="flex bg-black/[0.05] rounded-lg p-0.5 mb-3">
            {(['email', 'whatsapp'] as Channel[]).map((c) => (
              <button
                key={c}
                onClick={() => switchChannel(c)}
                className={`flex-1 text-[12px] font-semibold py-2 rounded-md transition-all cursor-pointer ${
                  channel === c ? 'bg-white text-[#1a1b1f] shadow-sm' : 'text-[#717786]'
                }`}
              >
                {c === 'email' ? 'Correo' : 'WhatsApp'}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type={channel === 'email' ? 'email' : 'tel'}
              inputMode={channel === 'email' ? 'email' : 'tel'}
              value={contact}
              onChange={(e) => {
                setContact(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
              placeholder={channel === 'email' ? 'tu@correo.com' : 'Ej: 300 123 4567'}
              aria-label={channel === 'email' ? 'Tu correo' : 'Tu número de WhatsApp'}
              autoFocus
              className="flex-1 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] text-[#1a1b1f] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-0"
            />
            <button
              onClick={submit}
              disabled={!valid || status === 'sending'}
              className="px-4 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer whitespace-nowrap"
            >
              {status === 'sending' ? 'Guardando...' : 'Avisarme'}
            </button>
          </div>

          <p className="text-[11px] text-[#717786] mt-2.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-secondary shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            Sin spam. Solo te escribimos cuando el precio baje.
          </p>

          {status === 'error' && (
            <p className="text-[12px] text-red-500 mt-2">
              No pudimos guardar tu alerta. Revisa el dato e intenta de nuevo.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
