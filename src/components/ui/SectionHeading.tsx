import type { ReactNode } from 'react'

export interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
}

/** Consistent heading block used by every landing section. */
export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow && <span className="text-xs font-semibold tracking-[0.18em] text-sky uppercase">{eyebrow}</span>}
      <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">{title}</h2>
      {description && <p className="max-w-2xl text-base leading-7 text-paper-dim">{description}</p>}
    </div>
  )
}
