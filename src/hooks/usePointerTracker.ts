import { useEffect, useState, type RefObject } from 'react'

export interface PointerSnapshot {
  clientX: number
  clientY: number
  /** Ponteiro está sobre a área monitorada. */
  inside: boolean
}

/**
 * Fonte única de posição do ponteiro. Guarda o estado em um objeto mutável
 * (sem re-render a cada movimento) e notifica assinantes, que decidem como
 * transformar a posição em movimento.
 */
export interface PointerTracker {
  readonly state: Readonly<PointerSnapshot>
  subscribe(listener: () => void): () => void
}

interface MutablePointerTracker extends PointerTracker {
  update(clientX: number, clientY: number, inside: boolean): void
}

function createPointerTracker(): MutablePointerTracker {
  const state: PointerSnapshot = { clientX: 0, clientY: 0, inside: false }
  const listeners = new Set<() => void>()

  return {
    state,
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    update(clientX, clientY, inside) {
      state.clientX = clientX
      state.clientY = clientY
      state.inside = inside
      listeners.forEach((listener) => listener())
    },
  }
}

/**
 * Observa o mouse/caneta na janela e marca se ele está sobre `areaRef`.
 * Ouvir a janela (e não só a área) mantém a reação contínua quando o cursor
 * passa por cima de elementos sobrepostos, como o header fixo.
 */
export function usePointerTracker(areaRef: RefObject<HTMLElement | null>, enabled: boolean): PointerTracker {
  const [tracker] = useState(createPointerTracker)

  useEffect(() => {
    const area = areaRef.current
    if (!area || !enabled) return

    let rect: DOMRect | null = null
    const invalidate = () => {
      rect = null
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      rect ??= area.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      tracker.update(event.clientX, event.clientY, inside)
    }

    const onLeaveWindow = (event: MouseEvent) => {
      if (event.relatedTarget === null) tracker.update(tracker.state.clientX, tracker.state.clientY, false)
    }
    const onBlur = () => tracker.update(tracker.state.clientX, tracker.state.clientY, false)

    const resizeObserver = new ResizeObserver(invalidate)
    resizeObserver.observe(area)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mouseout', onLeaveWindow)
    window.addEventListener('blur', onBlur)
    window.addEventListener('scroll', invalidate, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mouseout', onLeaveWindow)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('scroll', invalidate)
      onBlur()
    }
  }, [areaRef, enabled, tracker])

  return tracker
}
