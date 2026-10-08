export type RGB = readonly [number, number, number]

export function hexToRgb(hex: string): RGB {
  const value = Number.parseInt(hex.replace('#', ''), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

/** Interpola duas cores e devolve uma string CSS `rgb()`. */
export function mixRgb(from: RGB, to: RGB, t: number) {
  const channel = (index: number) => Math.round(from[index] + (to[index] - from[index]) * t)
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)})`
}
