import { AnimatePresence, motion } from 'motion/react'
import { Bell, Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface AdminNotificationsProps {
  open: boolean
  onToggle: () => void
  onClose: () => void
}

/**
 * The console inbox, deliberately empty until there is a database to read.
 *
 * The bell never invents a count: a fabricated "3" would tell the operator
 * there is work waiting when there is none. Phase 5 replaces this body with
 * real notifications.
 */
export function AdminNotifications({ open, onToggle, onClose }: AdminNotificationsProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative grid size-10 place-items-center rounded-lg text-paper-dim transition-colors hover:bg-white/7 hover:text-paper focus-visible:outline-2 focus-visible:outline-admin-accent focus-visible:outline-offset-2"
      >
        <Bell className="size-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-ink-raised-2 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <span className="text-sm font-semibold text-paper">Notifications</span>
              <span className="rounded-full border border-white/12 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-paper-faint uppercase">
                Phase 5
              </span>
            </div>

            <div className="px-5 py-8 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-xl bg-white/6">
                <Inbox className="size-5 text-paper-faint" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-medium text-paper">Nothing to review yet</p>
              <p className="mx-auto mt-1 max-w-[16rem] text-xs leading-5 text-paper-faint">
                Resource submissions, support tickets and community reports land here once
                those sections are connected to the database.
              </p>
              <Link
                to="/admin/notifications"
                onClick={onClose}
                className="mt-4 inline-flex rounded text-xs font-semibold text-admin-accent outline-none hover:text-paper focus-visible:ring-2 focus-visible:ring-admin-accent"
              >
                See what this section will do
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
