'use client'

import { useRouter } from 'next/navigation'
import { QUICK_SEARCHES } from '@/app/utils/search'

export function QuickChips() {
  const router = useRouter()

  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2">
      {QUICK_SEARCHES.map((med) => (
        <button
          key={med}
          type="button"
          onClick={() => router.push(`/buscar?q=${encodeURIComponent(med)}`)}
          className="text-[12px] font-semibold tracking-wide px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-[#c1c6d7]/60 text-[#414755] hover:bg-white/80 hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
        >
          {med}
        </button>
      ))}
    </div>
  )
}
