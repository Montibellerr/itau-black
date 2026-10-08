/**
 * Um único loop de requestAnimationFrame compartilhado por todas as animações.
 * Cada tarefa devolve `true` enquanto ainda precisa de frames; quando todas
 * terminam, o loop dorme — nenhum custo de CPU com a cena em repouso.
 */
export type FrameTask = (dt: number) => boolean

const MAX_DT = 1 / 30

const tasks = new Set<FrameTask>()
let frameId = 0
let lastTime = 0

function frame(now: number) {
  const dt = lastTime ? Math.min((now - lastTime) / 1000, MAX_DT) : 1 / 60
  lastTime = now

  for (const task of tasks) {
    if (!task(dt)) tasks.delete(task)
  }

  if (tasks.size > 0) {
    frameId = requestAnimationFrame(frame)
  } else {
    frameId = 0
    lastTime = 0
  }
}

export function schedule(task: FrameTask) {
  tasks.add(task)
  if (!frameId) frameId = requestAnimationFrame(frame)
}

export function unschedule(task: FrameTask) {
  tasks.delete(task)
}

/**
 * Cria um "acordador" para uma tarefa: chamar `wake()` agenda a tarefa se ela
 * estiver dormindo. Útil para reagir a eventos (ponteiro, resize) sem loop fixo.
 */
export function createWakeable(step: FrameTask) {
  let running = false

  const task: FrameTask = (dt) => {
    const busy = step(dt)
    if (!busy) running = false
    return busy
  }

  return {
    wake() {
      if (running) return
      running = true
      schedule(task)
    },
    stop() {
      running = false
      unschedule(task)
    },
  }
}
