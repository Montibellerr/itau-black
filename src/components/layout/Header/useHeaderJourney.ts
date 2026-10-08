import { useEffect, type RefObject } from 'react'
import { clamp } from '@/lib/math'
import { createWakeable } from '@/lib/ticker'

type HeaderTheme = 'black' | 'light'

interface Zone {
  top: number
  height: number
  from: HeaderTheme
  /** Zonas de transição: tema após o ponto de virada. */
  to?: HeaderTheme
  split: number
}

const SCROLLED_AFTER = 8

const asTheme = (value: string | undefined): HeaderTheme => (value === 'light' ? 'light' : 'black')

/**
 * Faz o header acompanhar a jornada visual da página.
 *
 * Cada seção declara o universo sob o header com `data-header-theme`; as
 * transições declaram também `data-header-theme-to` e o ponto de virada
 * (`data-header-split`, no mesmo progresso usado pela cena). As posições
 * ficam em cache e só são remedidas quando o layout muda.
 */
export function useHeaderJourney(headerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    let zones: Zone[] = []
    let headerLine = 0

    const measure = () => {
      headerLine = header.offsetHeight / 2
      zones = [...document.querySelectorAll<HTMLElement>('[data-header-theme]')].map((el) => {
        const rect = el.getBoundingClientRect()
        return {
          top: rect.top + window.scrollY,
          height: rect.height,
          from: asTheme(el.dataset.headerTheme),
          to: el.dataset.headerThemeTo ? asTheme(el.dataset.headerThemeTo) : undefined,
          split: Number(el.dataset.headerSplit ?? 0.5),
        }
      })
    }

    const update = () => {
      const scrollY = window.scrollY
      const line = scrollY + headerLine
      let theme: HeaderTheme = 'black'

      for (const zone of zones) {
        if (line < zone.top || line >= zone.top + zone.height) continue
        if (zone.to) {
          const progress = clamp((scrollY - zone.top) / Math.max(1, zone.height - window.innerHeight))
          theme = progress < zone.split ? zone.from : zone.to
        } else {
          theme = zone.from
        }
        break
      }

      header.dataset.theme = theme
      header.dataset.scrolled = String(scrollY > SCROLLED_AFTER)
      return false
    }

    const loop = createWakeable(update)
    const onScroll = () => loop.wake()
    const onLayout = () => {
      measure()
      loop.wake()
    }

    const resizeObserver = new ResizeObserver(onLayout)
    resizeObserver.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onLayout)

    // Estado inicial síncrono (ex.: página recarregada no meio da jornada).
    measure()
    update()

    return () => {
      loop.stop()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onLayout)
    }
  }, [headerRef])
}
