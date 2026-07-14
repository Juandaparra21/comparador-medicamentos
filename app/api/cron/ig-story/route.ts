import { join } from 'path'
import { access } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { SITE_URL } from '@/app/lib/siteUrl'
import { daySeed } from '@/app/lib/discounts'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { buildCascadeVideo, STAGES } from '@/app/lib/reelVideo'

// Publica automaticamente los descuentos del dia en Instagram (Vercel Cron,
// 12:15 UTC = 7:15 am Bogota):
//   1. Genera el video "cascada" (las ofertas aparecen una por una) desde las
//      etapas de /api/ig/descuentos y lo sube a Supabase Storage (bucket ig).
//   2. Lo publica como REEL sin cuadricula (share_to_feed=false) con
//      descripcion, y el mismo video como HISTORIA.
//   3. Si el video falla, publica al menos la historia con la imagen fija.
// Candado en app_state: llamadas repetidas el mismo dia no duplican nada.
//
// Contrato: GET /api/cron/ig-story (Authorization: Bearer CRON_SECRET)
//   -> 200 { ok: true, reelId?, storyId?, video?, warnings? }
//   -> 200 { ok: true, skipped }        ya se publico hoy; ?force=1 lo salta
//   -> 200 { ok: true, dry: true, video } con ?dry=1: genera y sube el video
//                                         del dia SIN publicar nada
//   -> 503 { ok: false, error }         faltan IG_USER_ID / IG_ACCESS_TOKEN
//   -> 502 { ok: false, error, detail } Meta rechazo todas las publicaciones

export const maxDuration = 300

const GRAPH = 'https://graph.facebook.com/v23.0'

const REEL_CAPTION = `Descuentos de hoy en farmacias de Colombia. Comparamos los precios en linea para que pagues menos por lo mismo.

Todos los descuentos y la comparacion completa en www.farmi.com.co

Precios referenciales tomados de cada farmacia.
#farmacia #descuentos #ahorro #colombia #drogueria #medicamentos`

