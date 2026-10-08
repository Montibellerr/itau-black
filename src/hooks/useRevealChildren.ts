import { useEffect, type RefObject } from 'react'

/**
 * Revela (uma única vez) os elementos `.reveal` dentro de `rootRef` quando
 * entram na viewport, marcando `data-revealed="true"`. A animação é CSS.
 */
export function useRevealChildren(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          target.dataset.revealed = 'true'
          observer.unobserve(target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    root.querySelectorAll<HTMLElement>('.reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [rootRef])
}
