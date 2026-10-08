import { useLayoutEffect, type ReactNode } from 'react'
import { useMotionTier } from '@/hooks/useMotionTier'
import { MotionContext } from './motion-context'

/**
 * Detecta o nível de movimento uma vez para a página inteira e o expõe via
 * contexto e via `<html data-tier>` (para regras CSS globais).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const tier = useMotionTier()

  useLayoutEffect(() => {
    document.documentElement.dataset.tier = tier
  }, [tier])

  return <MotionContext value={tier}>{children}</MotionContext>
}