async function graphPost(path: string, params: Record<string, string>) {
  const res = await fetch(`${GRAPH}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  })
  return { ok: res.ok, body: (await res.json().catch(() => null)) as Record<string, unknown> | null }
}

// Espera a que Meta procese un contenedor. Los videos tardan (descarga +
// transcodificacion): se consulta cada 3s hasta `tries` veces.
async function waitFinished(creationId: string, token: string, tries: number): Promise<string> {
  for (let i = 0; i < tries; i++) {
    const status = await fetch(
      `${GRAPH}/${creationId}?fields=status_code&access_token=${encodeURIComponent(token)}`,
    ).then((r) => r.json()).catch(() => null)
    if (status?.status_code === 'FINISHED') return 'FINISHED'
    if (status?.status_code === 'ERROR') return 'ERROR'
    await new Promise((r) => setTimeout(r, 3_000))
  }
  return 'TIMEOUT'
}

// Crea el contenedor, espera el procesamiento y publica. Devuelve el id del
// medio publicado o lanza Error con el detalle.
async function publish(
  igUser: string,
  token: string,
  params: Record<string, string>,
  tries: number,
): Promise<string> {
  const container = await graphPost(`${igUser}/media`, { ...params, access_token: token })
  const creationId = container.body?.id as string | undefined
  if (!creationId) throw new Error(`contenedor rechazado: ${JSON.stringify(container.body)}`)

  const status = await waitFinished(creationId, token, tries)
  if (status !== 'FINISHED') throw new Error(`procesamiento ${status}`)

  const published = await graphPost(`${igUser}/media_publish`, {
    creation_id: creationId,
    access_token: token,
  })
  const mediaId = published.body?.id as string | undefined
  if (!mediaId) throw new Error(`publicacion rechazada: ${JSON.stringify(published.body)}`)
  return mediaId
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

  const seed = daySeed()
  const force = req.nextUrl.searchParams.get('force') === '1'
  const dry = req.nextUrl.searchParams.get('dry') === '1'
  const db = getAdminClient()

  // Candado antiduplicados (solo aplica a publicaciones reales).
  if (db && !force && !dry) {
    const { data: state } = await db
      .from('app_state')
      .select('value')
      .eq('key', 'ig_story_last_seed')
      .maybeSingle()
    if (state?.value === String(seed)) {
      return NextResponse.json({
        ok: true,
        skipped: 'lo de hoy ya se publico (usa ?force=1 para publicar otra vez)',
      })
    }
  }

  // ── 1. Video del dia: cascada + audio del dia + subida a Storage ──────────
  const warnings: string[] = []
  let videoUrl: string | null = null
  if (db) {
    try {
      const stageUrls = Array.from({ length: STAGES + 1 }, (_, k) =>
        `${SITE_URL}/api/ig/descuentos?etapa=${k}&v=${seed}`,
      )
      // Las 4 pistas de stock (assets/reel-audio) rotan con el dia. Si el
      // archivo no aparece en el despliegue, el video sale mudo y se avisa.
      let audioPath: string | undefined = join(
        process.cwd(), 'assets', 'reel-audio', `pista-${(seed % 4) + 1}.mp3`,
      )
      try {
        await access(audioPath)
      } catch {
        warnings.push(`audio no encontrado: ${audioPath}`)
        audioPath = undefined
      }
      const mp4 = await buildCascadeVideo(stageUrls, audioPath)
      const file = `reel-${seed}.mp4`
      const { error } = await db.storage
        .from('ig')
        .upload(file, mp4, { contentType: 'video/mp4', upsert: true })
      if (error) throw new Error(`storage: ${error.message}`)
      videoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/ig/${file}`
    } catch (e) {
      warnings.push(`video: ${e instanceof Error ? e.message : e}`)
    }
  } else {
    warnings.push('video: base de datos no disponible')
  }

  if (dry) {
    return NextResponse.json({ ok: !!videoUrl, dry: true, video: videoUrl, warnings })
  }

  const igUser = process.env.IG_USER_ID
  const token = process.env.IG_ACCESS_TOKEN
  if (!igUser || !token) {
    return NextResponse.json(
      { ok: false, error: 'faltan IG_USER_ID / IG_ACCESS_TOKEN en las variables de entorno' },
      { status: 503 },
    )
  }

  // ── 2. Publicar: reel sin cuadricula + historia ───────────────────────────
  let reelId: string | null = null
  let storyId: string | null = null

  if (videoUrl) {
    try {
      reelId = await publish(igUser, token, {
        media_type: 'REELS',
        video_url: videoUrl,
        share_to_feed: 'false',
        caption: REEL_CAPTION,
      }, 40)
    } catch (e) {
      warnings.push(`reel: ${e instanceof Error ? e.message : e}`)
    }
    try {
      storyId = await publish(igUser, token, {
        media_type: 'STORIES',
        video_url: videoUrl,
      }, 40)
    } catch (e) {
      warnings.push(`historia video: ${e instanceof Error ? e.message : e}`)
    }
  }

  // ── 3. Respaldo: si no salio nada en video, al menos la historia con imagen.
  if (!reelId && !storyId) {
    const imageUrl = `${SITE_URL}/api/ig/descuentos?v=${seed}`
    const warm = await fetch(imageUrl)
    if (warm.ok) {
      try {
        storyId = await publish(igUser, token, {
          media_type: 'STORIES',
          image_url: imageUrl,
        }, 10)
      } catch (e) {
        warnings.push(`historia imagen: ${e instanceof Error ? e.message : e}`)
      }
    } else {
      warnings.push(`imagen del dia respondio ${warm.status}`)
    }
  }

  if (!reelId && !storyId) {
    return NextResponse.json(
      { ok: false, error: 'Meta rechazo todas las publicaciones', detail: warnings },
      { status: 502 },
    )
  }

  // Registrar el dia publicado (si la tabla no existe, se ignora el error).
  if (db) {
    await db
      .from('app_state')
      .upsert({ key: 'ig_story_last_seed', value: String(seed), updated_at: new Date().toISOString() })
  }

  return NextResponse.json({
    ok: true,
    ...(reelId ? { reelId } : {}),
    ...(storyId ? { storyId } : {}),
    ...(videoUrl ? { video: videoUrl } : {}),
    ...(warnings.length ? { warnings } : {}),
  })
}
