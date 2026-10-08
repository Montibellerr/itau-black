import { useId } from 'react'
import { svgId } from '@/lib/svgId'

/**
 * `silver`: universo Black · `orange`: identidade Itaú tradicional ·
 * `white`: sobre superfícies laranja (ex.: cartão Itaú).
 */
export type BrandMarkTone = 'silver' | 'orange' | 'white'

interface BrandMarkProps {
  tone?: BrandMarkTone
  className?: string
}

const PALETTE: Record<BrandMarkTone, { from: string; to: string; text: string; stroke: string; strokeOpacity: number }> = {
  silver: { from: '#eef2f9', to: '#97a8c8', text: '#0b1838', stroke: '#4f86ff', strokeOpacity: 0.95 },
  orange: { from: '#ff8a1f', to: '#e06a00', text: '#ffffff', stroke: '#ffffff', strokeOpacity: 0.18 },
  white: { from: '#ffffff', to: '#f1ebe4', text: '#d86600', stroke: '#ffffff', strokeOpacity: 0.6 },
}

/**
 * Interpretação estilizada da marca, criada para este conceito.
 * Decorativa: o contexto (link ou cartão) fornece o nome acessível.
 */
export function BrandMark({ tone = 'silver', className }: BrandMarkProps) {
  const id = useId()
  const fillId = svgId(id, 'brand-fill')
  const glossId = svgId(id, 'brand-gloss')
  const colors = PALETTE[tone]

  return (
    <svg className={className} viewBox="0 0 56 56" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor={colors.from} />
          <stop offset="1" stopColor={colors.to} />
        </linearGradient>
        <linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="56" height="56" rx="13" fill={`url(#${fillId})`} />
      <rect width="56" height="56" rx="13" fill={`url(#${glossId})`} />
      <rect
        x="0.75"
        y="0.75"
        width="54.5"
        height="54.5"
        rx="12.25"
        fill="none"
        stroke={colors.stroke}
        strokeOpacity={colors.strokeOpacity}
        strokeWidth="1.5"
      />
      <text
        x="28"
        y="35.5"
        textAnchor="middle"
        fill={colors.text}
        fontSize="19.5"
        fontWeight="800"
        letterSpacing="-0.6"
      >
        itaú
      </text>
    </svg>
  )
}
