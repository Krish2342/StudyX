import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

/**
 * Standard entrance animation used by every landing section.
 * Skipped entirely when the user prefers reduced motion.
 */
export function Reveal({ children, delay = 0, y = 22, className = '' }: RevealProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Staggered container — put `<Reveal>`-like children directly inside. */
export function Stagger({ children, className = '', gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

/** Child of <Stagger>. */
export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
      // When reduced motion is on, `initial` on the parent is false so this never hides.
      style={reduced ? { opacity: 1 } : undefined}
    >
      {children}
    </motion.div>
  )
}
