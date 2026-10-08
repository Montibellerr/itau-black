import { heroContent } from '@/content/hero'
import styles from './HeroMeta.module.css'

/**
 * Faixa inferior da hero: destaques curtos.
 * (O aviso de projeto conceitual fica no rodapé da página.)
 */
export function HeroMeta() {
  return (
    <div className={styles.meta}>
      <div className={styles.inner}>
        <ul className={styles.highlights} aria-label="Destaques do cartão">
          {heroContent.highlights.map((item) => (
            <li key={item} className={styles.highlight}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
