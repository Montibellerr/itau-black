import { useRef } from 'react'
import { useInViewAttribute } from '@/hooks/useInViewAttribute'
import { usePointerTracker } from '@/hooks/usePointerTracker'
import { useMotion } from '@/providers/motion-context'
import { CardStack } from '../CardStack/CardStack'
import { HeroBackdrop } from '../HeroBackdrop/HeroBackdrop'
import { HeroContent } from '../HeroContent/HeroContent'
import { HeroMeta } from '../HeroMeta/HeroMeta'
import styles from './Hero.module.css'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const tier = useMotion()
  const pointer = usePointerTracker(sectionRef, tier === 'full')
  useInViewAttribute(sectionRef)

  return (
    <section
      ref={sectionRef}
      id="topo"
      className={styles.hero}
      aria-labelledby="hero-title"
      data-tier={tier}
      data-header-theme="black"
    >
      <HeroBackdrop tier={tier} pointer={pointer} />

      <div className={styles.inner}>
        <HeroContent />
        <div className={styles.visual}>
          <CardStack tier={tier} pointer={pointer} />
        </div>
      </div>

      <HeroMeta />
    </section>
  )
}
