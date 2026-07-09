import { Suspense } from 'react'
import CuentaClient from './CuentaClient'

export const metadata = {
  title: 'Mi cuenta',
  robots: { index: false, follow: true },
}

export default function CuentaPage() {
  return (
    <Suspense>
      <CuentaClient />
    </Suspense>
  )
}
