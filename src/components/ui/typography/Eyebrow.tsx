import type { CSSProperties, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './typography.module.css'

interface EyebrowProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/** Rótulo de seção: fio na cor de acento + texto em caixa alta espaçada. */
export function Eyebrow({ children, className, style }: EyebrowProps) {
  return (
    <p className={cx(styles.eyebrow, className)} style={style}>
      {children}
    </p>
  )
}
