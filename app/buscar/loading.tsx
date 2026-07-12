import { BrandLoader } from '@/app/components/BrandLoader'

export default function BuscarLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <BrandLoader label="Buscando precios..." />
    </div>
  )
}
