import { ImageResponse } from 'next/og'

// Imagen que se muestra al compartir farmi.com.co en WhatsApp, redes y buscadores.
// Se genera en el build con los colores de la marca; aplica a todo el sitio
// salvo que una ruta defina la suya propia.

export const alt = 'Farmi - Comparador de precios de medicamentos en Colombia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PRIMARY = '#0058bc'
const TERTIARY = '#4c4aca'
const INK = '#1a1b1f'
const GRAY = '#717786'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#fbfbfd',
          backgroundImage:
            'linear-gradient(135deg, rgba(0,88,188,0.08) 0%, rgba(251,251,253,0) 45%), linear-gradient(315deg, rgba(76,74,202,0.08) 0%, rgba(251,251,253,0) 45%)',
        }}
      >
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 700 }}>
          <span style={{ color: INK }}>Far</span>
          <span style={{ color: PRIMARY }}>mi</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: INK,
              lineHeight: 1.1,
              letterSpacing: '-2px',
            }}
          >
            Compara precios de medicamentos en Colombia
          </div>
          <div style={{ fontSize: 34, color: GRAY }}>
            El mismo medicamento puede costar hasta 3 veces menos en otra farmacia.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {['6 farmacias', 'Genéricos y marcas', 'Gratis'].map((chip) => (
              <div
                key={chip}
                style={{
                  display: 'flex',
                  fontSize: 26,
                  fontWeight: 600,
                  color: PRIMARY,
                  backgroundColor: 'rgba(0,88,188,0.09)',
                  border: '2px solid rgba(0,88,188,0.25)',
                  borderRadius: 999,
                  padding: '12px 28px',
                }}
              >
                {chip}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, color: TERTIARY }}>
            www.farmi.com.co
          </div>
        </div>
      </div>
    ),
    size,
  )
}
