import { ImageResponse } from 'next/og'
import {
  getDiscountPool,
  isPriorityDiscount,
  isKnownOtcDiscount,
  seededShuffle,
  daySeed,
} from '@/app/lib/discounts'
import { formatCOP } from '@/app/utils/format'
import type { PharmacyResult } from '@/app/types'

// Historia de Instagram 9:16 (1080x1920) con los descuentos del dia. Usa la
// MISMA seleccion diaria que la seccion "Descuentos destacados" de la portada
// (rota a las 7:00 am hora Bogota), pero solo muestra ofertas cuya foto de
// producto se pudo descargar, para que la historia siempre salga con imagenes.
//
// Contrato: GET /api/ig/descuentos -> image/png 1080x1920.
// Sin parametros. Cambia sola cada dia a las 7:00 am (hora Bogota).

export const maxDuration = 60

const SLOTS = 7        // filas que caben en 1920px de alto
const CANDIDATES = 36  // se piden de mas porque bastantes fotos no descargan

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function todayBogota(): string {
  const d = new Date(Date.now() - 5 * 3_600_000)
  return `${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]}`
}

// Satori aborta todo el render si un <img> remoto falla; por eso las fotos se
// bajan aqui (con UA de navegador, varias farmacias bloquean clientes anonimos)
// y los productos sin foto descargable se descartan de la historia.
async function toDataUri(url: string | undefined | null): Promise<string | null> {
  if (!url) return null
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6_000),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        // Satori solo dibuja png/jpeg/gif: NO pedir webp/avif aunque pesen menos.
        Accept: 'image/png,image/jpeg,image/gif;q=0.9,*/*;q=0.5',
      },
    })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 100 || buf.length > 3_000_000) return null
    // El mime se detecta por los bytes reales: hay farmacias que sirven JPEG
    // con nombre .png y content-type image/png, y satori lo dibuja en blanco.
    const type =
      buf[0] === 0x89 && buf[1] === 0x50 ? 'image/png'
      : buf[0] === 0xff && buf[1] === 0xd8 ? 'image/jpeg'
      : buf[0] === 0x47 && buf[1] === 0x49 ? 'image/gif'
      : null
    if (!type) return null
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

function Row({ item, img }: { item: PharmacyResult; img: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        background: 'rgba(255,255,255,0.94)',
        borderRadius: 28,
        border: '2px solid rgba(0,88,188,0.10)',
        boxShadow: '0 14px 28px rgba(0,40,90,0.08)',
        padding: '18px 26px 18px 18px',
        height: 172,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 136,
          height: 136,
          background: '#ffffff',
          borderRadius: 20,
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" style={{ maxWidth: 124, maxHeight: 124, objectFit: 'contain' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 4, minWidth: 0 }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 900, color: '#1a1b1f', lineHeight: 1.15 }}>
          {truncate(item.productName, 56)}
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#717786' }}>{item.pharmacy}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 2 }}>
          {item.referencePrice ? (
            <div style={{ display: 'flex', fontSize: 26, color: '#9aa0b0', textDecoration: 'line-through' }}>
              {formatCOP(item.referencePrice)}
            </div>
          ) : null}
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 900, color: '#006e28' }}>
            {formatCOP(item.price)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          background: '#ef4444',
          color: '#ffffff',
          fontSize: 36,
          fontWeight: 900,
          padding: '10px 20px',
          borderRadius: 16,
          flexShrink: 0,
        }}
      >
        -{item.discount}%
      </div>
    </div>
  )
}

export async function GET() {
  const pool = await getDiscountPool()
  if (pool.length === 0) {
    return new Response('Sin descuentos frescos hoy', { status: 404 })
  }

  // La historia solo lleva productos que la gente reconoce: primero consumo
  // (jabones, geles, condones, colageno, vitaminas...), despues marcas de
  // venta libre (Apronax, Dolex...). Los medicamentos de formula poco
  // conocidos NO entran aunque tengan mas descuento; mejor menos filas que
  // filas irreconocibles. Rotan a diario con la misma semilla de la portada.
  const seed = daySeed()
  const consumer = seededShuffle(pool.filter(isPriorityDiscount), seed)
  const otc = seededShuffle(
    pool.filter((r) => !isPriorityDiscount(r) && isKnownOtcDiscount(r)),
    seed + 1,
  )
  const candidates = [...consumer, ...otc].slice(0, CANDIDATES)

  // Se conservan solo los que tienen foto descargable, maximo 3 por farmacia.
  const fetched = await Promise.all(candidates.map((i) => toDataUri(i.imageUrl)))
  const rows: { item: PharmacyResult; img: string }[] = []
  const perPharmacy: Record<string, number> = {}
  for (let i = 0; i < candidates.length && rows.length < SLOTS; i++) {
    const img = fetched[i]
    if (!img) continue
    if ((perPharmacy[candidates[i].pharmacy] ?? 0) >= 3) continue
    rows.push({ item: candidates[i], img })
    perPharmacy[candidates[i].pharmacy] = (perPharmacy[candidates[i].pharmacy] ?? 0) + 1
  }
  rows.sort((a, b) => (b.item.discount ?? 0) - (a.item.discount ?? 0))
  if (rows.length === 0) {
    return new Response('Sin descuentos con foto hoy', { status: 404 })
  }

  const fonts = await loadFonts()

  const image = new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(170deg, #eef4fd 0%, #ffffff 40%, #e9f7ee 100%)',
          fontFamily: 'Hanken Grotesk',
          padding: '52px 44px 40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 52, fontWeight: 900, color: '#0058bc' }}>Farmi</div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#0058bc',
              background: 'rgba(0,88,188,0.08)',
              border: '2px solid rgba(0,88,188,0.18)',
              borderRadius: 9999,
              padding: '10px 26px',
              fontWeight: 900,
            }}
          >
            {todayBogota()}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 58, fontWeight: 900, color: '#1a1b1f', marginTop: 6 }}>
          Descuentos de hoy
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 22, marginTop: 26 }}>
          {rows.map(({ item, img }) => (
            <Row key={item.id} item={item} img={img} />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            marginTop: 24,
          }}
        >
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 900, color: '#0058bc' }}>www.farmi.com.co</div>
          <div style={{ display: 'flex', fontSize: 22, color: '#717786' }}>
            Precios referenciales tomados en línea de cada farmacia
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
      fonts: fonts
        ? [
            { name: 'Hanken Grotesk', data: fonts.regular, weight: 400 as const },
            { name: 'Hanken Grotesk', data: fonts.black, weight: 900 as const },
          ]
        : undefined,
    },
  )

  // Se materializa el PNG aqui (en vez de devolver el stream) para que un
  // error de render salga como 500 con detalle y no tumbe la respuesta a medias.
  try {
    const png = await image.arrayBuffer()
    return new Response(png, { headers: { 'Content-Type': 'image/png' } })
  } catch (e) {
    console.error('ig/descuentos render:', e)
    return new Response('Error generando la imagen, intenta de nuevo en unos minutos', { status: 500 })
  }
}
