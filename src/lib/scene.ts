import { clamp } from './math'
import { createWakeable } from './ticker'

/** Métricas de um elemento em coordenadas do documento (medidas só em resize). */
export interface SceneMetrics {
  top: number
  height: number
  vh: number
  scrollY: number
}

/**
 * Observa um elemento ao longo do scroll e chama `onFrame` no máximo uma vez
 * por frame. As posições ficam em cache e são remedidas apenas quando o layout
 * muda (ResizeObserver) — nenhuma leitura de layout acontece durante o scroll.
 *
 * `onFrame` pode retornar `true` para pedir mais frames (ex.: molas em movimento).
 */
export function observeScene(element: HTMLElement, onFrame: (metrics: SceneMetrics, dt: number) => boolean | void) {
  const metrics: SceneMetrics = { top: 0, height: 0, vh: window.innerHeight, scrollY: window.scrollY }

  const measure = () => {
    const rect = element.getBoundingClientRect()
    metrics.top = rect.top + window.scrollY
    metrics.height = rect.height
    metrics.vh = window.innerHeight
  }

  const loop = createWakeable((dt) => {
    metrics.scrollY = window.scrollY
    return onFrame(metrics, dt) === true
  })

  const onScroll = () => loop.wake()
  const onResize = () => {
    measure()
    loop.wake()
  }

  const resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(element)
  resizeObserver.observe(document.body)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)

  // Primeiro frame síncrono: o estado inicial já sai pintado (sem esperar rAF).
  measure()
  metrics.scrollY = window.scrollY
  if (onFrame(metrics, 0) === true) loop.wake()

  return () => {
    loop.stop()
    resizeObserver.disconnect()
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
  }
}

/** Cenas fixadas (sticky): 0 quando o topo encosta no topo da viewport, 1 quando a base encosta na base. */
export const pinnedProgress = ({ top, height, vh, scrollY }: SceneMetrics) =>
  clamp((scrollY - top) / Math.max(1, height - vh))

/** 0 quando o topo do elemento aparece na base da viewport, 1 quando chega ao topo. */
export const enterProgress = ({ top, vh, scrollY }: SceneMetrics) => clamp((scrollY + vh - top) / vh)
