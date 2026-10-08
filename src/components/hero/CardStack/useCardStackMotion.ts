import { useCallback, useLayoutEffect, useRef } from 'react'
import type { MotionTier } from '@/hooks/useMotionTier'
import type { PointerTracker } from '@/hooks/usePointerTracker'
import { bell, clamp, easeInOutCubic, lerp, smoothstep } from '@/lib/math'
import { Spring, type SpringConfig } from '@/lib/spring'
import { createWakeable } from '@/lib/ticker'
import { pickLayout } from './layouts'

/* ---------- Ajuste fino do movimento ---------- */
const POINTER: SpringConfig = { stiffness: 60, damping: 1 }
const ENGAGE: SpringConfig = { stiffness: 30, damping: 1 }
const SPREAD: SpringConfig = { stiffness: 55, damping: 0.95 }
const INTRO: SpringConfig = { stiffness: 22, damping: 1 }
const STAGE_INTRO: SpringConfig = { stiffness: 12, damping: 1 }
/** Cartões ao fundo seguem o ponteiro com mais "peso" (atraso orgânico). */
const followSpring = (index: number): SpringConfig => ({ stiffness: Math.max(48, 130 - index * 24), damping: 0.86 })

const STAGE_DELAY = 0.15
const INTRO_DELAY = 0.3
const INTRO_STAGGER = 0.13
const SWEEP_START = 0.72
const SWEEP_DURATION = 1.5

/* Reflexo em repouso: luz-chave vinda do canto superior esquerdo. */
const GLARE_REST = { x: -24, y: -30 }

const n3 = (value: number) => value.toFixed(3)

interface Options {
  tier: MotionTier
  pointer: PointerTracker
  count: number
}

/**
 * Motor de movimento do baralho 3D.
 *
 * - Todo valor animado é uma mola (física, não keyframes): interrupções no meio
 *   do movimento continuam suaves e a velocidade é preservada.
 * - Escreve `transform`/`opacity`/variáveis CSS direto no DOM — sem re-render
 *   do React por frame.
 * - O loop dorme quando todas as molas estão em repouso.
 */
