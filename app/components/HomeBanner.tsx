'use client'

import { useState } from 'react'

// Promotional banner for the home page. The headline text is baked into the image,
// so the alt carries the message for screen readers and SEO. If the image file is
// not present yet, the whole banner hides itself instead of showing a broken image.
export function HomeBanner() {
  const [failed, setFailed] = useState(false)
  if (failed) return null

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-2xl">
      <div className="overflow-hidden rounded-3xl border border-white/50 shadow-sm ring-1 ring-black/5">
        <img
          src="/banner-pagando-de-mas.jpg"
          alt="¿Pagando de más por tus medicamentos? Compara los precios y ahorra con Farmi."
          width={1024}
          height={1024}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="w-full h-auto"
        />
      </div>
    </section>
  )
}
