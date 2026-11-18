import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { adminHref, findAdminNavItem } from '@/features/admin/nav/adminNav'

/**
 * Breadcrumb for the console header. It is derived from the current pathname,
 * so it can never disagree with the page being shown.
 */
export function AdminBreadcrumb() {
  const { pathname } = useLocation()
  const item = findAdminNavItem(pathname)

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        <li className="shrink-0">
          {item && item.path !== '' ? (
            <Link
              to="/admin"
              className="rounded text-paper-dim outline-none transition-colors hover:text-paper focus-visible:ring-2 focus-visible:ring-admin-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Admin
            </Link>
          ) : (
            <span className="text-paper-dim">Admin</span>
          )}
        </li>
        <li aria-hidden="true" className="shrink-0 text-paper-faint">
          <ChevronRight className="size-3.5" />
        </li>
        <li className="min-w-0">
          <span
            aria-current="page"
            className="block truncate font-medium text-paper"
            title={item?.label ?? 'Admin'}
          >
            {item?.label ?? 'Admin'}
          </span>
        </li>
      </ol>
    </nav>
  )
}

/** Anchor used by pages that need to jump back to the overview. */
export function AdminOverviewLink() {
  return (
    <Link
      to={adminHref('')}
      className="rounded text-sm text-admin-accent outline-none transition-colors hover:text-paper focus-visible:ring-2 focus-visible:ring-admin-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
    >
      Back to overview
    </Link>
  )
}
