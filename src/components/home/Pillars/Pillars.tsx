import { useRef, type ComponentType, type SVGProps } from 'react'
import { BoltIcon, OrbitIcon, ShieldIcon } from '@/components/ui/icons/icons'
import { Eyebrow } from '@/components/ui/typography/Eyebrow'
import { TwoToneTitle } from '@/components/ui/typography/TwoToneTitle'
import { pillarsContent } from '@/content/home'
import { useRevealChildren } from '@/hooks/useRevealChildren'
import { cssVars } from '@/lib/cssVars'
import { cx } from '@/lib/cx'
import styles from './Pillars.module.css'

const ICONS: Record<(typeof pillarsContent.items)[number]['icon'], ComponentType<SVGProps<SVGSVGElement>>> = {
  orbit: OrbitIcon,
  shield: ShieldIcon,
  bolt: BoltIcon,
}

const delay = (seconds: number) => cssVars({ '--reveal-delay': `${seconds}s` })

/** Segunda seção do universo Itaú: valor de marca em três pilares. */
export function Pillars() {
  const sectionRef = useRef<HTMLElement>(null)
  useRevealChildren(sectionRef)
  const { eyebrow, title, lede, items } = pillarsContent

  return (
    <section
      ref={sectionRef}
      id="experiencias"
      className={styles.section}
      data-theme="light"
      data-header-theme="light"
      aria-labelledby="pilares-title"
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div className={styles.introSticky}>
            <Eyebrow className="reveal">{eyebrow}</Eyebrow>
            <TwoToneTitle id="pilares-title" {...title} className={cx(styles.title, 'reveal')} style={delay(0.08)} />
            <p className={cx(styles.lede, 'reveal')} style={delay(0.16)}>
              {lede}
            </p>
          </div>
        </div>

        <ol className={styles.list}>
          {items.map((item, index) => {
            const Icon = ICONS[item.icon]
            return (
              <li key={item.title} className={cx(styles.item, 'reveal')} style={delay(0.05)}>
                <span className={styles.rule} aria-hidden="true" />
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={styles.itemBody}>
                  <span className={styles.icon} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemText}>{item.text}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
