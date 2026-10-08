import { createContext, useContext } from 'react'
import type { MotionTier } from '@/hooks/useMotionTier'

export const MotionContext = createContext<MotionTier>('full')

/** Nível de movimento da página (full | lite | static), definido uma única vez no topo. */
export const useMotion = () => useContext(MotionContext)
