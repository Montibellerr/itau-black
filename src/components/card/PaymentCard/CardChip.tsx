import { useId } from 'react'
import { svgId } from '@/lib/svgId'

/** Chip EMV vetorial. As cores vêm de variáveis CSS definidas pela variante do cartão. */
export function CardChip({ className }: { className?: string }) {
  const id = useId()
  const metal = svgId(id, 'chip-metal')
  const gloss = svgId(id, 'chip-gloss')

  return (
    <svg className={className} viewBox="0 0 50 38" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--chip-1)' }} />
          <stop offset="0.38" style={{ stopColor: 'var(--chip-2)' }} />
          <stop offset="0.58" style={{ stopColor: 'var(--chip-3)' }} />
          <stop offset="1" style={{ stopColor: 'var(--chip-4)' }} />
        </linearGradient>
        <linearGradient id={gloss} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="49" height="37" rx="6.5" fill={`url(#${metal})`} />
      <g fill="none" style={{ stroke: 'var(--chip-line)' }} strokeWidth="0.9" strokeOpacity="0.7">
        <rect x="16.5" y="8.5" width="17" height="21" rx="4" />
        <path d="M0.5 13.5H16.5M0.5 24.5H16.5M33.5 13.5H49.5M33.5 24.5H49.5M25 0.5V8.5M25 29.5V37.5" />
      </g>
      <rect x="0.5" y="0.5" width="49" height="37" rx="6.5" fill={`url(#${gloss})`} />
      <rect
        x="0.5"
        y="0.5"
        width="49"
        height="37"
        rx="6.5"
        fill="none"
        style={{ stroke: 'var(--chip-line)' }}
        strokeOpacity="0.55"
        strokeWidth="0.8"
      />
    </svg>
  )
}
