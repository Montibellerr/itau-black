/**
 * Composições do baralho. Distâncias em "larguras de cartão" (1 = largura do
 * cartão) e ângulos em graus — a mesma receita funciona em qualquer tamanho.
 */
export interface Pose {
  x: number
  y: number
  z: number
  rx: number
  ry: number
  rz: number
  scale: number
}

export interface Rotation {
  rx: number
  ry: number
  rz: number
}

export interface StackLayout {
  name: 'wide' | 'compact'
  /** Rotação base do palco que contém todos os cartões. */
  stage: Rotation
  /** Pose inicial do palco na animação de entrada (somada à base). */
  stageIntro: Rotation & { y: number }
  /** Translação interna que leva o centro do baralho ao pivô de rotação. */
  offset: { x: number; y: number; z: number }
  /** Pose de repouso de cada cartão (índice 0 = frente). */
  cards: Pose[]
  /** Deslocamento extra quando o cursor está sobre o baralho (leque abre). */
  spread: Pose[]
  /** Deslocamento inicial de cada cartão na entrada ("explodido"). */
  intro: Pose[]
  /** Intensidade da reação ao ponteiro. */
  tilt: { stageX: number; stageY: number; cardX: number; cardY: number; drift: number }
}

interface Recipe {
  stage: Rotation
  stageIntro: StackLayout['stageIntro']
  /** Incremento por cartão em direção ao fundo. */
  step: { x: number; y: number; z: number; rz: number }
  spreadStep: { x: number; y: number; z: number; rz: number }
  tilt: StackLayout['tilt']
  nudge: { x: number; y: number }
}

const ZERO: Pose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, scale: 0 }

const RECIPES: Record<StackLayout['name'], Recipe> = {
  wide: {
    stage: { rx: 16, ry: -24, rz: -10 },
    stageIntro: { rx: 14, ry: -16, rz: 5, y: 0.08 },
    step: { x: 0.045, y: -0.12, z: -0.15, rz: 5.5 },
    spreadStep: { x: 0.02, y: -0.04, z: -0.06, rz: 2.4 },
    tilt: { stageX: 7, stageY: 11, cardX: 5, cardY: 7, drift: 0.035 },
    nudge: { x: 0, y: 0 },
  },
  compact: {
    stage: { rx: 14, ry: -18, rz: -8 },
    stageIntro: { rx: 10, ry: -12, rz: 4, y: 0.06 },
    step: { x: 0.07, y: -0.065, z: -0.13, rz: 3.6 },
    spreadStep: { x: 0.025, y: -0.022, z: -0.045, rz: 1.6 },
    tilt: { stageX: 5, stageY: 7, cardX: 3.5, cardY: 5, drift: 0.02 },
    nudge: { x: 0, y: 0 },
  },
}

const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length

function buildLayout(name: StackLayout['name'], count: number): StackLayout {
  const recipe = RECIPES[name]
  const { step, spreadStep } = recipe

  const cards: Pose[] = Array.from({ length: count }, (_, i) => ({
    ...ZERO,
    x: step.x * i,
    y: step.y * i,
    z: step.z * i,
    rz: step.rz * i,
    scale: 1,
  }))

  const spread: Pose[] = cards.map((_, i) => ({
    ...ZERO,
    x: spreadStep.x * i,
    y: spreadStep.y * i,
    // O cartão da frente se aproxima levemente; os demais recuam em leque.
    z: i === 0 ? 0.04 : spreadStep.z * i,
    rz: spreadStep.rz * i,
  }))

  // Entrada: cartões começam mais afastados entre si, abaixo e inclinados,
  // e convergem para a composição final.
  const intro: Pose[] = cards.map((_, i) => ({
    ...ZERO,
    x: -0.05 + 0.06 * i,
    y: 0.22 + 0.04 * i,
    z: -0.35 - 0.26 * i,
    rx: 16,
    rz: -7 + 2.5 * i,
    scale: -0.06,
  }))

  return {
    name,
    stage: recipe.stage,
    stageIntro: recipe.stageIntro,
    offset: {
      x: -mean(cards.map((c) => c.x)) + recipe.nudge.x,
      y: -mean(cards.map((c) => c.y)) + recipe.nudge.y,
      z: -mean(cards.map((c) => c.z)),
    },
    cards,
    spread,
    intro,
    tilt: recipe.tilt,
  }
}

const cache = new Map<string, StackLayout>()

/** Escolhe a composição pela largura disponível (em px). */
export function pickLayout(width: number, count: number): StackLayout {
  const name: StackLayout['name'] = width < 620 ? 'compact' : 'wide'
  const key = `${name}:${count}`
  let layout = cache.get(key)
  if (!layout) {
    layout = buildLayout(name, count)
    cache.set(key, layout)
  }
  return layout
}
