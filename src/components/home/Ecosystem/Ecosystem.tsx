import { useRef, type ComponentType } from 'react'
import { Eyebrow } from '@/components/ui/typography/Eyebrow'
import { TwoToneTitle } from '@/components/ui/typography/TwoToneTitle'
import { ecosystemContent } from '@/content/home'
import { useRevealChildren } from '@/hooks/useRevealChildren'
import { cssVars } from '@/lib/cssVars'
import { cx } from '@/lib/cx'
import { AccountArt } from './art/AccountArt'
import { CardsArt } from './art/CardsArt'
import { ChatArt } from './art/ChatArt'
import { OrbitArt } from './art/OrbitArt'
import styles from './Ecosystem.module.css'

const ART: Record<(typeof ecosystemContent.items)[number]['art'], ComponentType> = {
  cards: CardsArt,
  account: AccountArt,
  orbit: OrbitArt,
  chat: ChatArt,
}

const delay = (seconds: number) => cssVars({ '--reveal-delay': `${seconds}s` })

/** Primeira seção do universo Itaú: o ecossistema em blocos editoriais. */
export function Ecosystem() {
  const sectionRef = useRef<HTMLElement>(null)
  useRevealChildren(sectionRef)
  const { eyebrow, title, lede, items } = ecosystemContent

  return (
    <section
      ref={sectionRef}
      id="ecossistema"
      className={styles.section}
      data-theme="light"
      data-header-theme="light"
      aria-labelledby="ecossistema-title"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <Eyebrow className="reveal">{eyebrow}</Eyebrow>
          <TwoToneTitle id="ecossistema-title" {...title} className={cx(styles.title, 'reveal')} style={delay(0.08)} />
          <p className={cx(styles.lede, 'reveal')} style={delay(0.16)}>
            {lede}
          </p>
        </header>

        <div className={styles.grid}>
          {items.map((item, index) => {
            const Art = ART[item.art]
            return (
              <article
                key={item.id}
                id={item.id}
                className={cx(styles.tile, styles[item.size], 'reveal')}
                style={delay(0.06 + (index % 2) * 0.1)}
              >
                <div className={styles.art} aria-hidden="true">
                  <Art />
                </div>
                <div className={styles.body}>
                  <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                  <h3 className={styles.tileTitle}>{item.title}</h3>
                  <p className={styles.tileText}>{item.text}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
