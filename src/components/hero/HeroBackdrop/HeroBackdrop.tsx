import type { MotionTier } from '@/hooks/useMotionTier'
import type { PointerTracker } from '@/hooks/usePointerTracker'
import styles from './HeroBackdrop.module.css'
import { useCursorLight } from './useCursorLight'

interface HeroBackdropProps {
  tier: MotionTier
  pointer: PointerTracker
}

/** Iluminação de cena: base grafite, luz-chave, feixe, luz do cursor, grão e vinheta. */
export function HeroBackdrop({ tier, pointer }: HeroBackdropProps) {
  const interactive = tier === 'full'
  const cursorLightRef = useCursorLight(pointer, interactive)

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.base} />
      <div className={styles.keyLight} />
      <div className={styles.beam} />
      <div className={styles.rimLight} />
      {interactive && <div ref={cursorLightRef} className={styles.cursorLight} />}
      <div className={styles.floor} />
      <div className={styles.grain} />
      <div className={styles.vignette} />
    </div>
  )
}
