import { NextRequest, NextResponse } from 'next/server'
import {
  sendEmail,
  sendWhatsapp,
  emailConfigured,
  whatsappConfigured,
} from '@/app/lib/notify'
import { SITE_URL } from '@/app/lib/siteUrl'

export const runtime = 'nodejs'
export const maxDuration = 30

// Manual test endpoint: sends a real sample price-drop message right now, so the
// owner can confirm the email / WhatsApp channels work end to end without waiting
// for an actual price drop. Protected by CRON_SECRET.
//
//   /api/price-alerts/test?secret=XXX&channel=email&to=tu@correo.com
//   /api/price-alerts/test?secret=XXX&channel=whatsapp&to=3001234567
//
// With no channel/to it just reports which channels are configured.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const provided = req.nextUrl.searchParams.get('secret')
  if (secret && provided !== secret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const configured = { email: emailConfigured(), whatsapp: whatsappConfigured() }

  const channel = req.nextUrl.searchParams.get('channel')
  const to = (req.nextUrl.searchParams.get('to') ?? '').trim()
  if (!channel || !to) {
    return NextResponse.json({ ok: true, configured, hint: 'pasa ?channel=email|whatsapp&to=...' })
  }

  const link = `${SITE_URL}/buscar?q=acetaminofen`

  if (channel === 'email') {
    const subject = 'Prueba de alerta · Farmi'
    const text =
      'Esta es una prueba de las alertas de Farmi. Si la recibes, el correo funciona.\n\n' +
      `Ejemplo: Acetaminofen bajo a $8.400.\nComparar: ${link}\n\n` +
      'Farmi es un comparador de precios, no una farmacia. Precios referenciales.'
    const html =
      `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1a1b1f">` +
      `<h2 style="color:#0058bc;margin:0 0 8px">Prueba de alerta</h2>` +
      `<p style="font-size:15px">Si recibes este correo, el canal de <b>email</b> funciona.</p>` +
      `<p style="font-size:14px">Ejemplo: <b>Acetaminofen</b> bajo a <b style="color:#10b981">$8.400</b>.</p>` +
      `<a href="${link}" style="display:inline-block;background:#0058bc;color:#fff;text-decoration:none;` +
      `font-weight:bold;padding:10px 18px;border-radius:10px;font-size:14px">Comparar en Farmi</a>` +
      `<p style="font-size:11px;color:#717786;margin-top:20px">Farmi es un comparador de precios, ` +
      `no una farmacia. Precios referenciales.</p></div>`
    const result = await sendEmail(to, subject, html, text)
    return NextResponse.json({ ok: result.ok, channel, configured, ...(result.error ? { error: result.error } : {}) })
  }

  if (channel === 'whatsapp') {
    const body =
      '*Farmi* · Prueba de alerta\n\n' +
      'Si recibes este mensaje, el canal de WhatsApp funciona.\n\n' +
      `Ejemplo: Acetaminofen bajo a *$8.400*.\nComparar: ${link}\n\n` +
      'Precios referenciales. Farmi es un comparador, no una farmacia.'
    const result = await sendWhatsapp(to, body)
    return NextResponse.json({ ok: result.ok, channel, configured, ...(result.error ? { error: result.error } : {}) })
  }

  return NextResponse.json({ ok: false, error: 'channel invalido (email|whatsapp)', configured }, { status: 400 })
}
