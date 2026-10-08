import { PaymentCard } from '@/components/card/PaymentCard/PaymentCard'
import { heroCards, type CardData } from '@/data/cards'
import type { MotionTier } from '@/hooks/useMotionTier'
import type { PointerTracker } from '@/hooks/usePointerTracker'
import styles from './CardStack.module.css'
import { useCardStackMotion } from './useCardStackMotion'

interface CardStackProps {
  tier: MotionTier
  pointer: PointerTracker
  cards?: CardData[]
}

/** Escurecimento máximo do cartão mais distante (perspectiva atmosférica). */
const MAX_SHADE = 0.3

/**
 * Baralho de cartões 3D flutuando em perspectiva.
 *
 * Hierarquia 3D:
 *   wrap (container query) → scene (perspective) → float (flutuação CSS)
 *   → stage (rotação + parallax via JS) → cartões (pose individual via JS)
 */
export function CardStack({ tier, pointer, cards = heroCards }: CardStackProps) {
  const { wrapRef, stageRef, ambientRef, shadowRef, cardRef } = useCardStackMotion({
    tier,
    pointer,
    count: cards.length,
  })

  const edgeLayers = tier === 'lite' ? 1 : 3
  const lastIndex = Math.max(1, cards.length - 1)

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      data-tier={tier}
      role="img"
      aria-label="Ilustração: cartões Itaú Black sobrepostos como um baralho, flutuando em perspectiva."
    >
      <div ref={ambientRef} className={styles.ambient} />
      <div ref={shadowRef} className={styles.floorShadow} />

      <div className={styles.scene}>
        <div className={styles.float}>
          <div ref={stageRef} className={styles.stage}>
            {cards.map(({ id, ...card }, index) => (
              <PaymentCard
                key={id}
                ref={cardRef(index)}
                {...card}
                edgeLayers={edgeLayers}
                shade={(index / lastIndex) * MAX_SHADE}
                live={tier === 'full'}
                className={styles.card}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
