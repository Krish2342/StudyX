import { bottomNavItems } from '@/components/navigation/navConfig'
import { AnimatedLink } from '@/components/navigation/AnimatedLink'

/**
 * MOBILE-ONLY bottom navigation.
 * This is a separate piece of information architecture, not a shrunk sidebar:
 * five thumb-reachable destinations, 56px+ touch targets, safe-area padding.
 */
export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-ink-raised/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        {bottomNavItems.map((item) => (
          <AnimatedLink
            key={item.path}
            to={item.path}
            label={item.label}
            icon={item.icon}
            variant="bottom"
          />
        ))}
      </div>
    </nav>
  )
}
