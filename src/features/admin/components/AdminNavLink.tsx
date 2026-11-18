import { NavLink } from 'react-router-dom'
import { adminHref } from '@/features/admin/nav/adminNav'
import type { AdminNavItem } from '@/features/admin/nav/adminNav'

export interface AdminNavLinkProps {
  item: AdminNavItem
  collapsed?: boolean
  /** Real pending count from the database. Nothing is shown until it is known. */
  count?: number
  onNavigate?: () => void
}

/**
 * One sidebar row.
 *
 * The active state is a static highlight rather than a shared-layout pill: the
 * desktop rail and the mobile drawer can both be mounted, and two elements
 * sharing one layout id would animate against each other.
 */
export function AdminNavLink({ item, collapsed = false, count, onNavigate }: AdminNavLinkProps) {
  const href = adminHref(item.path)

  return (
    <NavLink
      to={href}
      end={item.path === ''}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        [
          'group relative flex items-center gap-3 rounded-xl outline-none',
          'transition-colors duration-150',
          collapsed ? 'mx-auto size-11 justify-center' : 'h-11 px-3',
          isActive
            ? 'bg-admin-wash text-paper ring-1 ring-admin-accent/35'
            : 'text-paper-dim hover:bg-white/6 hover:text-paper',
          'focus-visible:ring-2 focus-visible:ring-admin-accent',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            className={[
              'size-[18px] shrink-0 transition-colors duration-150',
              isActive ? 'text-admin-accent' : 'text-paper-faint group-hover:text-paper-dim',
            ].join(' ')}
            aria-hidden="true"
          />
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-sm">{item.label}</span>
              {count !== undefined && count > 0 && (
                <span className="rounded-full bg-admin-pink px-1.5 py-0.5 text-[10px] font-bold text-ink tabular-nums">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </>
          )}
          {collapsed && count !== undefined && count > 0 && (
            <span
              className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-admin-pink"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </NavLink>
  )
}
