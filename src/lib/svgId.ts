/** Converte o retorno de `useId()` em um id seguro para `url(#...)` em SVG. */
export const svgId = (reactId: string, suffix: string) => `${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}-${suffix}`
