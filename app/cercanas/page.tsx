import CercanasClient from './CercanasClient'

export const metadata = {
  title: 'Farmacias cercanas',
  description: 'Encuentra farmacias reales cerca de ti en tiempo real, con datos de OpenStreetMap.',
}

export default function CercanasPage() {
  return <CercanasClient />
}
