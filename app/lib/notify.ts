import nodemailer, { type Transporter } from 'nodemailer'

// Outbound notifications for price alerts. Both channels no-op (return ok:false
// with a reason) when their env is missing, so the app builds and runs without
// credentials; nothing is ever logged that could leak a personal contact.

export interface SendResult {
  ok: boolean
  error?: string
}

// ── Email (Gmail SMTP via an app password) ──────────────────────────────────
const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

let transporter: Transporter | null = null
function mailer(): Transporter | null {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    })
  }
  return transporter
}

export function emailConfigured(): boolean {
  return Boolean(GMAIL_USER && GMAIL_APP_PASSWORD)
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string,
): Promise<SendResult> {
  const t = mailer()
  if (!t) return { ok: false, error: 'email_not_configured' }
  try {
    await t.sendMail({ from: `Farmi <${GMAIL_USER}>`, to, subject, html, text })
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

// ── WhatsApp (Twilio REST API, no SDK) ──────────────────────────────────────
const TW_SID = process.env.TWILIO_ACCOUNT_SID
const TW_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TW_FROM = process.env.TWILIO_WHATSAPP_FROM // e.g. "whatsapp:+14155238886" (sandbox)

export function whatsappConfigured(): boolean {
  return Boolean(TW_SID && TW_TOKEN && TW_FROM)
}

/**
 * Turns a raw Colombian contact into a Twilio WhatsApp address.
 *   "300 123 4567"   → "whatsapp:+573001234567"  (adds +57)
 *   "573001234567"   → "whatsapp:+573001234567"
 *   "+57 300..."     → "whatsapp:+573001234567"
 * Returns null when there are too few digits to be a real number.
 */
export function toWhatsappAddress(raw: string): string | null {
  let digits = raw.replace(/\D/g, '').replace(/^0+/, '')
  if (digits.length === 10 && digits.startsWith('3')) digits = '57' + digits
  if (digits.length < 10) return null
  return `whatsapp:+${digits}`
}

export async function sendWhatsapp(to: string, body: string): Promise<SendResult> {
  if (!TW_SID || !TW_TOKEN || !TW_FROM) return { ok: false, error: 'whatsapp_not_configured' }
  const addr = toWhatsappAddress(to)
  if (!addr) return { ok: false, error: 'invalid_phone' }
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TW_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${TW_SID}:${TW_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: TW_FROM, To: addr, Body: body }),
    })
    if (!res.ok) {
      const detail = await res.text()
      return { ok: false, error: `twilio_${res.status}: ${detail.slice(0, 200)}` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}
