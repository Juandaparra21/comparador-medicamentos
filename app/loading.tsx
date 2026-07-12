import { BrandLoader } from '@/app/components/BrandLoader'

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <BrandLoader label="Cargando..." />
    </div>
  )
}
