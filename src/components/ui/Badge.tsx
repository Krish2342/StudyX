import type { HTMLAttributes } from 'react'

type Tone = 'neutral' | 'accent' | 'success' | 'warning'

const tones: Record<Tone, string> = {
  neutral: 'bg-white/[0.07] text-paper-dim border-white/10',
  accent: 'bg-sky-wash text-sky border-sky/35',
  success: 'bg-white/[0.07] text-paper border-white/15',
  warning: 'bg-white/[0.07] text-paper-dim border-white/15',
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
