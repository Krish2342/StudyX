import { Menu, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AdminBreadcrumb } from '@/features/admin/components/AdminBreadcrumb'
import { AdminNotifications } from '@/features/admin/components/AdminNotifications'
import { AdminQuickSearch } from '@/features/admin/components/AdminQuickSearch'
import { AdminUserMenu } from '@/features/admin/components/AdminUserMenu'

export interface AdminTopbarProps {
  onOpenMobileNav: () => void
}

type OpenMenu = 'notifications' | 'profile' | null

/** Console header: navigation toggle, breadcrumb, search, alerts and account. */
export function AdminTopbar({ onOpenMobileNav }: AdminTopbarProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  // Close an open dropdown when the click lands outside the header.
  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (barRef.current && !barRef.current.contains(event.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  // Ctrl/Cmd+K opens search, Escape closes whatever is open.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
        return
      }
      if (event.key === 'Escape') setOpenMenu(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggle = (menu: Exclude<OpenMenu, null>) =>
    setOpenMenu((current) => (current === menu ? null : menu))

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-ink/85 backdrop-blur-md">
      <div ref={barRef} className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="grid size-10 shrink-0 place-items-center rounded-lg text-paper-dim transition-colors hover:bg-white/7 hover:text-paper focus-visible:outline-2 focus-visible:outline-admin-accent focus-visible:outline-offset-2 lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <AdminBreadcrumb />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-10 w-60 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-3 text-sm text-paper-faint transition-colors hover:border-white/20 hover:text-paper-dim focus-visible:outline-2 focus-visible:outline-admin-accent focus-visible:outline-offset-2 md:flex"
          >
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate text-left">Search sections</span>
            <kbd className="rounded border border-white/12 px-1.5 py-0.5 text-[10px] font-medium">
              Ctrl K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search sections"
            className="grid size-10 place-items-center rounded-lg text-paper-dim transition-colors hover:bg-white/7 hover:text-paper focus-visible:outline-2 focus-visible:outline-admin-accent focus-visible:outline-offset-2 md:hidden"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>

          <AdminNotifications
            open={openMenu === 'notifications'}
            onToggle={() => toggle('notifications')}
            onClose={() => setOpenMenu(null)}
          />
          <AdminUserMenu
            open={openMenu === 'profile'}
            onToggle={() => toggle('profile')}
            onClose={() => setOpenMenu(null)}
          />
        </div>
      </div>

      <AdminQuickSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
