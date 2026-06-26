'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id:   number
  from: 'bot' | 'user'
  text: string
  ts:   number
}

interface QuickReply {
  label: string
  value: string
}

const INITIAL_REPLIES: QuickReply[] = [
  { label: 'Algo para el dolor de cabeza?', value: 'sintoma'   },
  { label: 'Que es un generico?',           value: 'generico'  },
  { label: 'Como funciona Farmi?',          value: 'como'      },
  { label: 'Que farmacias comparan?',       value: 'farmacias' },
]

const RESPONSES: Record<string, { text: string; replies?: QuickReply[] }> = {
  generico: {
    text: 'Un medicamento generico tiene exactamente el mismo principio activo, dosis y forma farmaceutica que el de marca. Son equivalentes terapeuticamente y en Colombia estan regulados por el INVIMA. La unica diferencia es el precio: los genericos suelen costar entre 30% y 80% menos.',
    replies: [
      { label: 'Como funciona Farmi?',     value: 'como'   },
      { label: 'Ver medicamentos baratos', value: 'buscar' },
    ],
  },
  como: {
    text: 'Escribe el nombre del medicamento en el buscador: puedes usar el nombre generico (ej: ibuprofeno) o el de marca (ej: Advil). Farmi consulta en tiempo real 6 farmacias y muestra los precios de menor a mayor. Si activas tu ubicacion, tambien te mostramos cual farmacia tienes mas cerca.',
    replies: [
      { label: 'Que farmacias comparan?', value: 'farmacias' },
      { label: 'Buscar un medicamento',   value: 'buscar'    },
    ],
  },
  farmacias: {
    text: 'Comparamos precios en tiempo real en 6 farmacias colombianas:\n\n• Drogas La Rebaja\n• Cruz Verde\n• Cafam\n• Colsubsidio\n• Olimpica Drogueria\n• Farmatodo\n\nLos precios se consultan directamente desde cada farmacia cuando buscas.',
    replies: [
      { label: 'El precio es exacto?', value: 'precio' },
      { label: 'Como funciona Farmi?', value: 'como'   },
    ],
  },
  precio: {
    text: 'Los precios son referenciales y se obtienen en tiempo real desde el sitio web de cada farmacia. Pueden variar segun la sede, disponibilidad y promociones del dia. Siempre te recomendamos confirmar el precio final en la farmacia antes de comprar.',
    replies: [
      { label: 'Que es un generico?',     value: 'generico'  },
      { label: 'Que farmacias comparan?', value: 'farmacias' },
    ],
  },
  buscar: {
    text: 'Usa el buscador arriba e intenta con el nombre del principio activo (ej: metformina, losartan, atorvastatina). Si no encuentras resultados, prueba con el nombre de marca o verifica la ortografia.',
    replies: [
      { label: 'El precio es exacto?', value: 'precio' },
      { label: 'Como funciona Farmi?', value: 'como'   },
    ],
  },
  ubicacion: {
    text: 'Puedes activar tu ubicacion con el boton "Mas cercano" en la pagina de resultados, o ver el mapa de farmacias cercanas en la pagina principal. Tu ubicacion nunca se guarda en nuestros servidores.',
    replies: [
      { label: 'Que farmacias comparan?', value: 'farmacias' },
    ],
  },
  sintoma: {
    text: 'Para molestias leves y comunes hay opciones de venta libre. Por ejemplo, para dolor de cabeza o fiebre leve se suele usar acetaminofen, y para dolor o inflamacion, ibuprofeno. Lee siempre la etiqueta y respeta la dosis maxima.\n\nEsto es solo orientativo: soy una IA, no reemplaza la consulta con un medico o quimico farmaceutico y Farmi no se hace responsable. Si los sintomas son fuertes o duran mas de 3 dias, consulta a un medico.',
    replies: [
      { label: 'Buscar un medicamento',   value: 'buscar'    },
      { label: 'Que es un generico?',     value: 'generico'  },
    ],
  },
}

// Keyword fallback used in FAQ mode and when an AI call fails.
function faqAnswer(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('generic'))                          return RESPONSES.generico.text
  if (t.includes('farmacia') || t.includes('compar')) return RESPONSES.farmacias.text
  if (t.includes('precio')   || t.includes('exact'))  return RESPONSES.precio.text
  if (t.includes('ubicac')   || t.includes('cerca'))  return RESPONSES.ubicacion.text
  if (t.includes('buscar')   || t.includes('busqued'))return RESPONSES.buscar.text
  if (t.includes('funciona') || t.includes('usar') || t.includes('como')) return RESPONSES.como.text
  if (/(dolor|fiebre|gripa|gripe|tos|alergia|acidez|congesti|malestar|sintoma|tomar para|que me tomo|recomienda)/.test(t))
    return RESPONSES.sintoma.text
  return 'Puedo ayudarte a buscar medicamentos, comparar precios entre farmacias, encontrar las mas cercanas y orientarte sobre medicamentos de venta libre para molestias leves. Preguntame algo concreto.'
}

