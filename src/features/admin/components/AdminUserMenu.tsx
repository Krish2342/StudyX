import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, LogOut, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdminAuth } from '@/features/admin/auth/adminAuthContext'

export interface AdminUserMenuProps {
  open: boolean
  onToggle: () => void
  onClose: () => void
}

/** Real Google profile from the verified session, plus sign-out. */
export function AdminUserMenu({ open, onToggle, onClose }: AdminUserMenuProps) {
  const { user, signOut } = useAdminAuth()

  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>
  const name =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    user?.email?.split('@')[0] ||
    'Administrator'
  const avatarUrl = typeof meta.avatar_url === 'string' ? meta.avatar_url : null
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${name}`}
        className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/6 text-xs font-semibold text-paper transition-colors hover:border-admin-accent/60 focus-visible:outline-2 focus-visible:outline-admin-accent focus-visible:outline-offset-2"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          initials || 'A'
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-ink-raised-2 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="border-b border-white/8 px-4 py-3.5">
              <p className="truncate text-sm font-semibold text-paper">{name}</p>
              <p className="truncate text-xs text-paper-faint">{user?.email ?? 'No email on session'}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-admin-accent/40 bg-admin-wash px-2 py-0.5 text-[11px] font-medium text-paper">
                <ShieldCheck className="size-3 text-admin-accent" aria-hidden="true" />
                Super Admin
              </p>
            </div>

            <div className="p-1.5">
              <Link
                to="/app"
                role="menuitem"
                onClick={onClose}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-paper-dim transition-colors hover:bg-white/7 hover:text-paper"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to StudyX
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onClose()
                  signOut()
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-paper-dim transition-colors hover:bg-admin-pink-wash hover:text-paper"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
