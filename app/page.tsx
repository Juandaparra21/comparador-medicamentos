import { SearchBar } from '@/app/components/SearchBar'
import { QuickChips } from '@/app/components/QuickChips'

export default function Home() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto px-4 sm:px-5 max-w-2xl">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-[26px] sm:text-[34px] font-bold leading-tight tracking-[-0.02em] text-[#1a1b1f] mb-3">
            Compara precios de{' '}
            <span className="text-primary">medicamentos</span>
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#414755] leading-[22px]">
            Encuentra el mejor precio en las principales farmacias de Colombia
          </p>
        </div>

        <SearchBar />
        <QuickChips />
      </div>
    </section>
  )
}
