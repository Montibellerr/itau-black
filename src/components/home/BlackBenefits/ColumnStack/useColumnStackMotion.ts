import { useCallback, useLayoutEffect, useRef } from 'react'
import type { MotionTier } from '@/hooks/useMotionTier'
import type { PointerTracker } from '@/hooks/usePointerTracker'
import { clamp, lerp, smoothstep } from '@/lib/math'
import { enterProgress, observeScene, pinnedProgress } from '@/lib/scene'
import { Spring, type SpringConfig } from '@/lib/spring'
import { createWakeable } from '@/lib/ticker'

/* ---------- Geometria (larguras de cartão e graus) ---------- */
/** Inclinação das placas: vistas de cima, como na pilha de referência. */
const TILT_X = 56
/** Rotação no próprio plano (diagonal) da pilha fechada. */
const BASE_RZ = -28
/** Espaçamento vertical entre placas: fechado → aberto. */
const GAP = { closed: 0.03, open: 0.074 }
/**
 * Leque: cada placa gira no próprio plano em torno de um pivô na extremidade
 * esquerda ("lombada"). A lombada fica alinhada e as pontas se abrem em arco.
 * As placas continuam paralelas, então nunca se interceptam.
 */
const FAN = { top: 8, bottom: -34 }
const PIVOT_X = -0.4
/** Curvatura lateral sutil da lombada no meio da coluna. */
const BOW = 0.05
/** Abertura fixa no modo de movimento reduzido. */
const STATIC_OPEN = 0.75

const REVEAL: SpringConfig = { stiffness: 20, damping: 1 }
const OPEN: SpringConfig = { stiffness: 16, damping: 0.95 }
const POINTER: SpringConfig = { stiffness: 45, damping: 1 }
const ENGAGE: SpringConfig = { stiffness: 25, damping: 1 }

const DESKTOP_QUERY = '(min-width: 1024px)'
const n3 = (value: number) => value.toFixed(3)

interface Options {
  tier: MotionTier
  pointer: PointerTracker
  count: number
}

/**
 * Motor da coluna de cartões: o scroll revela a pilha (as placas sobem e se
 * assentam do topo para a base) e depois a abre em um arco espiral.
 * Molas suavizam o scroll; o ponteiro inclina o conjunto levemente.
 */
export function useColumnStackMotion({ tier, pointer, count }: Options) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cardEls = useRef<(HTMLDivElement | null)[]>([])

  const cardRef = useCallback(
    (index: number) => (element: HTMLDivElement | null) => {
      cardEls.current[index] = element
    },
    [],
  )

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    const cards = cardEls.current.slice(0, count).filter((el): el is HTMLDivElement => el !== null)
    if (!wrap || !stage || cards.length === 0) return

    // A seção que dirige o scroll é encontrada pelo DOM, não por uma ref do pai:
    // em layout effects de filhos, as refs do componente pai ainda são null.
    const section = wrap.closest('section') ?? wrap

    const animated = tier !== 'static'
    const interactive = tier === 'full'
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const total = cards.length

    let cardW = cards[0].offsetWidth
    let rect: DOMRect | null = null

    const reveal = new Spring(animated ? 0 : 1, REVEAL)
    const open = new Spring(animated ? 0 : STATIC_OPEN, OPEN)
    const tiltX = new Spring(0, POINTER)
    const tiltY = new Spring(0, POINTER)
    const engage = new Spring(0, ENGAGE)

    const render = () => {
      const W = cardW
      const o = open.value
      const r = reveal.value
      const tx = tiltX.value
      const ty = tiltY.value
      const gap = lerp(GAP.closed, GAP.open, o)

      stage.style.transform = `rotateX(${n3(-ty * 5)}deg) rotateY(${n3(tx * 9)}deg)`

      const pivot = PIVOT_X * W

      cards.forEach((el, i) => {
        const t = total > 1 ? i / (total - 1) : 0

        // Abertura: espaçamento + leque em torno da lombada + arco sutil
        const y = (i - (total - 1) / 2) * gap
        const x = (Math.sin(t * Math.PI) * BOW - BOW * 0.5) * o
        const fan = lerp(FAN.top, FAN.bottom, t) * o

        // Revelação escalonada: o topo chega primeiro, a base por último
        const local = clamp((r - t * 0.4) / 0.6)
        const eased = 1 - (1 - local) ** 3
        const enterY = (1 - eased) * (0.32 + 0.3 * t)
        const enterFan = (1 - eased) * 14

        el.style.transform =
          `translate(-50%, -50%) translate3d(${n3(x * W)}px, ${n3((y + enterY) * W)}px, 0) ` +
          `rotateX(${TILT_X}deg) rotateZ(${BASE_RZ}deg) ` +
          `translate(${n3(pivot)}px, 0) rotateZ(${n3(fan + enterFan)}deg) translate(${n3(-pivot)}px, 0)`

        // Opacidade < 1 achata o contexto 3D: removida quando o cartão assenta.
        const opacity = smoothstep(0, 0.65, local)
        el.style.opacity = opacity >= 0.999 ? '' : n3(opacity)
      })

      // Reflexo no cartão do topo acompanha o ponteiro
      const top = cards[0].style
      const e = engage.value
      top.setProperty('--gx', `${n3(lerp(-24, tx * 32, e))}%`)
      top.setProperty('--gy', `${n3(lerp(-30, ty * 28, e))}%`)
      top.setProperty('--go', n3(0.7 + e * 0.3))
    }

    const step = (dt: number) => {
      let busy = false
      for (const spring of [reveal, open, tiltX, tiltY, engage]) {
        if (!spring.step(dt)) busy = true
      }
      render()
      return busy
    }

    const loop = createWakeable(step)

    const stopScene = animated
      ? observeScene(section, (metrics) => {
          if (desktop.matches) {
            // Desktop: a coluna fica fixa (sticky) enquanto os benefícios rolam.
            reveal.target = smoothstep(0.1, 0.85, enterProgress(metrics))
            open.target = 0.12 + 0.88 * smoothstep(0.02, 0.72, pinnedProgress(metrics))
          } else {
            // Mobile: a coluna está no topo da seção e rola normalmente.
            const entered = (metrics.scrollY + metrics.vh - metrics.top) / metrics.vh
            reveal.target = smoothstep(0.08, 0.5, entered)
            open.target = smoothstep(0.4, 1.05, entered)
          }
          loop.wake()
        })
      : undefined

    const onPointer = () => {
      const p = pointer.state
      rect ??= wrap.getBoundingClientRect()
      let nx = 0
      let ny = 0
      if (p.inside) {
        nx = clamp((p.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.75), -1, 1)
        ny = clamp((p.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.75), -1, 1)
      }
      tiltX.target = nx
      tiltY.target = ny
      engage.target = p.inside ? 1 : 0
      loop.wake()
    }
    const invalidateRect = () => {
      rect = null
    }

    const resizeObserver = new ResizeObserver(() => {
      cardW = cards[0].offsetWidth
      rect = null
      loop.wake()
    })

    render()
    resizeObserver.observe(wrap)
    loop.wake()

    const unsubscribe = interactive ? pointer.subscribe(onPointer) : undefined
    if (interactive) window.addEventListener('scroll', invalidateRect, { passive: true })

    return () => {
      loop.stop()
      stopScene?.()
      unsubscribe?.()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', invalidateRect)
    }
  }, [tier, pointer, count])

  return { wrapRef, stageRef, cardRef }
}
