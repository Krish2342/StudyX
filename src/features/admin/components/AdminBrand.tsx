import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/** Brand block shared by the sidebar, the drawer and the access screens. */
export function AdminBrand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-admin-accent font-display text-base font-bold text-white shadow-[0_6px_18px_rgba(0,123,167,0.35)]">
        S
      </span>
      {!compact && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="font-display text-[15px] font-semibold text-paper">StudyX</span>
          <span className="text-[10px] font-semibold tracking-[0.18em] text-admin-pink uppercase">
            Admin
          </span>
        </span>
      )}
    </span>
  )
}

/** Small state pill used by the access screens. */
export function AdminStatusPill({
  tone,
  children,
}: {
  tone: 'ok' | 'pending' | 'stop'
  children: ReactNode
}) {
  const tones = {
    ok: 'border-admin-accent/45 bg-admin-wash text-paper',
    pending: 'border-white/15 bg-white/6 text-paper-dim',
    stop: 'border-admin-pink/45 bg-admin-pink-wash text-paper',
  } as const

  const dot = {
    ok: 'bg-admin-accent',
    pending: 'bg-paper-faint',
    stop: 'bg-admin-pink',
  } as const

  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        tones[tone],
      ].join(' ')}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${dot[tone]}`} />
      {children}
    </motion.span>
  )
}
