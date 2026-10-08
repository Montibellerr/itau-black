import { PaymentCard } from '@/components/card/PaymentCard/PaymentCard'
import { cx } from '@/lib/cx'
import styles from './art.module.css'

/** Dois cartões reais em perspectiva: o laranja Itaú à frente e o Black atrás. */
export function CardsArt() {
  return (
    <div className={styles.cards}>
      <div className={styles.cardsStage}>
        {/* Mesmo universo dos demais cartões Black: borda e escrita azuis */}
        <PaymentCard
          variant="black"
          tier="Black"
          theme="black"
          edgeLayers={2}
          className={cx(styles.cardBack)}
        />
        <PaymentCard
          variant="itau"
          tier="Essencial"
          edgeLayers={2}
          className={cx(styles.cardFront)}
        />
      </div>
    </div>
  )
}
