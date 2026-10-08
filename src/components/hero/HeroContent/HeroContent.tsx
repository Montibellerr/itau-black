import { ButtonLink } from '@/components/ui/Button/ButtonLink'
import { ArrowRightIcon } from '@/components/ui/icons/icons'
import { heroContent } from '@/content/hero'
import { cssVars } from '@/lib/cssVars'
import { cx } from '@/lib/cx'
import styles from './HeroContent.module.css'

/** Atraso de entrada (s) de cada bloco — coreografado com o baralho. */
const delay = (seconds: number) => cssVars({ '--delay': `${seconds}s` })

export function HeroContent() {
  const { eyebrow, title, lede, primaryCta, secondaryCta } = heroContent

  return (
    <div className={styles.content}>
      <p className={styles.eyebrow} style={delay(0.35)}>
        {eyebrow}
      </p>

      <h1 id="hero-title" className={styles.title}>
        <span className={styles.line}>
          <span className={styles.lineInner} style={delay(0.45)}>
            {title.lead}
          </span>
        </span>{' '}
        <span className={styles.line}>
          <span className={cx(styles.lineInner, styles.accent)} style={delay(0.58)}>
            {title.accent}
            <span className={styles.period}>.</span>
          </span>
        </span>
      </h1>

      <p className={styles.lede} style={delay(0.85)}>
        {lede}
      </p>

      <div className={styles.actions} style={delay(1)}>
        <ButtonLink href={primaryCta.href} icon={<ArrowRightIcon />}>
          {primaryCta.label}
        </ButtonLink>
        <ButtonLink href={secondaryCta.href} variant="ghost">
          {secondaryCta.label}
        </ButtonLink>
      </div>
    </div>
  )
}
