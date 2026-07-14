import { ImageResponse } from 'next/og'
import { getDiscountPool, selectDailyFeatured } from '@/app/lib/discounts'
import { formatCOP } from '@/app/utils/format'
import type { PharmacyResult } from '@/app/types'

// Imagen 16:9 (1920x1080) con los 3 descuentos del dia, lista para publicar
// en Instagram. Usa la MISMA seleccion diaria que la seccion "Descuentos
// destacados" de la portada, asi el post y el sitio siempre coinciden.
//
// Contrato: GET /api/ig/descuentos -> image/png 1920x1080.
// Sin parametros. Cambia sola cada medianoche (hora Bogota).

export const maxDuration = 30

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function todayBogota(): string {
  const d = new Date(Date.now() - 5 * 3_600_000)
  return `${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]}`
}

// Satori aborta todo el render si un <img> remoto falla; por eso las fotos se
// bajan aqui con timeout y la tarjeta cae a un placeholder si alguna no llega.
async function toDataUri(url: string | undefined | null): Promise<string | null> {
  if (!url) return null
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5_000) })
    if (!res.ok) return null
    const type = res.headers.get('content-type') ?? 'image/jpeg'
    if (!type.startsWith('image/')) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length > 3_000_000) return null
    return `data:${type};base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

// Hanken Grotesk (la fuente del sitio) en TTF para satori. Cache en modulo:
// se baja una vez por instancia. Si Google Fonts falla, satori usa su fuente
// por defecto y la imagen sale igual.
let fontCache: { regular: ArrayBuffer; black: ArrayBuffer } | null = null
async function loadFonts() {
  if (fontCache) return fontCache
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;900',
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)' } }, // UA viejo => TTF
    ).then((r) => r.text())
    const urls = [...css.matchAll(/src: url\((.+?)\)/g)].map((m) => m[1])
    if (urls.length < 2) return null
    const [regular, black] = await Promise.all(
      urls.slice(0, 2).map((u) => fetch(u).then((r) => r.arrayBuffer())),
    )
    fontCache = { regular, black }
    return fontCache
  } catch {
    return null
  }
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s
}

function Card({ item, img }: { item: PharmacyResult; img: string | null }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 500,
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 32,
        border: '2px solid rgba(0,88,188,0.12)',
        boxShadow: '0 24px 48px rgba(0,40,90,0.10)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 280,
          background: '#ffffff',
          position: 'relative',
        }}
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" style={{ maxWidth: 420, maxHeight: 240, objectFit: 'contain' }} />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 160,
              height: 160,
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #0058bc22, #4c4aca22)',
              fontSize: 72,
              color: '#0058bc',
              fontWeight: 900,
            }}
          >
            {item.activeIngredient.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 20,
            left: 20,
            background: '#ef4444',
            color: '#ffffff',
            fontSize: 40,
            fontWeight: 900,
            padding: '8px 22px',
            borderRadius: 16,
          }}
        >
          -{item.discount}%
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', padding: '28px 32px 32px', gap: 6 }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 900, color: '#1a1b1f', lineHeight: 1.2 }}>
          {truncate(item.productName, 52)}
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#717786' }}>{item.pharmacy}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 10 }}>
          {item.referencePrice ? (
            <div style={{ display: 'flex', fontSize: 28, color: '#9aa0b0', textDecoration: 'line-through' }}>
              {formatCOP(item.referencePrice)}
            </div>
          ) : null}
          <div style={{ display: 'flex', fontSize: 46, fontWeight: 900, color: '#006e28' }}>
            {formatCOP(item.price)}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function GET() {
  const pool = await getDiscountPool()
  if (pool.length === 0) {
    return new Response('Sin descuentos frescos hoy', { status: 404 })
  }
  const top3 = selectDailyFeatured(pool, 3)
  const [images, fonts] = await Promise.all([
    Promise.all(top3.map((i) => toDataUri(i.imageUrl))),
    loadFonts(),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(160deg, #eef4fd 0%, #ffffff 45%, #e9f7ee 100%)',
          fontFamily: 'Hanken Grotesk',
          padding: '56px 72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 56, fontWeight: 900, color: '#0058bc' }}>Farmi</div>
            <div style={{ display: 'flex', fontSize: 64, fontWeight: 900, color: '#1a1b1f', marginTop: 4 }}>
              Los 3 descuentos de hoy
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              color: '#0058bc',
              background: 'rgba(0,88,188,0.08)',
              border: '2px solid rgba(0,88,188,0.18)',
              borderRadius: 9999,
              padding: '12px 32px',
              fontWeight: 900,
            }}
          >
            {todayBogota()}
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 36, justifyContent: 'center' }}>
          {top3.map((item, i) => (
            <Card key={item.id} item={item} img={images[i]} />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            fontSize: 28,
            color: '#717786',
          }}
        >
          <div style={{ display: 'flex' }}>Precios referenciales tomados en línea de cada farmacia</div>
          <div style={{ display: 'flex', fontWeight: 900, color: '#0058bc', fontSize: 34 }}>www.farmi.com.co</div>
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
      fonts: fonts
        ? [
            { name: 'Hanken Grotesk', data: fonts.regular, weight: 400 as const },
            { name: 'Hanken Grotesk', data: fonts.black, weight: 900 as const },
          ]
        : undefined,
    },
  )
}
