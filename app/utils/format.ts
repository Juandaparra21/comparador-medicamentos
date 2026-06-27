export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Human-friendly "hace X" relative time, e.g. "hace unos segundos",
// "hace 12 minutos", "hace 2 horas". Computed at render time.
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return ''
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000))
  if (secs < 60) return 'hace unos segundos'
  const mins = Math.round(secs / 60)
  if (mins < 60) return `hace ${mins} minuto${mins !== 1 ? 's' : ''}`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `hace ${hours} hora${hours !== 1 ? 's' : ''}`
  const days = Math.round(hours / 24)
  return `hace ${days} dia${days !== 1 ? 's' : ''}`
}
