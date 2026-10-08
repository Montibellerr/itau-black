import { useState } from 'react'
import { useMediaQuery } from './useMediaQuery'

/**
 * Nível de movimento da experiência:
 * - `full`   → desktop com mouse: 3D completo, parallax e reflexos reativos.
 * - `lite`   → toque ou hardware modesto: entrada animada + flutuação via CSS.
 * - `static` → prefers-reduced-motion: composição 3D estática, sem animação.
 *
 * Para testes/demonstração é possível forçar com `?motion=full|lite|static`.
 */
export type MotionTier = 'full' | 'lite' | 'static'

const TIERS: readonly MotionTier[] = ['full', 'lite', 'static']

function readOverride(): MotionTier | null {
  const value = new URLSearchParams(window.location.search).get('motion')
  return TIERS.find((tier) => tier === value) ?? null
}

function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }
  return (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2 || nav.connection?.saveData === true
}

export function useMotionTier(): MotionTier {
  const [override] = useState(readOverride)
  const [lowPower] = useState(isLowPowerDevice)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')

  if (override) return override
  if (reducedMotion) return 'static'
  if (!finePointer || lowPower) return 'lite'
  return 'full'
}
