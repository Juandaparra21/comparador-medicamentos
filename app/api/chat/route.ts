import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

// Provider-agnostic, OpenAI-compatible chat. Point it at any free-tier provider
// (Groq, OpenRouter, etc.) via env. If no key is set, the client falls back to
// the built-in FAQ tree, so nothing breaks and the owner is never charged.
const AI_KEY      = process.env.AI_API_KEY ?? ''
const AI_BASE_URL = process.env.AI_BASE_URL ?? 'https://api.groq.com/openai/v1'
const AI_MODEL    = process.env.AI_MODEL ?? 'llama-3.1-8b-instant'

const SYSTEM_PROMPT = `Eres el asistente de Farmi, un comparador de precios de medicamentos en Colombia.
Ayudas a las personas a usar la app: buscar un medicamento, entender la diferencia entre generico y de marca,
comparar precios entre farmacias (Farmatodo, Cruz Verde, Drogas La Rebaja, Olimpica, Colsubsidio, Cafam),
usar la ubicacion para ver farmacias cercanas en el mapa y como llegar.

Reglas estrictas:
- Responde SIEMPRE en espanol, breve y claro (2 a 4 frases).
- NO des consejo medico: no diagnostiques, no recomiendes dosis ni que medicamento tomar para un sintoma.
  Si te lo piden, recuerda con amabilidad que deben consultar a un medico o quimico farmaceutico.
- Los precios son referenciales y se obtienen en tiempo real de los sitios de las farmacias; pueden variar.
  Recomienda confirmar en la farmacia.
- No inventes precios, farmacias, ni datos. Si no sabes algo, dilo y sugiere usar el buscador.
- No hables de temas ajenos a la app o a medicamentos en general.`

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
