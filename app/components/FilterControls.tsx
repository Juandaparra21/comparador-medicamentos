'use client'

import type { CSSProperties } from 'react'

/* ── Radio-style filter (presentation, concentration) ───────────────── */

interface RadioFilterProps {
  label:        string
  allLabel:     string
  active:       string                    // '' = all
  options:      string[]
  highlight?:   string                    // value tagged "Más comun"
  renderLabel?: (v: string) => string
  onChange:     (v: string) => void
}

export function RadioFilter({
  label, allLabel, active, options, highlight, renderLabel, onChange,
}: RadioFilterProps) {
  const items = [{ v: '', l: allLabel }, ...options.map((v) => ({ v, l: renderLabel ? renderLabel(v) : v }))]

  return (
    <fieldset>
      <legend className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#717786] mb-3">
        {label}
      </legend>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-x-6 gap-y-3">
        {items.map((opt) => {
          const selected = active === opt.v
          return (
            <button
              key={opt.v || '__all'}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.v)}
              className="group flex items-center gap-2.5 cursor-pointer"
            >
              <span
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors ${
                  selected ? 'border-primary' : 'border-[#c1c6d7] group-hover:border-primary/50'
                }`}
              >
                {selected && <span className="w-2 h-2 rounded-full bg-primary" />}
              </span>
              <span className="flex flex-col items-start leading-tight text-left">
                <span className={`text-[14px] font-semibold transition-colors ${selected ? 'text-[#1a1b1f]' : 'text-[#717786] group-hover:text-[#414755]'}`}>
                  {opt.l}
                </span>
                {highlight && opt.v === highlight && (
                  <span className="text-[11px] font-semibold text-primary">Más común</span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/* ── Slider-style quantity filter ───────────────────────────────────── */

interface QuantitySliderProps {
  title:     string        // section heading: "Cantidad" | "Volumen"
  values:    number[]      // ascending available pack sizes
  active:    number | null // null = all
  unitLabel: string        // "unidades" | "ml"
  onChange:  (v: number | null) => void
}

export function QuantitySlider({ title, values, active, unitLabel, onChange }: QuantitySliderProps) {
  const max = values.length                                  // index 0 = Todas, 1..N = values
  const activeIndex = active == null ? 0 : Math.max(0, values.indexOf(active) + 1)
  const pct = max === 0 ? 0 : (activeIndex / max) * 100

  function setIndex(i: number) {
    const clamped = Math.min(max, Math.max(0, i))
    onChange(clamped === 0 ? null : values[clamped - 1])
  }

  const valueText = activeIndex === 0 ? 'Todas' : `${values[activeIndex - 1]} ${unitLabel}`

  return (
    <fieldset>
      <legend className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#717786] mb-3">
        {title}
      </legend>

      {/* Slider with floating value bubble */}
      <div className="relative pt-10 px-1.5">
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: `${pct}%` }}
        >
          <span className="text-[12px] font-semibold text-[#1a1b1f] bg-[#eef2f7] border border-[#dde3ec] px-2.5 py-1 rounded-lg whitespace-nowrap shadow-sm">
            {valueText}
          </span>
          <span className="w-2 h-2 bg-[#eef2f7] border-r border-b border-[#dde3ec] rotate-45 -mt-1" />
        </div>

        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={activeIndex}
          onChange={(e) => setIndex(Number(e.target.value))}
          className="qty-range"
          style={{ '--pct': `${pct}%` } as CSSProperties}
          aria-label={`${title} por empaque`}
          aria-valuetext={valueText}
        />

        {/* Tick labels aligned with slider stops */}
        <div className="flex justify-between mt-2.5 text-[11px] font-semibold tabular-nums">
          <span className={activeIndex === 0 ? 'text-primary' : 'text-[#9ca3af]'}>Todas</span>
          {values.map((v, i) => (
            <span key={v} className={activeIndex === i + 1 ? 'text-primary' : 'text-[#9ca3af]'}>
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-3 mt-4">
        <div className="flex items-center rounded-lg border border-[#e5e7eb] bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Menos cantidad"
            className="w-9 h-9 flex items-center justify-center text-[#414755] hover:bg-[#f5f6fa] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" /></svg>
          </button>
          <span className="min-w-[3.5rem] text-center text-[14px] font-bold text-[#1a1b1f] tabular-nums px-2 select-none">
            {activeIndex === 0 ? 'Todas' : values[activeIndex - 1]}
          </span>
          <button
            type="button"
            onClick={() => setIndex(activeIndex + 1)}
            disabled={activeIndex === max}
            aria-label="Más cantidad"
            className="w-9 h-9 flex items-center justify-center text-[#414755] hover:bg-[#f5f6fa] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" /></svg>
          </button>
        </div>
        <span className="text-[13px] text-[#717786]">{unitLabel}</span>
        {activeIndex !== 0 && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="ml-auto text-[12px] font-semibold text-primary hover:opacity-75 transition-opacity cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>
    </fieldset>
  )
}
