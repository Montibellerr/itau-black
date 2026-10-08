import { cssVars } from '@/lib/cssVars'
import styles from './art.module.css'

/** Órbitas concêntricas: momentos e vantagens girando em torno de você. */
export function OrbitArt() {
  return (
    <div className={styles.orbit}>
      <span className={styles.ring} style={cssVars({ '--size': '96%' })} />
      <span className={styles.ring} style={cssVars({ '--size': '68%' })} />
      <span className={styles.ring} style={cssVars({ '--size': '40%' })} />
      <span className={styles.spinner} style={cssVars({ '--size': '96%', '--duration': '38s' })}>
        <i className={styles.planet} />
      </span>
      <span className={styles.spinner} style={cssVars({ '--size': '68%', '--duration': '26s', '--direction': 'reverse' })}>
        <i className={styles.planetMuted} />
      </span>
      <span className={styles.core} />
      <span className={styles.tag} style={cssVars({ '--x': '4%', '--y': '18%' })}>
        Viagens
      </span>
      <span className={styles.tag} style={cssVars({ '--x': '62%', '--y': '76%' })}>
        Eventos
      </span>
    </div>
  )
}
