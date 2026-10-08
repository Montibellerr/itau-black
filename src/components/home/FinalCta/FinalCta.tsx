import { useRef, useState } from 'react'
import { Footer } from '@/components/layout/Footer/Footer'
import { Button } from '@/components/ui/Button/Button'
import { ButtonLink } from '@/components/ui/Button/ButtonLink'
import { ArrowRightIcon } from '@/components/ui/icons/icons'
import { Eyebrow } from '@/components/ui/typography/Eyebrow'
import { TwoToneTitle } from '@/components/ui/typography/TwoToneTitle'
import { finalCtaContent } from '@/content/home'
import { useRevealChildren } from '@/hooks/useRevealChildren'
import { cssVars } from '@/lib/cssVars'
import { cx } from '@/lib/cx'
import styles from './FinalCta.module.css'

const delay = (seconds: number) => cssVars({ '--reveal-delay': `${seconds}s` })

/**
 * Encerramento da Home: base Black com um horizonte de luz que funde o azul
 * do universo Black ao laranja do universo Itaú.
 */
export function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null)
  const [noticeVisible, setNoticeVisible] = useState(false)
  useRevealChildren(sectionRef)
  const { eyebrow, title, lede, primaryCta, secondaryCta, tertiaryCta, demoNotice } = finalCtaContent

  return (
    <section
      ref={sectionRef}
      id="proximo-nivel"
      className={styles.section}
      data-header-theme="black"
      aria-labelledby="final-title"
    >
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.grain} />
      </div>

      <div className={styles.inner}>
        <Eyebrow className="reveal">{eyebrow}</Eyebrow>
        <TwoToneTitle id="final-title" size="xl" {...title} className={cx(styles.title, 'reveal')} style={delay(0.08)} />
        <p className={cx(styles.lede, 'reveal')} style={delay(0.16)}>
          {lede}
        </p>

        <div className={cx(styles.actions, 'reveal')} style={delay(0.24)}>
          <Button icon={<ArrowRightIcon />} onClick={() => setNoticeVisible(true)}>
            {primaryCta}
          </Button>
          <ButtonLink href={secondaryCta.href} variant="ghost">
            {secondaryCta.label}
          </ButtonLink>
        </div>

        <a className={cx(styles.textLink, 'reveal')} style={delay(0.32)} href={tertiaryCta.href}>
          {tertiaryCta.label}
          <ArrowRightIcon />
        </a>

        {/* Ação demonstrativa: informa que nada é enviado (leitores de tela anunciam) */}
        <p className={styles.notice} role="status" data-visible={noticeVisible}>
          {noticeVisible ? demoNotice : ''}
        </p>
      </div>

      {/*
        Horizonte ancorado no fluxo, logo abaixo do conteúdo: o topo do arco
        mantém sempre um respiro fixo em relação aos links, em qualquer altura de tela.
      */}
      <div className={styles.horizonAnchor} aria-hidden="true">
        <div className={styles.planet} />
        <div className={styles.horizonGlow} />
        <div className={styles.horizon} />
      </div>

      <Footer />
    </section>
  )
}
