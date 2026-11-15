import { motion } from 'motion/react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnimatedLink } from '@/components/navigation/AnimatedLink'
import { sidebarFooterItems, sidebarItems } from '@/components/navigation/navConfig'
import { useToast } from '@/hooks/useToast'

export interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

/** Desktop-only collapsible navigation rail. */
export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { toast } = useToast()

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 248 }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      aria-label="Main navigation"
      className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-white/[0.08] bg-ink-raised lg:flex"
    >
      {/* Brand */}
      <div className={`flex h-16 items-center border-b border-white/[0.08] ${collapsed ? 'justify-center' : 'px-4'}`}>
        <Link to="/" className="flex items-center gap-2.5 outline-none" aria-label="StudyX home">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky font-display text-sm font-bold text-ink">
            S
          </span>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display text-lg font-semibold tracking-tight text-paper"
            >
              StudyX
            </motion.span>
          )}
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {sidebarItems.map((item) => (
          <AnimatedLink
            key={item.path}
            to={item.path}
            label={item.label}
            icon={item.icon}
            badge={item.badge}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer nav */}
      <div className="flex flex-col gap-1 border-t border-white/[0.08] px-3 py-3">
        {sidebarFooterItems.map((item) => (
          <AnimatedLink
            key={item.path}
            to={item.path}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
          />
        ))}

        <button
          type="button"
          onClick={() => {
            onToggle()
            toast(collapsed ? 'Sidebar expanded' : 'Sidebar collapsed', 'info')
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className="mt-1 flex h-11 items-center gap-3 rounded-xl px-3 text-paper-faint transition-colors duration-150 hover:bg-white/[0.06] hover:text-paper focus-visible:outline-2 focus-visible:outline-sky"
        >
          {collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  )
}
