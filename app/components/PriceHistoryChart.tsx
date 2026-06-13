'use client'

import { useRef, useState } from 'react'
import type { PharmacyHistory } from '@/app/utils/priceHistory'
import { formatCOP } from '@/app/utils/format'

interface Props {
  histories: PharmacyHistory[]
  unit: string
}

const W = 680
const H = 240
const PAD = { top: 20, right: 20, bottom: 48, left: 60 }
const PW = W - PAD.left - PAD.right
const PH = H - PAD.top - PAD.bottom

function formatShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`
  return String(n)
}

export function PriceHistoryChart({ histories, unit }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [hoverX, setHoverX] = useState(0)
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const months = histories[0]?.data.map((p) => p.month) ?? []
  const n = months.length

  const allPrices = histories.flatMap((h) => h.data.map((p) => p.price))
  const visibleHistories = histories.filter((h) => !hidden.has(h.pharmacy))
  const pricesToScale = visibleHistories.length > 0
    ? visibleHistories.flatMap((h) => h.data.map((p) => p.price))
    : allPrices

  const dataMin = Math.min(...pricesToScale)
  const dataMax = Math.max(...pricesToScale)
  const padAmt = (dataMax - dataMin) * 0.15 || 500
  const yMin = dataMin - padAmt
  const yMax = dataMax + padAmt

  const xPos = (i: number) => PAD.left + (i / (n - 1)) * PW
  const yPos = (price: number) => PAD.top + PH - ((price - yMin) / (yMax - yMin)) * PH

  const allLow = Math.min(...allPrices)
  const allLowHistory = histories.find((h) => h.data.some((p) => p.price === allLow))

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current || !containerRef.current) return
    const svgRect = svgRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const svgX = (e.clientX - svgRect.left) * (W / svgRect.width)
    const relX = svgX - PAD.left
    const step = PW / (n - 1)
    setHoverIdx(Math.max(0, Math.min(n - 1, Math.round(relX / step))))
    setHoverX(e.clientX - containerRect.left)
  }

  function togglePharmacy(pharmacy: string) {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(pharmacy)) {
        next.delete(pharmacy)
      } else if (next.size < histories.length - 1) {
        next.add(pharmacy)
      }
      return next
    })
  }

  const gridValues = Array.from({ length: 5 }, (_, i) =>
    yMin + ((yMax - yMin) * i) / 4
  )

  const tooltipRows = hoverIdx !== null
    ? [...visibleHistories].sort((a, b) => a.data[hoverIdx].price - b.data[hoverIdx].price)
    : []

  const containerWidth = containerRef.current?.offsetWidth || 400
  const showLeft = hoverX > containerWidth * 0.55

  return (
    <div ref={containerRef} className="w-full relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* Grid lines */}
        {gridValues.map((val, i) => (
          <g key={i}>
            <line
              x1={PAD.left} x2={W - PAD.right}
              y1={yPos(val)} y2={yPos(val)}
              stroke="#e5e7eb" strokeWidth={1}
              strokeDasharray={i === 0 ? '0' : '4 4'}
            />
            <text
              x={PAD.left - 8} y={yPos(val) + 4}
              textAnchor="end" fontSize={10} fill="#9ca3af"
              fontFamily="var(--font-hanken)"
            >
              {formatShort(val)}
            </text>
          </g>
        ))}

        {/* Month labels */}
        {months.map((m, i) => (
          <text
            key={m} x={xPos(i)} y={H - PAD.bottom + 16}
            textAnchor="middle" fontSize={10}
            fill={hoverIdx === i ? '#1a1b1f' : '#9ca3af'}
            fontWeight={hoverIdx === i ? '700' : '400'}
            fontFamily="var(--font-hanken)"
          >
            {m}
          </text>
        ))}

        {/* Lines + hover dots */}
        {histories.map((h) => {
          const isHidden = hidden.has(h.pharmacy)
          const points = h.data.map((p, i) => `${xPos(i)},${yPos(p.price)}`).join(' ')
          return (
            <g key={h.pharmacy}>
              <polyline
                points={points}
                fill="none"
                stroke={h.color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  opacity: isHidden ? 0.07 : hoverIdx !== null ? 0.5 : 1,
                  transition: 'opacity 180ms ease',
                }}
              />
              {hoverIdx !== null && !isHidden && (
                <circle
                  cx={xPos(hoverIdx)}
                  cy={yPos(h.data[hoverIdx].price)}
                  r={5} fill={h.color}
                  stroke="white" strokeWidth={2.5}
                />
              )}
            </g>
          )
        })}

        {/* All-time low marker */}
        {(() => {
          if (!allLowHistory || hidden.has(allLowHistory.pharmacy)) return null
          const idx = allLowHistory.data.findIndex((p) => p.price === allLow)
          return (
            <g>
              <circle
                cx={xPos(idx)} cy={yPos(allLow)} r={7}
                fill="none" stroke={allLowHistory.color}
                strokeWidth={2} strokeDasharray="3 2"
              />
              <text
                x={xPos(idx)} y={yPos(allLow) - 12}
                textAnchor="middle" fontSize={9}
                fill={allLowHistory.color} fontWeight="700"
                fontFamily="var(--font-hanken)"
              >
                MINIMO
              </text>
            </g>
          )
        })()}

        {/* Hover vertical line */}
        {hoverIdx !== null && (
          <line
            x1={xPos(hoverIdx)} x2={xPos(hoverIdx)}
            y1={PAD.top} y2={PAD.top + PH}
            stroke="#1a1b1f" strokeWidth={1}
            strokeDasharray="4 3" opacity={0.18}
          />
        )}
      </svg>

      {/* HTML tooltip — grande, glassmorphism */}
      {hoverIdx !== null && tooltipRows.length > 0 && (
        <div
          className="pointer-events-none absolute top-2 z-20 min-w-[220px] bg-white/95 backdrop-blur-2xl border border-white/70 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14),0_2px_12px_rgba(0,0,0,0.08)] px-4 py-4"
          style={showLeft
            ? { left: hoverX - 16, transform: 'translateX(-100%)' }
            : { left: hoverX + 16 }
          }
        >
          <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">
            {months[hoverIdx]} 2025
          </p>
          <div className="flex flex-col gap-3">
            {tooltipRows.map((h, i) => (
              <div key={h.pharmacy} className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: h.color }}
                  />
                  <span className="text-[13px] text-[#414755]">
                    {h.pharmacy.split(' ')[0]}
                  </span>
                  {i === 0 && (
                    <span className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-1.5 py-0.5 rounded-full">
                      min
                    </span>
                  )}
                </div>
                <span
                  className="text-[15px] font-bold tabular-nums"
                  style={{ color: i === 0 ? '#006e28' : '#1a1b1f' }}
                >
                  {formatCOP(h.data[hoverIdx].price)}
                </span>
              </div>
            ))}
          </div>
          {tooltipRows.length > 1 && (() => {
            const diff =
              tooltipRows[tooltipRows.length - 1].data[hoverIdx].price -
              tooltipRows[0].data[hoverIdx].price
            if (diff <= 0) return null
            return (
              <div className="mt-3 pt-3 border-t border-[#f0f0f0]">
                <p className="text-[12px] text-[#717786]">
                  Diferencia{' '}
                  <span className="font-bold text-primary">{formatCOP(diff)}</span>
                </p>
              </div>
            )
          })()}
        </div>
      )}

      {/* Legend — clickable para aislar líneas */}
      <div className="flex flex-wrap items-center gap-2 mt-3 px-1">
        {histories.map((h) => {
          const isHidden = hidden.has(h.pharmacy)
          return (
            <button
              key={h.pharmacy}
              onClick={() => togglePharmacy(h.pharmacy)}
              title={isHidden ? `Mostrar ${h.pharmacy}` : `Ocultar ${h.pharmacy}`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all duration-200 cursor-pointer ${
                isHidden
                  ? 'border-[#e5e7eb] bg-white/40 opacity-40'
                  : 'border-transparent hover:bg-black/[0.04]'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: h.color, opacity: isHidden ? 0.4 : 1 }}
              />
              <span className={`text-[11px] font-medium transition-all duration-200 ${
                isHidden ? 'text-[#9ca3af] line-through' : 'text-[#717786]'
              }`}>
                {h.pharmacy}
              </span>
            </button>
          )
        })}

        {hidden.size > 0 && (
          <button
            onClick={() => setHidden(new Set())}
            className="text-[11px] font-semibold text-primary hover:opacity-70 transition-opacity cursor-pointer px-1.5"
          >
            Mostrar todas
          </button>
        )}

        {allLowHistory && (
          <div className="ml-auto">
            <span className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-full whitespace-nowrap">
              Min. historico: {formatCOP(allLow)} · {allLowHistory.pharmacy}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
