import { motion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

/**
 * Motion's button props rather than React's plain ButtonHTMLAttributes —
 * the two disagree about onAnimationStart, and Motion's version wins here.
 */
export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  fullWidth?: boolean
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-sky text-ink font-semibold hover:bg-sky-bright active:bg-sky-deep shadow-[0_8px_24px_rgba(141,185,240,0.22)]',
  secondary: 'bg-white/[0.06] text-paper border border-white/12 hover:bg-white/[0.10] hover:border-white/20',
  ghost: 'bg-transparent text-paper-dim hover:text-paper hover:bg-white/[0.06] border border-transparent',
  danger: 'bg-white/[0.06] text-paper border border-white/12 hover:border-white/30 hover:bg-white/[0.10]',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-[var(--radius-control)]',
  md: 'h-11 px-5 text-sm gap-2 rounded-[var(--radius-control)]',
  lg: 'h-13 px-7 text-base gap-2.5 rounded-xl',
}

/**
 * The one button in the system.
 * Press feedback via Motion; MotionConfig in main.tsx makes it
 * respect prefers-reduced-motion automatically.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={[
        'inline-flex items-center justify-center whitespace-nowrap select-none',
        'transition-colors duration-150 cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {icon}
      {children}
    </motion.button>
  )
}
