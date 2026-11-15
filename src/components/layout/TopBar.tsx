import { AnimatePresence, motion } from 'motion/react'
import { Menu, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlobalSearch } from '@/components/layout/GlobalSearch'
import { NotificationMenu } from '@/components/layout/NotificationMenu'
import { ProfileMenu } from '@/components/layout/ProfileMenu'

export interface TopBarProps {
  onOpenMobileNav: () => void
}

type OpenMenu = 'notifications' | 'profile' | null

/** App top bar: menu, global search, notifications, profile. */
export function TopBar({ onOpenMobileNav }: TopBarProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  // Close both dropdowns when clicking anywhere outside the bar.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const toggle = (menu: Exclude<OpenMenu, null>) => setOpenMenu((m) => (m === menu ? null : menu))

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-ink/85 backdrop-blur-md">
      <div ref={barRef} className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="grid size-10 shrink-0 place-items-center rounded-lg text-paper-dim transition-colors hover:bg-white/[0.07] hover:text-paper lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 lg:hidden" aria-label="StudyX home">
          <span className="grid size-8 place-items-center rounded-lg bg-sky font-display text-sm font-bold text-ink">
            S
          </span>
          <span className="font-display text-base font-semibold text-paper">StudyX</span>
        </Link>

        <div className="hidden min-w-0 flex-1 lg:block">
          <GlobalSearch compact />
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="grid size-10 place-items-center rounded-lg text-paper-dim transition-colors hover:bg-white/[0.07] hover:text-paper lg:hidden"
          >
            <Search className="size-5" />
          </button>

          <NotificationMenu
            open={openMenu === 'notifications'}
            onToggle={() => toggle('notifications')}
            onClose={() => setOpenMenu(null)}
          />
          <ProfileMenu
            open={openMenu === 'profile'}
            onToggle={() => toggle('profile')}
            onClose={() => setOpenMenu(null)}
          />
        </div>
      </div>

      {/* Mobile search — revealed by the search button */}
      <AnimatePresence initial={false}>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/[0.08] lg:hidden"
          >
            <div className="px-4 py-3 sm:px-6">
              <GlobalSearch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
