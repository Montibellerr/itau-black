import type { CSSProperties, Ref } from 'react'
import { BrandMark } from '@/components/brand/BrandMark'
import { ContactlessIcon } from '@/components/ui/icons/icons'
import type { CardVariant } from '@/data/cards'
import { cssVars } from '@/lib/cssVars'
import { cx } from '@/lib/cx'
import { CardChip } from './CardChip'
import { CardPattern } from './CardPattern'
import styles from './PaymentCard.module.css'

interface PaymentCardProps {
  ref?: Ref<HTMLDivElement>
  variant: CardVariant
  /** Categoria impressa no cartão (ex.: Black, Essencial). */
  tier?: string
  /**
   * Cartão liso (sem impressão, textura ou reflexos animados). Usado em pilhas
   * longas, onde só o cartão do topo precisa de detalhes — bem mais leve.
   */
  blank?: boolean
  /** Camadas empilhadas atrás da face que formam a espessura do cartão. */
  edgeLayers?: number
  /** Escurecimento atmosférico (0–1) para cartões mais distantes. */
  shade?: number
  /** Reflexos animados a cada frame: promove as camadas de luz no compositor. */
  live?: boolean
  /**
   * Fixa o universo visual do cartão (bordas, aro e escrita), independente da
   * seção onde ele aparece — ex.: um cartão Black dentro de uma seção Itaú.
   */
  theme?: 'black' | 'light'
  className?: string
  style?: CSSProperties
}

/**
 * Cartão 3D construído com HTML/CSS (sem imagem estática).
 *
 * Estrutura:
 *  - `.slice` × N  → fatias em Z negativo que dão espessura física à borda
 *  - `.face`       → frente do cartão: textura, guilhochê, conteúdo,
 *                    faixa de brilho (sheen), reflexo (glare) e aro de luz (rim)
 *
 * O reflexo e o brilho são controlados por variáveis CSS (`--gx`, `--gy`, `--go`,
 * `--sx`, `--so`) escritas pelo motor de movimento — só `transform` e `opacity`
 * mudam por frame, então tudo roda no compositor.
 */
export function PaymentCard({
  ref,
  variant,
  tier = '',
  blank = false,
  edgeLayers = 3,
  shade = 0,
  live = false,
  theme,
  className,
  style,
}: PaymentCardProps) {
  const slices = Array.from({ length: edgeLayers }, (_, index) => (index + 1) / edgeLayers)

  return (
    <div
      ref={ref}
      className={cx(styles.card, styles[variant], live && styles.live, className)}
      style={cssVars({ '--shade': shade, ...style })}
      data-theme={theme}
    >
      {slices.map((depth) => (
        <span key={depth} className={styles.slice} style={cssVars({ '--depth': depth })} />
      ))}

      <div className={styles.face}>
        {!blank && (
          <>
            <span className={styles.texture} />
            <CardPattern className={styles.pattern} />

            <div className={styles.content}>
              <div className={styles.top}>
                <BrandMark tone={variant === 'itau' ? 'white' : 'silver'} className={styles.brand} />
                <ContactlessIcon className={styles.contactless} />
              </div>

              <CardChip className={styles.chip} />

              <div className={styles.bottom}>
                <span className={styles.tier}>{tier}</span>
              </div>
            </div>

            <span className={styles.sheen} />
          </>
        )}
        <span className={styles.glare} />
        <span className={styles.rim} />
        <span className={styles.shade} />
      </div>
    </div>
  )
}
