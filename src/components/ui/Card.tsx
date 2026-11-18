import type { HTMLAttributes, ReactNode } from 'react'

type Tone = 'neutral' | 'accent' | 'success' | 'warning'

const tones: Record<Tone, string> = {
  neutral: 'bg-white/7 text-paper-dim border-white/10',
  accent: 'bg-sky-wash text-sky border-sky/35',
  success: 'bg-white/7 text-paper border-white/15',
  warning: 'bg-white/7 text-paper-dim border-white/15',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  dot?: boolean
}

/** Small status / metadata pill. Used for categories, statuses and counts. */
export function Badge({ tone = 'neutral', dot, className = '', children, ...rest }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5',
        'text-xs font-medium leading-5 whitespace-nowrap',
        tones[tone],
        className,
      ].join(' ')}
      {...rest}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}

export interface RatingBadgeProps {
  value: number
}

/** Star rating shown on resource cards. */
export function RatingBadge({ value }: RatingBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-paper">
      <svg viewBox="0 0 24 24" className="size-3.5 fill-sky" aria-hidden="true">
        <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.4l-5.81 3.05 1.11-6.47-4.7-4.58 6.5-.95L12 2.5z" />
      </svg>
      <span className="tabular-nums">{value.toFixed(1)}</span>
    </span>
  )
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Adds the subtle lift-on-hover treatment. */
  interactive?: boolean
  /** Removes the top-lit gradient ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â useful for cards with their own background. */
  plain?: boolean
}

/**
 * The one card in the system.
 * Layered shadow + hairline border + top-lit gradient = "tasteful 3D" depth
 * without a 3D library.
 */
export function Card({ children, interactive = true, plain = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-card',
        'border border-white/8 bg-ink-raised',
        'shadow-[0_1px_2px_rgba(0,0,0,0.45),0_14px_38px_rgba(0,0,0,0.32)]',
        plain ? '' : 'surface-lit',
        interactive
          ? 'transition-[transform,border-color,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-white/18 hover:shadow-[0_2px_4px_rgba(0,0,0,0.45),0_22px_50px_rgba(0,0,0,0.42)]'
          : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
