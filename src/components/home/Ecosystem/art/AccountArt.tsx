import { useId } from 'react'
import { svgId } from '@/lib/svgId'
import styles from './art.module.css'

const CURVE = 'M0 150 C 50 148, 80 118, 130 122 S 210 96, 250 78 S 320 44, 360 36'

/** Linha de evolução abstrata + atalhos do dia a dia (valores omitidos de propósito). */
export function AccountArt() {
  const fillId = svgId(useId(), 'account-fill')

  return (
    <div className={styles.account}>
      <div className={styles.chartWrap}>
        <svg className={styles.chart} viewBox="0 0 360 190" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: 'var(--accent-500)', stopOpacity: 0.22 }} />
              <stop offset="1" style={{ stopColor: 'var(--accent-500)', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path className={styles.grid} d="M0 50H360M0 100H360M0 150H360" />
          <path d={`${CURVE} L360 190 L0 190 Z`} fill={`url(#${fillId})`} />
          <path className={styles.line} d={CURVE} pathLength={1} />
        </svg>
        <span className={styles.dot} />
      </div>
      <ul className={styles.chips}>
        <li>Pagamentos</li>
        <li>Transferências</li>
        <li>Controle</li>
      </ul>
    </div>
  )
}
