import { BrandMark } from '@/components/brand/BrandMark'
import styles from './art.module.css'

/** Conversa ilustrativa com o atendimento (decorativa, sem funcionalidade real). */
export function ChatArt() {
  return (
    <div className={styles.chat}>
      <div className={styles.row}>
        <BrandMark tone="orange" className={styles.avatar} />
        <p className={styles.bubbleIn}>Olá! Como posso ajudar hoje?</p>
      </div>
      <div className={styles.rowOut}>
        <p className={styles.bubbleOut}>Quero conhecer os benefícios do cartão.</p>
      </div>
      <div className={styles.row}>
        <BrandMark tone="orange" className={styles.avatar} />
        <p className={styles.typing}>
          <i />
          <i />
          <i />
        </p>
      </div>
    </div>
  )
}
