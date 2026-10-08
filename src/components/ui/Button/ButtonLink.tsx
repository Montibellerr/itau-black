import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'ghost'
export type ButtonSize = 'md' | 'sm'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
}

/** Link de navegação com aparência de botão (semântica de `<a>`). */
export function ButtonLink({ variant = 'primary', size = 'md', icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <a className={cx(styles.button, styles[variant], styles[size], className)} {...rest}>
      <span className={styles.label}>{children}</span>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </a>
  )
}
