import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatedLink } from '@/components/navigation/AnimatedLink'
import { sidebarFooterItems, sidebarItems } from '@/components/navigation/navConfig'
import { BottomNav } from '@/components/layout/BottomNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

const COLLAPSE_KEY = 'studyx:sidebar-collapsed'

/**
 * The application shell.
 * Desktop: collapsible sidebar + top bar + content.
 * Mobile:  top bar + separate bottom nav (sidebar is hidden entirely).
 */
export function AppShell() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()

  // Close the mobile drawer whenever the route changes.
  // Derived during render (React's recommended pattern) rather than in an
  // effect, so it also works when the user presses Back.
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMobileNavOpen(false)
  }

  // Close the drawer with Escape (keyboard accessibility).
  useEffect(() => {
    if (!mobileNavOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileNavOpen])

  function toggleCollapse() {
    setCollapsed((c) => {
      localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1')
      return !c
    })
  }

  return (
    <div className="flex min-h-dvh bg-ink">
      <Sidebar collapsed={collapsed} onToggle={toggleCollapse} />

      {/* Mobile slide-over drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/65 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/[0.08] bg-ink-raised lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-4">
                <span className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-sky font-display text-sm font-bold text-ink">
                    S
                  </span>
                  <span className="font-display text-lg font-semibold text-paper">StudyX</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close navigation"
                  className="grid size-10 place-items-center rounded-lg text-paper-dim hover:bg-white/[0.07] hover:text-paper"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {sidebarItems.map((item) => (
                  <AnimatedLink
                    key={item.path}
                    to={item.path}
                    label={item.label}
                    icon={item.icon}
                    badge={item.badge}
                  />
                ))}
                <div className="mt-4 border-t border-white/[0.08] pt-3">
                  {sidebarFooterItems.map((item) => (
                    <AnimatedLink
                      key={item.path}
                      to={item.path}
                      label={item.label}
                      icon={item.icon}
                    />
                  ))}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
