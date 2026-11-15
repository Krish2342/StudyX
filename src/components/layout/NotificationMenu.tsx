import { AnimatePresence, motion } from 'motion/react'
import { Bell } from 'lucide-react'
import { useState } from 'react'
import { demoNotifications } from '@/data/dashboard'
import { useToast } from '@/hooks/useToast'

export interface NotificationMenuProps {
  open: boolean
  onToggle: () => void
  onClose: () => void
}

/** Bell + dropdown. State for read/unread lives here (demo only). */
export function NotificationMenu({ open, onToggle, onClose }: NotificationMenuProps) {
  const [items, setItems] = useState(demoNotifications)
  const { toast } = useToast()
  const unread = items.filter((n) => !n.read).length

  function markAllRead() {
    setItems((list) => list.map((n) => ({ ...n, read: true })))
    toast('All notifications marked as read', 'success')
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative grid size-10 place-items-center rounded-lg text-paper-dim transition-colors hover:bg-white/[0.07] hover:text-paper"
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-sky px-1 text-[10px] leading-4 font-bold text-ink">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-ink-raised-2 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
              <span className="text-sm font-semibold text-paper">Notifications</span>
              <button type="button" onClick={markAllRead} className="text-xs text-sky hover:underline">
                Mark all read
              </button>
            </div>

            <ul className="max-h-80 overflow-y-auto p-2">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      toast(`Opened: ${n.title}`, 'info')
                    }}
                    className="flex w-full gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.07]"
                  >
                    <span
                      className={`mt-1.5 size-1.5 shrink-0 rounded-full ${n.read ? 'bg-white/20' : 'bg-sky'}`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-paper">{n.title}</span>
                      <span className="block text-xs leading-5 text-paper-faint">{n.body}</span>
                    </span>
                    <span className="shrink-0 text-[11px] text-paper-faint">{n.time}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
