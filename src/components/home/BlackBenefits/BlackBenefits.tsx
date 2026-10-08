import { useEffect, useRef, type ComponentType, type RefObject, type SVGProps } from 'react'
import { BellIcon, InfinityIcon, PlaneIcon, TicketIcon } from '@/components/ui/icons/icons'
import { Eyebrow } from '@/components/ui/typography/Eyebrow'
import { TwoToneTitle } from '@/components/ui/typography/TwoToneTitle'
import { benefitsContent } from '@/content/home'
import { useInViewAttribute } from '@/hooks/useInViewAttribute'
import { useRevealChildren } from '@/hooks/useRevealChildren'
import { cssVars } from '@/lib/cssVars'
import { cx } from '@/lib/cx'
import styles from './BlackBenefits.module.css'
import { ColumnStack } from './ColumnStack/ColumnStack'

const ICONS: Record<(typeof benefitsContent.items)[number]['icon'], ComponentType<SVGProps<SVGSVGElement>>> = {
  plane: PlaneIcon,
  bell: BellIcon,
  infinity: InfinityIcon,
  ticket: TicketIcon,
}

const delay = (seconds: number) => cssVars({ '--reveal-delay': `${seconds}s` })

/** Marca como ativo (`data-active`) o benefício que cruza o centro da viewport. */
function useActiveItem(listRef: RefObject<HTMLOListElement | null>) {
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const items = [...list.querySelectorAll<HTMLElement>('[data-benefit]')]

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          items.forEach((item) => {
            item.dataset.active = String(item === entry.target)
          })
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [listRef])
}

/** Volta ao universo Black: benefícios + coluna escultural de cartões. */
export function BlackBenefits() {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  useRevealChildren(sectionRef)
  useInViewAttribute(sectionRef)
  useActiveItem(listRef)
  const { eyebrow, title, lede, items } = benefitsContent

  return (
    <section
      ref={sectionRef}
      id="beneficios"
      className={styles.section}
      data-header-theme="black"
      aria-labelledby="beneficios-title"
    >
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <header className={styles.header}>
            <Eyebrow className="reveal">{eyebrow}</Eyebrow>
            <TwoToneTitle id="beneficios-title" {...title} className="reveal" style={delay(0.08)} />
            <p className={cx(styles.lede, 'reveal')} style={delay(0.16)}>
              {lede}
            </p>
          </header>

          <ol ref={listRef} id="lista-beneficios" className={styles.list}>
            {items.map((item, index) => {
              const Icon = ICONS[item.icon]
              return (
                <li key={item.title} className={cx(styles.item, 'reveal')} data-benefit>
                  <span className={styles.orb} aria-hidden="true">
                    <Icon />
                  </span>
                  <div className={styles.itemBody}>
                    <span className={styles.index} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemText}>{item.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <div className={styles.visual}>
          <div className={styles.sticky}>
            <ColumnStack sectionRef={sectionRef} />
          </div>
        </div>
      </div>
    </section>
  )
}