function nl2br(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

let msgId = 0
function mkMsg(from: Message['from'], text: string): Message {
  return { id: ++msgId, from, text, ts: Date.now() }
}

export function ChatAssistant() {
  const [open,      setOpen]      = useState(false)
  const [messages,  setMessages]  = useState<Message[]>([
    mkMsg('bot', 'Hola, soy Farmi. Te ayudo a encontrar el medicamento mas barato en Colombia y puedo orientarte sobre medicamentos de venta libre para molestias leves.'),
  ])
  const [replies,   setReplies]   = useState<QuickReply[]>(INITIAL_REPLIES)
  const [bubble,    setBubble]    = useState(true)
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null)
  const [input,     setInput]     = useState('')
  const [sending,   setSending]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setBubble(false), 8_000)
    return () => clearTimeout(t)
  }, [])

  // Check whether the AI backend is configured, on first open.
  useEffect(() => {
    if (!open || aiEnabled !== null) return
    fetch('/api/chat')
      .then((r) => r.json())
      .then((d) => setAiEnabled(Boolean(d.enabled)))
      .catch(() => setAiEnabled(false))
  }, [open, aiEnabled])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [open, messages, sending])

  async function sendToAI(history: Message[]) {
    setSending(true)
    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role:    (m.from === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
            content: m.text,
          })),
        }),
      })
      const data = (await res.json()) as { reply?: string }
      const last = history[history.length - 1]
      setMessages((prev) => [...prev, mkMsg('bot', data.reply ?? faqAnswer(last?.text ?? ''))])
    } catch {
      const last = history[history.length - 1]
      setMessages((prev) => [...prev, mkMsg('bot', faqAnswer(last?.text ?? ''))])
    } finally {
      setSending(false)
    }
  }

  function handleUserText(text: string) {
    const clean = text.trim()
    if (!clean || sending) return
    const userMsg = mkMsg('user', clean)
    const next = [...messages, userMsg]
    setMessages(next)
    setReplies([])
    setInput('')

    if (aiEnabled) {
      sendToAI(next)
    } else {
      setTimeout(() => setMessages((prev) => [...prev, mkMsg('bot', faqAnswer(clean))]), 500)
    }
  }

  function handleReply(reply: QuickReply) {
    if (aiEnabled) { handleUserText(reply.label); return }
    const response = RESPONSES[reply.value]
    if (!response) return
    setMessages((prev) => [...prev, mkMsg('user', reply.label)])
    setReplies([])
    setTimeout(() => {
      setMessages((prev) => [...prev, mkMsg('bot', response.text)])
      setReplies(response.replies ?? [])
    }, 600)
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] max-h-[560px] flex flex-col bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] border border-[#e5e7eb] overflow-hidden"
          role="dialog"
          aria-label="Asistente Farmi"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary to-tertiary text-white shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.124-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold leading-tight">Farmi Asistente</p>
              <p className="text-[11px] text-white/75 leading-tight">{aiEnabled ? 'Asistente con IA' : 'En linea ahora'}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cerrar chat"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-[#f8f9fb]" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.from === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shrink-0 mt-1">
                    <span className="text-white text-[9px] font-bold">F</span>
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-white text-[#1a1b1f] shadow-sm border border-[#e5e7eb] rounded-tl-sm'
                  }`}
                >
                  {nl2br(msg.text)}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shrink-0 mt-1">
                  <span className="text-white text-[9px] font-bold">F</span>
                </div>
                <div className="bg-white border border-[#e5e7eb] shadow-sm rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#c1c6d7] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-[#c1c6d7] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#c1c6d7] rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {replies.length > 0 && (
            <div className="px-3 py-2.5 border-t border-[#f0f1f5] bg-white flex flex-wrap gap-1.5 shrink-0">
              {replies.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleReply(r)}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* Text input — only when the AI backend is enabled */}
          {aiEnabled && (
            <form
              onSubmit={(e) => { e.preventDefault(); handleUserText(input) }}
              className="px-3 py-2.5 border-t border-[#f0f1f5] bg-white flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                aria-label="Escribe tu pregunta"
                disabled={sending}
                className="flex-1 px-3 py-2 bg-[#f5f6fa] border border-[#e5e7eb] rounded-full text-[13px] text-[#1a1b1f] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 min-w-0"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                aria-label="Enviar"
                className="w-9 h-9 shrink-0 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.926A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.085l-1.414 4.926a.75.75 0 00.826.95 28.897 28.897 0 0015.293-7.155.75.75 0 000-1.114A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </button>
            </form>
          )}

          {/* Disclaimer — siempre visible */}
          <div className="px-4 py-2 border-t border-[#f0f1f5] bg-white shrink-0">
            <p className="text-[10px] text-[#9ca3af] text-center leading-snug">
              Asistente con IA, solo orientativo y para medicamentos de venta libre. No reemplaza al medico ni al quimico farmaceutico; Farmi no se hace responsable del uso de esta informacion.
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <div className="fixed bottom-4 right-4 sm:right-6 z-50 flex flex-col items-end gap-2">
        {bubble && !open && (
          <div className="bg-white text-[#1a1b1f] text-[13px] font-semibold px-4 py-2.5 rounded-2xl rounded-br-sm shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[#e5e7eb] max-w-[220px] leading-snug animate-[fadeInUp_0.4s_ease]">
            Encuentra el medicamento mas barato
            <span className="block text-[11px] text-[#717786] font-normal mt-0.5">Te ayudo en segundos</span>
          </div>
        )}

        <button
          onClick={() => { setBubble(false); setOpen((v) => !v) }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-tertiary text-white shadow-[0_8px_24px_rgba(0,88,188,0.35)] hover:shadow-[0_12px_32px_rgba(0,88,188,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          aria-label={open ? 'Cerrar asistente' : 'Abrir asistente Farmi'}
          aria-expanded={open}
        >
          {open ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
