import { useEffect, useRef } from 'react'
import type { PointerTracker } from '@/hooks/usePointerTracker'
import { Spring } from '@/lib/spring'
import { createWakeable } from '@/lib/ticker'

const FOLLOW = { stiffness: 40, damping: 1 }
const FADE = { stiffness: 18, damping: 1 }

/** Luz difusa que acompanha o cursor com atraso suave. */
export function useCursorLight(pointer: PointerTracker, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const light = ref.current
    const area = light?.parentElement
    if (!light || !area || !enabled) return

    const x = new Spring(0, FOLLOW)
    const y = new Spring(0, FOLLOW)
    const opacity = new Spring(0, FADE)
    let rect: DOMRect | null = null
    let placed = false

    const loop = createWakeable((dt) => {
      const busy = [x.step(dt), y.step(dt), opacity.step(dt)].includes(false)
      light.style.transform = `translate3d(${x.value.toFixed(1)}px, ${y.value.toFixed(1)}px, 0) translate(-50%, -50%)`
      light.style.opacity = opacity.value.toFixed(3)
      return busy
    })

    const onPointer = () => {
      const p = pointer.state
      rect ??= area.getBoundingClientRect()
      const localX = p.clientX - rect.left
      const localY = p.clientY - rect.top

      // Na primeira entrada a luz nasce sob o cursor, sem "viajar" do canto.
      if (!placed) {
        x.value = x.target = localX
        y.value = y.target = localY
        placed = true
      }
      x.target = localX
      y.target = localY
      opacity.target = p.inside ? 1 : 0
      loop.wake()
    }

    const invalidate = () => {
      rect = null
    }

    const unsubscribe = pointer.subscribe(onPointer)
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate)

    return () => {
      loop.stop()
      unsubscribe()
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('resize', invalidate)
    }
  }, [pointer, enabled])

  return ref
}
