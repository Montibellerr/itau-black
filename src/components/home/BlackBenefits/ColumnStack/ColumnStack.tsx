import type { RefObject } from 'react'
import { PaymentCard } from '@/components/card/PaymentCard/PaymentCard'
import type { CardVariant } from '@/data/cards'
import { usePointerTracker } from '@/hooks/usePointerTracker'
import { useMotion } from '@/providers/motion-context'
import styles from './ColumnStack.module.css'
import { useColumnStackMotion } from './useColumnStackMotion'

/** Acabamentos alternados das placas lisas (variação sutil entre camadas). */
const FINISHES: CardVariant[] = ['graphite', 'onyx', 'titanium', 'black']
const MAX_SHADE = 0.28

interface ColumnStackProps {
  /** Seção que controla o scroll e a área de interação do ponteiro. */
  sectionRef: RefObject<HTMLElement | null>
}

/**
 * Coluna escultural de cartões Black empilhados, inspirada na pilha da
 * referência. Só o cartão do topo tem impressão; os demais são placas lisas
 * (bem mais leves) cujas bordas iluminadas desenham a coluna.
 */
export function ColumnStack({ sectionRef }: ColumnStackProps) {
  const tier = useMotion()
  const pointer = usePointerTracker(sectionRef, tier === 'full')
  const count = tier === 'lite' ? 7 : 9
  const { wrapRef, stageRef, cardRef } = useColumnStackMotion({ tier, pointer, count })
  const edgeLayers = tier === 'lite' ? 1 : 2

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      data-tier={tier}
      role="img"
      aria-label="Ilustração: coluna de cartões Black empilhados que se abre em um arco elegante."
    >
      <div className={styles.glow} />
      <div className={styles.reflection} />

      <div className={styles.scene}>
        <div className={styles.float}>
          <div ref={stageRef} className={styles.stage}>
            {Array.from({ length: count }, (_, index) =>
              index === 0 ? (
                <PaymentCard
                  key={index}
                  ref={cardRef(index)}
                  variant="black"
                  tier="Black"
                  edgeLayers={edgeLayers}
                  live={tier === 'full'}
                  className={styles.card}
                />
              ) : (
                <PaymentCard
                  key={index}
                  ref={cardRef(index)}
                  variant={FINISHES[(index - 1) % FINISHES.length]}
                  blank
                  edgeLayers={edgeLayers}
                  shade={(index / (count - 1)) * MAX_SHADE}
                  className={styles.card}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
