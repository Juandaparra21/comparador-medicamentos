import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

// Provider-agnostic, OpenAI-compatible chat. Point it at any free-tier provider
// (Groq, OpenRouter, etc.) via env. If no key is set, the client falls back to
// the built-in FAQ tree, so nothing breaks and the owner is never charged.
const AI_KEY      = process.env.AI_API_KEY ?? ''
const AI_BASE_URL = process.env.AI_BASE_URL ?? 'https://api.groq.com/openai/v1'
const AI_MODEL    = process.env.AI_MODEL ?? 'llama-3.1-8b-instant'

const SYSTEM_PROMPT = `Eres el asistente de Farmi, un comparador de precios de medicamentos en Colombia.
Ayudas a las personas a usar la app (buscar un medicamento, entender la diferencia entre generico y de
marca, comparar precios entre Farmatodo, Cruz Verde, Drogas La Rebaja, Olimpica, Colsubsidio, Cafam,
Farmacia Pasteur y Farmacenter, y
ver farmacias cercanas) y puedes ORIENTAR sobre medicamentos de venta libre para molestias leves.

Reglas sobre medicamentos:
- Solo puedes sugerir medicamentos de VENTA LIBRE (sin formula medica) para sintomas leves y comunes:
  dolor de cabeza, fiebre o dolor leve, congestion nasal, tos leve, acidez, alergia leve, colicos leves.
- Sugiere el principio activo de forma general (ej: "acetaminofen", "ibuprofeno", "loratadina") y recuerda
  leer la etiqueta y respetar la dosis maxima del empaque. Si aplica, menciona brevemente una precaucion clave.
- NUNCA recomiendes medicamentos con formula medica (antibioticos, ansioliticos, opioides, corticoides, etc.),
  ni dosis para bebes, ninos, embarazadas o en lactancia: en esos casos pide consultar a un medico o quimico
  farmaceutico.
- Ante senales de alarma (dolor en el pecho, dificultad para respirar, sangrado, fiebre alta, o sintomas que
  duran mas de 3 dias o empeoran) indica acudir a un medico o a urgencias; no sugieras automedicacion.
- SIEMPRE que sugieras o menciones un medicamento, cierra con un aviso breve en primera persona: soy una IA,
  esto no reemplaza la consulta con un medico o quimico farmaceutico, y Farmi no se hace responsable del uso
  de esta informacion.

Reglas generales:
- Responde SIEMPRE en espanol, claro y breve (2 a 5 frases).
- Los precios son referenciales, se obtienen en tiempo real de los sitios de las farmacias y pueden variar;
  recomienda confirmar en la farmacia e invita a usar el buscador de Farmi para comparar precios.
- No inventes precios, farmacias ni datos. Si no sabes algo, dilo.
- No hables de temas ajenos a la app o a la salud y los medicamentos.`

interface ChatMessage { role: 'user' | 'assistant'; content: string }

// Lets the client decide whether to show the AI input or the FAQ tree.
export async function GET() {
  return NextResponse.json({ enabled: Boolean(AI_KEY) })
}

export async function POST(req: NextRequest) {
  if (!AI_KEY) return NextResponse.json({ disabled: true }, { status: 200 })

  let body: { messages?: ChatMessage[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  // Sanitize: only user/assistant turns, trimmed, capped to the last 10.
  const history = (body.messages ?? [])
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))

  if (history.length === 0) return NextResponse.json({ error: 'empty' }, { status: 400 })

  try {
    const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${AI_KEY}`,
      },
      body: JSON.stringify({
        model:       AI_MODEL,
        messages:    [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        temperature: 0.4,
        max_tokens:  400,
      }),
      signal: AbortSignal.timeout(20_000),
    })

    if (!res.ok) {
      console.error('[api/chat] provider', res.status, await res.text().catch(() => ''))
      // 429 = free-tier rate limit; client falls back to FAQ.
      return NextResponse.json({ error: 'provider_error', status: res.status }, { status: 502 })
    }

    const data  = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> }
    const reply = data.choices?.[0]?.message?.content?.trim()
    if (!reply) return NextResponse.json({ error: 'empty_reply' }, { status: 502 })

    return NextResponse.json({ reply })
  } catch (e) {
    console.error('[api/chat]', (e as Error).message)
    return NextResponse.json({ error: 'unreachable' }, { status: 502 })
  }
}
