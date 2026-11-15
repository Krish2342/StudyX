import { AnimatePresence, motion } from 'motion/react'
import { Check, Info, X } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ToastItem, ToastTone } from '@/types'

const toneStyles: Record<ToastTone, { ring: string; icon: ReactNode }> = {
  success: { ring: 'border-sky/40', icon: <Check className="size-4 text-sky" /> },
  error: { ring: 'border-white/25', icon: <X className="size-4 text-paper" /> },
  info: { ring: 'border-white/15', icon: <Info className="size-4 text-paper-dim" /> },
}

export interface ToastViewportProps {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}

/**
 * Fixed-position toast stack.
 * Announced politely to screen readers, and animated with Motion
 * (auto-disabled when the user prefers reduced motion).
 */
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end sm:px-0"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className={[
              'pointer-events-auto flex w-full max-w-sm items-start gap-3',
              'rounded-xl border bg-ink-raised-2 px-4 py-3',
              'shadow-[0_2px_4px_rgba(0,0,0,0.4),0_18px_44px_rgba(0,0,0,0.45)]',
              toneStyles[toast.tone].ring,
            ].join(' ')}
          >
            <span className="mt-0.5 shrink-0">{toneStyles[toast.tone].icon}</span>
            <p className="flex-1 text-sm leading-5 text-paper">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-md p-1 text-paper-faint transition-colors hover:bg-white/10 hover:text-paper"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
