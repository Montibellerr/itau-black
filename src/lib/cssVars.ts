import type { CSSProperties } from 'react'

type CSSCustomProperties = Record<`--${string}`, string | number>

/** Tipa estilos inline que misturam propriedades CSS e variáveis customizadas. */
export const cssVars = (vars: CSSCustomProperties & CSSProperties) => vars as CSSProperties
