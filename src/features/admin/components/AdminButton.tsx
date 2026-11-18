import { motion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface AdminButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  fullWidth?: boolean
  /** Shows a spinner and blocks clicks while an admin action is in flight. */
  loading?: boolean
  children?: ReactNode
}

/*
 * Admin actions use the console palette (#007BA7 / #FF2D95), not the student
 * app's soft blue. White text on #007BA7 is 4.8:1, and #FF2D95 on the dark
 * surface is 5.7:1 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â both clear WCAG AA.
 */
const variants: Record<Variant, string> = {
  primary:
    'bg-admin-accent text-white font-semibold hover:bg-admin-accent-strong active:bg-admin-accent-strong shadow-[0_8px_24px_rgba(0,123,167,0.28)]',
  secondary: 'bg-white/6 text-paper border border-white/12 hover:bg-white/10 hover:border-white/20',
  ghost: 'bg-transparent text-paper-dim hover:text-paper hover:bg-white/6 border border-transparent',
  danger: 'bg-admin-pink-wash text-paper border border-admin-pink/45 hover:border-admin-pink hover:bg-admin-pink/20',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-control',
  md: 'h-11 px-5 text-sm gap-2 rounded-control',
  lg: 'h-12 px-6 text-[15px] gap-2.5 rounded-control',
}

export function AdminButton({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  loading = false,
  className = '',
  children,
  type = 'button',
  disabled,
  ...rest
}: AdminButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={loading || disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        'inline-flex items-center justify-center whitespace-nowrap select-none',
        'transition-colors duration-150 cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-admin-accent focus-visible:outline-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
        />
      ) : (
        icon
      )}
      {children}
    </motion.button>
  )
}