export function useCardStackMotion({ tier, pointer, count }: Options) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const ambientRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const cardEls = useRef<(HTMLDivElement | null)[]>([])
  const introPlayed = useRef(false)

  const cardRef = useCallback(
    (index: number) => (element: HTMLDivElement | null) => {
      cardEls.current[index] = element
    },
    [],
  )

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    const ambient = ambientRef.current
    const shadow = shadowRef.current
    const cards = cardEls.current.slice(0, count).filter((el): el is HTMLDivElement => el !== null)
    if (!wrap || !stage || cards.length === 0) return

    const interactive = tier === 'full'
    const playIntro = tier !== 'static' && !introPlayed.current
    const total = cards.length

    let layout = pickLayout(wrap.clientWidth, total)
    let cardW = cards[0].offsetWidth
    let rect: DOMRect | null = null
    let elapsed = 0

    const tiltX = new Spring(0, POINTER)
    const tiltY = new Spring(0, POINTER)
    const engage = new Spring(0, ENGAGE)
    const spread = new Spring(0, SPREAD)
    const stageIntro = new Spring(playIntro ? 0 : 1, STAGE_INTRO)

    const items = cards.map((el, index) => ({
      el,
      tiltX: new Spring(0, followSpring(index)),
      tiltY: new Spring(0, followSpring(index)),
      intro: new Spring(playIntro ? 0 : 1, INTRO),
      delay: INTRO_DELAY + (total - 1 - index) * INTRO_STAGGER, // fundo entra primeiro
      depth: 1 - (index / Math.max(1, total - 1)) * 0.6,
      sweepStart: playIntro ? -1 : Number.POSITIVE_INFINITY,
      sweep: playIntro ? 0 : 1,
      opaque: !playIntro,
    }))

    /* ---------- Render: estado das molas → DOM ---------- */
    const render = () => {
      const L = layout
      const W = cardW
      const sx = tiltX.value
      const sy = tiltY.value
      const si = 1 - stageIntro.value
      const s = spread.value
      const e = engage.value

      stage.style.transform =
        `translate3d(${n3(sx * L.tilt.drift * W)}px, ${n3((sy * L.tilt.drift * 0.6 + L.stageIntro.y * si) * W)}px, 0) ` +
        `rotateX(${n3(L.stage.rx + L.stageIntro.rx * si - sy * L.tilt.stageX)}deg) ` +
        `rotateY(${n3(L.stage.ry + L.stageIntro.ry * si + sx * L.tilt.stageY)}deg) ` +
        `rotateZ(${n3(L.stage.rz + L.stageIntro.rz * si)}deg) ` +
        `translate3d(${n3(L.offset.x * W)}px, ${n3(L.offset.y * W)}px, ${n3(L.offset.z * W)}px)`

      items.forEach((item, i) => {
        const rest = L.cards[i]
        const fan = L.spread[i]
        const from = L.intro[i]
        const inv = 1 - item.intro.value
        const tx = item.tiltX.value
        const ty = item.tiltY.value

        const x = rest.x + fan.x * s + from.x * inv
        const y = rest.y + fan.y * s + from.y * inv
        const z = rest.z + fan.z * s + from.z * inv
        const rx = rest.rx + from.rx * inv - ty * L.tilt.cardX * item.depth
        const ry = rest.ry + from.ry * inv + tx * L.tilt.cardY * item.depth
        const rz = rest.rz + fan.rz * s + from.rz * inv
        const scale = rest.scale + from.scale * inv

        const style = item.el.style
        style.transform =
          `translate(-50%, -50%) translate3d(${n3(x * W)}px, ${n3(y * W)}px, ${n3(z * W)}px) ` +
          `rotateZ(${n3(rz)}deg) rotateX(${n3(rx)}deg) rotateY(${n3(ry)}deg) scale(${n3(scale)})`

        // Opacidade < 1 achata o contexto 3D; por isso é removida ao fim da entrada.
        if (!item.opaque) {
          const opacity = smoothstep(0.02, 0.5, item.intro.value)
          if (opacity >= 0.999) {
            style.opacity = ''
            item.opaque = true
          } else {
            style.opacity = n3(opacity)
          }
        }

        // Reflexo: em repouso vem da luz-chave; com o cursor, segue o cursor.
        const magnitude = Math.min(1, Math.hypot(tx, ty))
        style.setProperty('--gx', `${n3(lerp(GLARE_REST.x, tx * 34, e))}%`)
        style.setProperty('--gy', `${n3(lerp(GLARE_REST.y, ty * 30, e))}%`)
        style.setProperty('--go', n3((0.6 + e * (0.2 + 0.35 * magnitude)) * (0.5 + 0.5 * item.depth)))

        // Brilho: varredura única na entrada; depois desliza conforme a inclinação.
        const sweeping = item.sweep > 0 && item.sweep < 1
        const sheenX = sweeping ? lerp(-140, 140, easeInOutCubic(item.sweep)) : -tx * 60
        const sheenO = sweeping ? bell(item.sweep) * item.depth : e * (0.12 + 0.55 * Math.abs(tx)) * item.depth
        style.setProperty('--sx', `${n3(sheenX)}%`)
        style.setProperty('--so', n3(sheenO))
      })

      if (ambient) {
        ambient.style.transform = `translate3d(${n3(sx * 5)}%, ${n3(sy * 4)}%, 0) scale(${n3(1 + s * 0.08 - si * 0.2)})`
      }
      if (shadow) {
        shadow.style.transform = `translate3d(${n3(-sx * 6)}%, ${n3(si * 20)}%, 0) scale(${n3(1 + s * 0.06 - si * 0.25)})`
        shadow.style.opacity = n3((1 - si) * (0.85 - s * 0.15))
      }
    }

    /* ---------- Simulação ---------- */
    const step = (dt: number) => {
      elapsed += dt
      let introBusy = false
      let busy = false

      if (playIntro && !introPlayed.current) {
        if (elapsed >= STAGE_DELAY) stageIntro.target = 1
        for (const item of items) {
          if (elapsed >= item.delay) item.intro.target = 1
          else introBusy = true

          if (item.sweepStart < 0 && item.intro.value > SWEEP_START) item.sweepStart = elapsed
          if (item.sweepStart < 0) {
            introBusy = true
          } else if (item.sweep < 1) {
            item.sweep = clamp((elapsed - item.sweepStart) / SWEEP_DURATION)
            introBusy = true
          }
        }
      }

      if (!stageIntro.step(dt)) introBusy = true
      for (const spring of [tiltX, tiltY, engage, spread]) {
        if (!spring.step(dt)) busy = true
      }
      for (const item of items) {
        if (!item.intro.step(dt)) introBusy = true
        if (!item.tiltX.step(dt)) busy = true
        if (!item.tiltY.step(dt)) busy = true
      }

      render()

      if (playIntro && !introBusy) introPlayed.current = true
      return busy || introBusy
    }

    const loop = createWakeable(step)

    /* ---------- Entrada do ponteiro ---------- */
    const onPointer = () => {
      const p = pointer.state
      rect ??= wrap.getBoundingClientRect()

      let nx = 0
      let ny = 0
      let overDeck = false

      if (p.inside) {
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const rangeX = Math.max(rect.width * 0.75, window.innerWidth * 0.45)
        const rangeY = Math.max(rect.height * 0.75, window.innerHeight * 0.4)
        nx = clamp((p.clientX - cx) / rangeX, -1, 1)
        ny = clamp((p.clientY - cy) / rangeY, -1, 1)
        overDeck = Math.abs(p.clientX - cx) < cardW * 0.8 && Math.abs(p.clientY - cy) < cardW * 0.6
      }

      tiltX.target = nx
      tiltY.target = ny
      engage.target = p.inside ? 1 : 0
      spread.target = overDeck ? 1 : 0
      for (const item of items) {
        item.tiltX.target = nx
        item.tiltY.target = ny
      }
      loop.wake()
    }

    const invalidateRect = () => {
      rect = null
    }

    const resizeObserver = new ResizeObserver(() => {
      layout = pickLayout(wrap.clientWidth, total)
      cardW = cards[0].offsetWidth
      rect = null
      loop.wake()
    })

    // Pose inicial antes do primeiro paint (evita "piscar" a pose final).
    render()
    resizeObserver.observe(wrap)
    loop.wake()

    const unsubscribe = interactive ? pointer.subscribe(onPointer) : undefined
    if (interactive) window.addEventListener('scroll', invalidateRect, { passive: true })

    return () => {
      loop.stop()
      unsubscribe?.()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', invalidateRect)
    }
  }, [tier, pointer, count])

  return { wrapRef, stageRef, ambientRef, shadowRef, cardRef }
}
