import { getAdminClient } from '@/app/lib/supabase/admin'
import { searchAllPharmacies } from '@/app/lib/scrapers'
import { sendEmail, sendWhatsapp } from '@/app/lib/notify'
import { formatCOP } from '@/app/utils/format'
import { SITE_URL } from '@/app/lib/siteUrl'

// Processes pending price alerts: for each saved request we re-check the current
// lowest price and, when it dropped below the price captured at sign-up, reach out
// through the chosen channel. Alerts are marked notified so we never message twice.

interface AlertRow {
  id: number
  query: string
  label: string
  current_price: number | null
  channel: 'email' | 'whatsapp'
  contact: string
}

interface Drop {
  label: string
  oldPrice: number
  newPrice: number
  pharmacy: string
  link: string
}

async function lowestPrice(query: string): Promise<{ price: number; pharmacy: string } | null> {
  const results = await searchAllPharmacies(query)
  let best: { price: number; pharmacy: string } | null = null
  for (const r of results) {
    if (r.availability === 'unavailable') continue
    if (!best || r.price < best.price) best = { price: r.price, pharmacy: r.pharmacy }
  }
  return best
}

function searchLink(query: string): string {
  return `${SITE_URL}/buscar?q=${encodeURIComponent(query)}`
}

// Copy respects the domain rules: no medical claims, prices are referential, Farmi
// is a comparator (not a seller). Built here so both channels stay consistent.
function emailBody(d: Drop): { subject: string; html: string; text: string } {
  const subject = `Bajo de precio: ${d.label} (${formatCOP(d.newPrice)})`
  const text =
    `El precio de ${d.label} bajo.\n` +
    `Antes: ${formatCOP(d.oldPrice)}  ->  Ahora desde: ${formatCOP(d.newPrice)} en ${d.pharmacy}.\n\n` +
    `Comparar en 6 farmacias: ${d.link}\n\n` +
    `Farmi es un comparador de precios, no una farmacia. Los precios son referenciales ` +
    `y pueden variar por sede y promociones. Recibes este aviso porque activaste una ` +
    `alerta en Farmi.`
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;color:#1a1b1f">` +
    `<h2 style="color:#0058bc;margin:0 0 8px">Bajo de precio</h2>` +
    `<p style="font-size:15px;margin:0 0 12px">El precio de <b>${d.label}</b> bajo.</p>` +
    `<p style="font-size:14px;margin:0 0 16px">` +
    `Antes: <span style="text-decoration:line-through;color:#9ca3af">${formatCOP(d.oldPrice)}</span>` +
    ` &nbsp;&rarr;&nbsp; Ahora desde <b style="color:#10b981">${formatCOP(d.newPrice)}</b> en ${d.pharmacy}.</p>` +
    `<a href="${d.link}" style="display:inline-block;background:#0058bc;color:#fff;text-decoration:none;` +
    `font-weight:bold;padding:10px 18px;border-radius:10px;font-size:14px">Comparar en 6 farmacias</a>` +
    `<p style="font-size:11px;color:#717786;margin:20px 0 0;line-height:1.5">` +
    `Farmi es un comparador de precios, no una farmacia. Los precios son referenciales y pueden ` +
    `variar por sede y promociones. Recibes este aviso porque activaste una alerta en Farmi.</p>` +
    `</div>`
  return { subject, html, text }
}

function whatsappBody(d: Drop): string {
  return (
    `*Farmi* · Bajo de precio\n\n` +
    `${d.label} bajo a *${formatCOP(d.newPrice)}* (antes ${formatCOP(d.oldPrice)}) en ${d.pharmacy}.\n\n` +
    `Compara en 6 farmacias: ${d.link}\n\n` +
    `Precios referenciales. Farmi es un comparador, no una farmacia.`
  )
}

export interface AlertRunResult {
  pending: number
  checked: number
  sent: number
  failed: number
}

export async function processPriceAlerts(): Promise<AlertRunResult> {
  const db = getAdminClient()
  if (!db) return { pending: 0, checked: 0, sent: 0, failed: 0 }

  const { data } = await db
    .from('price_alerts')
    .select('id, query, label, current_price, channel, contact')
    .eq('notified', false)
    .limit(500)

  const alerts = (data ?? []) as AlertRow[]
  if (alerts.length === 0) return { pending: 0, checked: 0, sent: 0, failed: 0 }

  // Re-check each distinct query only once, even if several people watch it.
  const queries = [...new Set(alerts.map((a) => a.query))]
  const lowestByQuery = new Map<string, { price: number; pharmacy: string } | null>()
  for (const q of queries) {
    lowestByQuery.set(q, await lowestPrice(q))
  }

  let sent = 0
  let failed = 0
  for (const a of alerts) {
    const low = lowestByQuery.get(a.query)
    // Can only claim a drop when we know the sign-up price and today's price is lower.
    if (!low || a.current_price == null || low.price >= a.current_price) continue

    const drop: Drop = {
      label: a.label || a.query,
      oldPrice: a.current_price,
      newPrice: low.price,
      pharmacy: low.pharmacy,
      link: searchLink(a.label || a.query),
    }

    let result
    if (a.channel === 'email') {
      const { subject, html, text } = emailBody(drop)
      result = await sendEmail(a.contact, subject, html, text)
    } else {
      result = await sendWhatsapp(a.contact, whatsappBody(drop))
    }

    if (result.ok) {
      await db.from('price_alerts').update({ notified: true }).eq('id', a.id)
      sent++
    } else {
      failed++
    }
  }

  return { pending: alerts.length, checked: queries.length, sent, failed }
}
