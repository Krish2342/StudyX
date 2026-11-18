import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { adminNavGroups } from '@/features/admin/nav/adminNav'
import { AdminBrand } from '@/features/admin/components/AdminBrand'
import { AdminNavLink } from '@/features/admin/components/AdminNavLink'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { AdminTopbar } from '@/features/admin/components/AdminTopbar'

const COLLAPSE_KEY = 'studyx:admin-sidebar-collapsed'

/**
 * Frame around every admin page.
 *
 * The rail collapses on desktop and becomes a drawer below `lg`, matching the
 * student app so the two halves of the product feel like one site.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()

  // Close the drawer on navigation, including when the user presses Back.
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMobileNavOpen(false)
  }

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)

    // Stop the page behind the drawer from scrolling.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [mobileNavOpen])

  function toggleCollapse() {
    setCollapsed((current) => {
      localStorage.setItem(COLLAPSE_KEY, current ? '0' : '1')
      return !current
    })
  }

  return (
    <div className="flex min-h-dvh bg-ink">
      <AdminSidebar collapsed={collapsed} onToggle={toggleCollapse} />

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation"
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/8 bg-ink-raised lg:hidden"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 px-4">
                <Link
                  to="/admin"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="StudyX admin overview"
                  className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-admin-accent"
                >
                  <AdminBrand />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close navigation"
                  className="grid size-10 place-items-center rounded-lg text-paper-dim transition-colors hover:bg-white/7 hover:text-paper focus-visible:outline-2 focus-visible:outline-admin-accent"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {adminNavGroups.map((group, index) => (
                  <div
                    key={group.id}
                    className={index > 0 ? 'mt-4 border-t border-white/6 pt-4' : ''}
                  >
                    <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.16em] text-paper-faint uppercase">
                      {group.label}
                    </p>
                    <div className="flex flex-col gap-1">
                      {group.items.map((item) => (
                        <AdminNavLink
                          key={item.path}
                          item={item}
                          onNavigate={() => setMobileNavOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="shrink-0 border-t border-white/8 p-3">
                <Link
                  to="/app"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-paper-dim transition-colors hover:bg-white/6 hover:text-paper"
                >
                  Back to StudyX
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="admin-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
