import { useEffect, type RefObject } from 'react'

/**
 * Escreve `data-inview="true|false"` no elemento conforme ele entra/sai da tela.
 * O CSS usa o atributo para pausar animações contínuas fora da viewport.
 */
export function useInViewAttribute(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.inview = String(entry.isIntersecting)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
}
