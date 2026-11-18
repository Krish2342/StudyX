import { Link } from 'react-router-dom'
import { FooterSocialLinks } from '@/components/landing/FooterSocialLinks'

/*
 * Only pages that exist are listed here. Anything without a real destination
 * stays out of the footer until it is built â€” a footer full of links back to
 * the home page is worse than no link at all.
 */
const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'Explore resources', to: '/app/explore' },
      { label: 'AI study tools', to: '/app/ai' },
      { label: 'My Study Space', to: '/app/study-space' },
      { label: 'Community', to: '/app/community' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help centre', to: '/app/support' },
      { label: 'Request a resource', to: '/app/requests' },
      { label: 'Saved items', to: '/app/saved' },
      { label: 'Settings', to: '/app/settings' },
    ],
  },
]

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-ink-raised/60">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5" aria-label="StudyX home">
              <span className="grid size-8 place-items-center rounded-lg bg-sky font-display text-sm font-bold text-ink">S</span>
              <span className="font-display text-lg font-semibold text-paper">StudyX</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-paper-dim">
              The AI-powered study platform that helps college students find, understand and share
              their material.
            </p>
            <FooterSocialLinks />
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="mb-4 text-xs font-semibold tracking-[0.16em] text-paper-faint uppercase">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-paper-dim transition-colors hover:text-sky"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-paper-faint">
            Â© {YEAR} StudyX. All rights reserved.
          </p>
          <p className="text-xs text-paper-faint">Made for college students.</p>
        </div>
      </div>
    </footer>
  )
}
