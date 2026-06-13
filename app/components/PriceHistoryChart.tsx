'use client'

import { useRef, useState } from 'react'
import type { PharmacyHistory } from '@/app/utils/priceHistory'
import { formatCOP } from '@/app/utils/format'

interface Props {
  histories: PharmacyHistory[]
  unit: string
}

const W = 680
const H = 260
const PAD = { top: 24, right: 24, bottom: 52, left: 64 }
const PW = W - PAD.left - PAD.right
const PH = H - PAD.top - PAD.bottom

function formatShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`
  return String(n)
}

export function PriceHistoryChart({ histories, unit }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const months = histories[0]?.data.map((p) => p.month) ?? []
  const n = months.length

  const allPrices = histories.flatMap((h) => h.data.map((p) => p.price))
  const dataMin = Math.min(...allPrices)
  const dataMax = Math.max(...allPrices)
  const pad = (dataMax - dataMin) * 0.15 || 500
  const yMin = dataMin - pad
  const yMax = dataMax + pad

  const xPos = (i: number) => PAD.left + (i / (n - 1)) * PW
  const yPos = (price: number) => PAD.top + PH - ((price - yMin) / (yMax - yMin)) * PH

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current!.getBoundingClientRect()
    const svgX = (e.clientX - rect.left) * (W / rect.width)
    const relX = svgX - PAD.left
    const step = PW / (n - 1)
    const idx = Math.round(relX / step)
    setHoverIdx(Math.max(0, Math.min(n - 1, idx)))
  }

  const gridCount = 4
  const gridValues = Array.from({ length: gridCount + 1 }, (_, i) =>
    yMin + ((yMax - yMin) * i) / gridCount
  )

  const allLow = Math.min(...allPrices)
  const allLowPharmacy = histories.find((h) =>
    h.data.some((p) => p.price === allLow)
  )

  return (
    <div className="w-full">
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
              x1={PAD.left}
              x2={W - PAD.right}
              y1={yPos(val)}
              y2={yPos(val)}
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray={i === 0 ? '0' : '4 4'}
            />
            <text
              x={PAD.left - 8}
              y={yPos(val) + 4}
              textAnchor="end"
              fontSize={10}
              fill="#9ca3af"
              fontFamily="var(--font-hanken)"
            >
              {formatShort(val)}
            </text>
          </g>
        ))}

        {/* Month labels */}
        {months.map((m, i) => (
          <text
            key={m}
            x={xPos(i)}
            y={H - PAD.bottom + 18}
            textAnchor="middle"
            fontSize={10}
            fill={hoverIdx === i ? '#1a1b1f' : '#9ca3af'}
            fontWeight={hoverIdx === i ? '700' : '400'}
            fontFamily="var(--font-hanken)"
          >
            {m}
          </text>
        ))}

        {/* Lines + dots */}
        {histories.map((h) => {
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
                opacity={hoverIdx !== null ? 0.5 : 1}
              />
              {hoverIdx !== null && (
                <circle
                  cx={xPos(hoverIdx)}
                  cy={yPos(h.data[hoverIdx].price)}
                  r={5}
                  fill={h.color}
                  stroke="white"
                  strokeWidth={2}
                />
              )}
            </g>
          )
        })}

        {/* All-time low marker */}
        {(() => {
          const hi = histories.find((h) => h.data.some((p) => p.price === allLow))
          if (!hi) return null
          const idx = hi.data.findIndex((p) => p.price === allLow)
          return (
            <g>
              <circle
                cx={xPos(idx)}
                cy={yPos(allLow)}
                r={7}
                fill="none"
                stroke={hi.color}
                strokeWidth={2}
                strokeDasharray="3 2"
              />
              <text
                x={xPos(idx)}
                y={yPos(allLow) - 12}
                textAnchor="middle"
                fontSize={9}
                fill={hi.color}
                fontWeight="700"
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
            x1={xPos(hoverIdx)}
            x2={xPos(hoverIdx)}
            y1={PAD.top}
            y2={PAD.top + PH}
            stroke="#1a1b1f"
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.3}
          />
        )}

        {/* Tooltip box */}
        {hoverIdx !== null && (() => {
          const tipW = 148
          const tipH = histories.length * 18 + 28
          const isRight = xPos(hoverIdx) > W / 2
          const tipX = isRight ? xPos(hoverIdx) - tipW - 10 : xPos(hoverIdx) + 10
          const tipY = PAD.top + 8
          const sorted = [...histories].sort(
            (a, b) => a.data[hoverIdx].price - b.data[hoverIdx].price
          )
          return (
            <g>
              <rect
                x={tipX}
                y={tipY}
                width={tipW}
                height={tipH}
                rx={8}
                fill="white"
                stroke="#e5e7eb"
                strokeWidth={1}
                filter="drop-shadow(0 4px 12px rgba(0,0,0,0.10))"
              />
              <text
                x={tipX + 10}
                y={tipY + 16}
                fontSize={11}
                fontWeight="700"
                fill="#1a1b1f"
                fontFamily="var(--font-hanken)"
              >
                {months[hoverIdx]} 2025
              </text>
              {sorted.map((h, i) => (
                <g key={h.pharmacy}>
                  <circle
                    cx={tipX + 16}
                    cy={tipY + 28 + i * 18}
                    r={4}
                    fill={h.color}
                  />
                  <text
                    x={tipX + 26}
                    y={tipY + 32 + i * 18}
                    fontSize={10}
                    fill="#414755"
                    fontFamily="var(--font-hanken)"
                  >
                    {h.pharmacy.split(' ')[0]} —
                  </text>
                  <text
                    x={tipX + tipW - 10}
                    y={tipY + 32 + i * 18}
                    fontSize={10}
                    fontWeight="700"
                    fill={h.color}
                    textAnchor="end"
                    fontFamily="var(--font-hanken)"
                  >
                    {formatCOP(h.data[hoverIdx].price)}
                  </text>
                </g>
              ))}
            </g>
          )
        })()}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 px-1">
        {histories.map((h) => (
          <div key={h.pharmacy} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: h.color }}
            />
            <span className="text-[11px] text-[#717786]">{h.pharmacy}</span>
          </div>
        ))}
        {allLowPharmacy && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-full">
              Minimo historico: {formatCOP(allLow)} en {allLowPharmacy.pharmacy}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
