import { motion } from 'motion/react'
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

export interface AnimatedLinkProps {
  to: string
  label: string
  icon: LucideIcon
  collapsed?: boolean
  badge?: number
  /** 'sidebar' = full row with pill indicator. 'bottom' = icon over label. */
  variant?: 'sidebar' | 'bottom'
  onNavigate?: () => void
}

/**
 * One link used by both the desktop sidebar and the mobile bottom nav.
 * The soft-blue pill slides to the active item â€” the only place
 * the accent colour is allowed to be dominant.
 */
export function AnimatedLink({
  to,
  label,
  icon: Icon,
  collapsed = false,
  badge,
  variant = 'sidebar',
  onNavigate,
}: AnimatedLinkProps) {
  const { pathname } = useLocation()
  const isActive = variant === 'bottom' ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)

  if (variant === 'bottom') {
    return (
      <RouterNavLink
        to={to}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className="group relative flex flex-1 flex-col items-center justify-center gap-1 pt-2 pb-2.5 min-h-14 outline-none"
      >
        <span className="relative">
          {isActive && (
            <motion.span
              layoutId="bottom-nav-active"
              transition={{ type: 'spring', stiffness: 480, damping: 36 }}
              className="absolute -inset-x-3 -inset-y-1.5 rounded-full bg-sky-wash"
            />
          )}
          <Icon
            className={[
              'relative size-5 transition-colors duration-150',
              isActive ? 'text-sky' : 'text-paper-faint group-hover:text-paper-dim',
            ].join(' ')}
            aria-hidden="true"
          />
        </span>
        <span
          className={[
            'relative text-[11px] font-medium transition-colors duration-150',
            isActive ? 'text-sky' : 'text-paper-faint group-hover:text-paper-dim',
          ].join(' ')}
        >
          {label}
        </span>
      </RouterNavLink>
    )
  }

  return (
    <RouterNavLink
      to={to}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? label : undefined}
      className={[
        'group relative flex items-center gap-3 rounded-xl outline-none',
        collapsed ? 'h-11 w-11 justify-center' : 'h-11 px-3',
        'transition-colors duration-150',
      ].join(' ')}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="absolute inset-0 rounded-xl border border-sky/30 bg-sky-wash"
          aria-hidden="true"
        />
      )}
      <Icon
        className={[
          'relative size-[18px] shrink-0 transition-colors duration-150',
          isActive ? 'text-sky' : 'text-paper-faint group-hover:text-paper-dim',
        ].join(' ')}
        aria-hidden="true"
      />
      {!collapsed && (
        <>
          <span
            className={[
              'relative flex-1 truncate text-sm transition-colors duration-150',
              isActive ? 'font-medium text-paper' : 'text-paper-dim group-hover:text-paper',
            ].join(' ')}
          >
            {label}
          </span>
          {badge !== undefined && (
            <span
              className={[
                'relative rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                isActive ? 'bg-sky text-ink' : 'bg-white/8 text-paper-faint',
              ].join(' ')}
            >
              {badge}
            </span>
          )}
        </>
      )}
      {collapsed && badge !== undefined && (
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-sky" aria-hidden="true" />
      )}
    </RouterNavLink>
  )
}
