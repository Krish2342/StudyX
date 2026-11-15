import { AnimatePresence, motion } from 'motion/react'
import { LogOut, Settings, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { demoStudent } from '@/data/student'
import { useToast } from '@/hooks/useToast'

export interface ProfileMenuProps {
  open: boolean
  onToggle: () => void
  onClose: () => void
}

/** Avatar + dropdown. Sign-out is a demo message — there is no real session. */
export function ProfileMenu({ open, onToggle, onClose }: ProfileMenuProps) {
  const navigate = useNavigate()
  const { toast } = useToast()

  function go(path: string) {
    onClose()
    navigate(path)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Open profile menu"
        className="flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-xs font-semibold text-paper transition-colors hover:border-sky/50"
      >
        {demoStudent.avatarInitials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-ink-raised-2 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="border-b border-white/[0.08] px-4 py-3.5">
              <p className="truncate text-sm font-semibold text-paper">{demoStudent.name}</p>
              <p className="truncate text-xs text-paper-faint">{demoStudent.email}</p>
              <p className="mt-1 truncate text-[11px] text-paper-dim">
                {demoStudent.branch} · Sem {demoStudent.semester}
              </p>
            </div>

            <div className="p-1.5">
              <Item icon={User} label="My profile" onClick={() => go('/app/profile')} />
              <Item icon={Settings} label="Settings" onClick={() => go('/app/settings')} />
              <Item
                icon={LogOut}
                label="Sign out"
                onClick={() => {
                  onClose()
                  toast('Sign out is not available yet.', 'info')
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Item({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-paper-dim transition-colors hover:bg-white/[0.07] hover:text-paper"
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  )
}
