import type { CSSProperties } from 'react'
import type { TwoToneTitle as TwoToneTitleContent } from '@/content/home'
import { cx } from '@/lib/cx'
import styles from './typography.module.css'

interface TwoToneTitleProps extends TwoToneTitleContent {
  id?: string
  as?: 'h2' | 'h3'
  size?: 'lg' | 'xl'
  className?: string
  style?: CSSProperties
}

/**
 * Título em dois tons, na mesma linguagem da hero: trecho principal em
 * destaque, complemento em tom secundário e ponto final na cor de acento.
 */
export function TwoToneTitle({ lead, muted, id, as: Tag = 'h2', size = 'lg', className, style }: TwoToneTitleProps) {
  return (
    <Tag id={id} className={cx(styles.title, styles[size], className)} style={style}>
      {lead} <span className={styles.muted}>{muted}</span>
      <span className={styles.period}>.</span>
    </Tag>
  )
}
