import { useReducedMotion as useMotionReducedMotion } from 'motion/react'

/**
 * Single source of truth for "may we animate?".
 * Reads the OS setting (System → Accessibility → Display → Animation)
 * and returns `true` when the user asked for less motion.
 *
 * Use it to skip expensive decorative animation (3D tilt, parallax,
 * staggered entrances) while keeping functional feedback.
 */
export function useReducedMotion(): boolean {
  return useMotionReducedMotion() ?? false
}
