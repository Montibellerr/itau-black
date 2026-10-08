/**
 * Acabamentos. Universo Black: pretos/grafite com luz nas bordas.
 * `itau`: cartão laranja clássico do universo Itaú tradicional.
 */
export type CardVariant = 'black' | 'graphite' | 'onyx' | 'titanium' | 'itau'

export interface CardData {
  id: string
  variant: CardVariant
  /** Categoria impressa no cartão. */
  tier: string
}

/** Baralho da hero. Índice 0 = cartão em primeiro plano. */
export const heroCards: CardData[] = [
  { id: 'black', variant: 'black', tier: 'Black' },
  { id: 'graphite', variant: 'graphite', tier: 'Black' },
  { id: 'onyx', variant: 'onyx', tier: 'Black' },
  { id: 'titanium', variant: 'titanium', tier: 'Black' },
]
