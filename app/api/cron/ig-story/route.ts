import { NextRequest, NextResponse } from 'next/server'
import { SITE_URL } from '@/app/lib/siteUrl'
import { daySeed } from '@/app/lib/discounts'
import { getAdminClient } from '@/app/lib/supabase/admin'

// Publica automaticamente la historia diaria de descuentos en Instagram via
// la Content Publishing API de Meta (cuenta profesional requerida). Corre por
// Vercel Cron a las 12:15 UTC (7:15 am Bogota), justo despues de que rota la
// seleccion del dia (7:00 am).
//
// Contrato: GET /api/cron/ig-story (Authorization: Bearer CRON_SECRET)
//   -> 200 { ok: true, storyId }        historia publicada
//   -> 200 { ok: true, skipped }        ya se publico hoy (candado app_state);
//                                       ?force=1 publica de todas formas
//   -> 503 { ok: false, error }         faltan IG_USER_ID / IG_ACCESS_TOKEN
//   -> 502 { ok: false, error, detail } Meta rechazo la publicacion
//
// Configuracion (ver docs/instagram-automatizacion.md):
//   IG_USER_ID       id numerico de la cuenta profesional de Instagram
//   IG_ACCESS_TOKEN  token de acceso con permiso instagram_content_publish

export const maxDuration = 60

const GRAPH = 'https://graph.facebook.com/v23.0'

async function graphPost(path: string, params: Record<string, string>) {
  const res = await fetch(`${GRAPH}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  })
  return { ok: res.ok, body: (await res.json().catch(() => null)) as Record<string, unknown> | null }
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    const provided = auth?.replace(/^Bearer\s+/i, '') ?? req.nextUrl.searchParams.get('secret')
    if (provided !== secret) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
  }

  const igUser = process.env.IG_USER_ID
  const token = process.env.IG_ACCESS_TOKEN
  if (!igUser || !token) {
    return NextResponse.json(
      { ok: false, error: 'faltan IG_USER_ID / IG_ACCESS_TOKEN en las variables de entorno' },
      { status: 503 },
    )
  }

  // Candado antiduplicados: si la historia de este "dia" (semilla de 7am) ya
  // se publico, no publicar otra aunque llamen la ruta varias veces. ?force=1
  // lo salta a proposito. Si la tabla app_state no existe aun, el candado se
  // omite en silencio y el robot publica como siempre.
  const seed = daySeed()
  const force = req.nextUrl.searchParams.get('force') === '1'
  const db = getAdminClient()
  if (db && !force) {
    const { data: state } = await db
      .from('app_state')
      .select('value')
      .eq('key', 'ig_story_last_seed')
      .maybeSingle()
    if (state?.value === String(seed)) {
      return NextResponse.json({
        ok: true,
        skipped: 'la historia de hoy ya se publico (usa ?force=1 para publicar otra)',
      })
    }
  }

  // URL publica de la imagen del dia. El ?v= por dia hace que Meta y el CDN
  // la traten como un archivo nuevo cada manana (la ruta ignora el parametro).
  const imageUrl = `${SITE_URL}/api/ig/descuentos?v=${seed}`

  // Calentar el CDN: la imagen tarda varios segundos en generarse y el fetch
  // de Meta no espera tanto; tras esta llamada queda cacheada unos minutos.
  const warm = await fetch(imageUrl)
  if (!warm.ok) {
    return NextResponse.json(
      { ok: false, error: `la imagen del dia respondio ${warm.status}` },
      { status: 502 },
    )
  }

  // Paso 1: crear el contenedor de la historia.
  const container = await graphPost(`${igUser}/media`, {
    media_type: 'STORIES',
    image_url: imageUrl,
    access_token: token,
  })
  const creationId = container.body?.id as string | undefined
  if (!creationId) {
    return NextResponse.json(
      { ok: false, error: 'Meta no acepto la imagen', detail: container.body },
      { status: 502 },
    )
  }

  // Paso 2: esperar a que Meta procese el contenedor (en imagenes suele ser
  // inmediato; se reintenta unos segundos por si acaso).
  for (let i = 0; i < 10; i++) {
    const status = await fetch(
      `${GRAPH}/${creationId}?fields=status_code&access_token=${encodeURIComponent(token)}`,
    ).then((r) => r.json()).catch(() => null)
    if (status?.status_code === 'FINISHED') break
    if (status?.status_code === 'ERROR') {
      return NextResponse.json(
        { ok: false, error: 'Meta marco error al procesar la imagen', detail: status },
        { status: 502 },
      )
    }
    await new Promise((r) => setTimeout(r, 2_000))
  }

  // Paso 3: publicar.
  const publish = await graphPost(`${igUser}/media_publish`, {
    creation_id: creationId,
    access_token: token,
  })
  const storyId = publish.body?.id as string | undefined
  if (!storyId) {
    return NextResponse.json(
      { ok: false, error: 'Meta no publico la historia', detail: publish.body },
      { status: 502 },
    )
  }

  // Registrar el dia publicado (si la tabla no existe, se ignora el error).
  if (db) {
    await db
      .from('app_state')
      .upsert({ key: 'ig_story_last_seed', value: String(seed), updated_at: new Date().toISOString() })
  }

  return NextResponse.json({ ok: true, storyId })
}
