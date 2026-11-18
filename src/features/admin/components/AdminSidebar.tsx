import { motion } from 'motion/react'
import { ArrowLeft, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { adminNavGroups } from '@/features/admin/nav/adminNav'
import { AdminBrand } from '@/features/admin/components/AdminBrand'
import { AdminNavLink } from '@/features/admin/components/AdminNavLink'

export interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

/** Desktop navigation rail for the admin console. */
export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 264 }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      aria-label="Admin navigation"
      className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-white/8 bg-ink-raised lg:flex"
    >
      <div className={`flex h-16 shrink-0 items-center border-b border-white/8 ${collapsed ? 'justify-center' : 'px-4'}`}>
        <Link
          to="/admin"
          aria-label="StudyX admin overview"
          className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-admin-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-raised"
        >
          <AdminBrand compact={collapsed} />
        </Link>
      </div>

      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-3 py-4">
        {adminNavGroups.map((group, index) => (
          <div
            key={group.id}
            className={index > 0 ? 'mt-4 border-t border-white/6 pt-4' : ''}
          >
            {!collapsed && (
              <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.16em] text-paper-faint uppercase">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <AdminNavLink key={item.path} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/8 p-3">
        <Link
          to="/app"
          title={collapsed ? 'Back to StudyX' : undefined}
          className={[
            'group flex items-center gap-3 rounded-xl text-sm text-paper-dim outline-none',
            'transition-colors duration-150 hover:bg-white/6 hover:text-paper',
            'focus-visible:ring-2 focus-visible:ring-admin-accent',
            collapsed ? 'mx-auto size-11 justify-center' : 'h-11 px-3',
          ].join(' ')}
        >
          <ArrowLeft className="size-[18px] shrink-0 text-paper-faint group-hover:text-paper-dim" aria-hidden="true" />
          {!collapsed && <span className="truncate">Back to StudyX</span>}
        </Link>

        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!collapsed}
          className={[
            'mt-1 flex items-center gap-3 rounded-xl text-sm text-paper-dim outline-none',
            'transition-colors duration-150 hover:bg-white/6 hover:text-paper',
            'focus-visible:ring-2 focus-visible:ring-admin-accent',
            collapsed ? 'mx-auto size-11 justify-center' : 'h-11 w-full px-3',
          ].join(' ')}
        >
          {collapsed ? (
            <ChevronsRight className="size-[18px] shrink-0 text-paper-faint" aria-hidden="true" />
          ) : (
            <>
              <ChevronsLeft className="size-[18px] shrink-0 text-paper-faint" aria-hidden="true" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
