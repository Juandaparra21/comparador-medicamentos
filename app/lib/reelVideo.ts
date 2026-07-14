import { execFile } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, rm, mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import ffmpegPath from 'ffmpeg-static'

const execFileAsync = promisify(execFile)

// Numero de etapas de la cascada: 0 (solo encabezado) a 7 (todas las ofertas).
// Debe coincidir con SLOTS de /api/ig/descuentos.
export const STAGES = 7

// Construye el video "cascada" del dia (1080x1920, ~7s, H.264): las ofertas
// van apareciendo una por una con fundidos. Recibe las URLs de las etapas
// (?etapa=0..7 de /api/ig/descuentos) y opcionalmente la ruta de una pista de
// audio (stock) que se mezcla recortada a la duracion del video con fundido
// de salida. Devuelve el MP4 como Buffer. Lanza Error si algo falla.
export async function buildCascadeVideo(stageUrls: string[], audioPath?: string): Promise<Buffer> {
  if (!ffmpegPath) throw new Error('ffmpeg no disponible en este entorno')

  const dir = await mkdtemp(join(tmpdir(), 'reel-'))
  try {
    // Bajar todas las etapas en paralelo.
    const pngs = await Promise.all(
      stageUrls.map(async (url, k) => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`etapa ${k} respondio ${res.status}`)
        const file = join(dir, `etapa-${k}.png`)
        await writeFile(file, Buffer.from(await res.arrayBuffer()))
        return file
      }),
    )

    // Cadena de fundidos: etapa 0 visible 0.9s, luego una oferta nueva cada
    // 0.55s (fundido de 0.25s), y el listado completo queda 2.5s al final.
    const inputs = pngs.flatMap((p) => ['-loop', '1', '-t', '8', '-i', p])
    const steps: string[] = []
    for (let k = 1; k < pngs.length; k++) {
      const src = k === 1 ? '[0]' : `[v${k - 1}]`
      const offset = (0.9 + 0.55 * (k - 1)).toFixed(2)
      steps.push(`${src}[${k}]xfade=transition=fade:duration=0.25:offset=${offset}[v${k}]`)
    }
    const last = `[v${pngs.length - 1}]`
    steps.push(`${last}fade=t=in:st=0:d=0.5,format=yuv420p[v]`)

    const out = join(dir, 'reel.mp4')
    const totalSecs = 0.9 + 0.55 * (pngs.length - 1) + 2.5
    const totalDur = totalSecs.toFixed(2)

    // Audio: entra como ultimo input; se recorta a la duracion del video con
    // fundido de salida en el ultimo segundo para que no corte en seco.
    const audioInputs = audioPath ? ['-i', audioPath] : []
    const audioArgs = audioPath
      ? [
          '-map', `${pngs.length}:a`,
          '-af', `afade=t=out:st=${(totalSecs - 1).toFixed(2)}:d=1`,
          '-c:a', 'aac',
          '-b:a', '128k',
        ]
      : []

    await execFileAsync(
      ffmpegPath,
      [
        '-y',
        ...inputs,
        ...audioInputs,
        '-filter_complex', steps.join(';'),
        '-map', '[v]',
        ...audioArgs,
        '-t', totalDur,
        '-r', '30',
        '-c:v', 'libx264',
        // veryfast: en serverless el tiempo de CPU importa mas que unos KB.
        '-preset', 'veryfast',
        '-crf', '23',
        '-movflags', '+faststart',
        out,
      ],
      { timeout: 120_000, maxBuffer: 16 * 1024 * 1024 },
    )

    return await readFile(out)
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {})
  }
}
