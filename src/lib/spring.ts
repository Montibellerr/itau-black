export interface SpringConfig {
  /** Rigidez (k). Quanto maior, mais rápida a resposta. */
  stiffness: number
  /** Razão de amortecimento (ζ): 1 = crítico, < 1 = leve oscilação, > 1 = lento. */
  damping: number
  mass?: number
}

const FIXED_STEP = 1 / 240
const REST_DELTA = 0.0002
const REST_SPEED = 0.0002

/**
 * Mola amortecida 1D integrada com Euler semi-implícito em passos fixos.
 * Passos fixos deixam o movimento idêntico em telas de 60 Hz ou 144 Hz.
 */
export class Spring {
  value: number
  target: number
  velocity = 0

  private readonly stiffness: number
  private readonly damping: number
  private readonly mass: number

  constructor(initial: number, config: SpringConfig) {
    this.value = initial
    this.target = initial
    this.stiffness = config.stiffness
    this.mass = config.mass ?? 1
    this.damping = config.damping * 2 * Math.sqrt(config.stiffness * this.mass)
  }

  /** Avança a simulação. Retorna `true` quando a mola está em repouso. */
  step(dt: number): boolean {
    if (this.isResting()) {
      this.value = this.target
      this.velocity = 0
      return true
    }

    let remaining = dt
    while (remaining > 1e-6) {
      const h = Math.min(FIXED_STEP, remaining)
      const force = -this.stiffness * (this.value - this.target) - this.damping * this.velocity
      this.velocity += (force / this.mass) * h
      this.value += this.velocity * h
      remaining -= h
    }

    return false
  }

  private isResting() {
    return Math.abs(this.velocity) < REST_SPEED && Math.abs(this.target - this.value) < REST_DELTA
  }
}
