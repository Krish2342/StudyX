import { Code, Globe, Mail } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

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
  {
    heading: 'Company',
    links: [
      { label: 'About StudyX', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Privacy policy', to: '/' },
      { label: 'Terms of service', to: '/' },
    ],
  },
]

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-ink-raised/60">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-4">
            <Link to="/" className="flex items-center gap-2.5" aria-label="StudyX home">
              <span className="grid size-8 place-items-center rounded-lg bg-sky font-display text-sm font-bold text-ink">S</span>
              <span className="font-display text-lg font-semibold text-paper">StudyX</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-paper-dim">
              The AI-powered study platform that helps college students find, understand and share
              their material.
            </p>
            <div className="flex gap-2">
              <SocialLink href="mailto:hello@studyx.example" label="Email StudyX">
                <Mail className="size-4" />
              </SocialLink>
              <SocialLink href="https://github.com" label="StudyX source code">
                <Code className="size-4" />
              </SocialLink>
              <SocialLink href="https://studyx.example" label="StudyX website">
                <Globe className="size-4" />
              </SocialLink>
            </div>
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

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.08] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-paper-faint">
            © {YEAR} StudyX. All rights reserved.
          </p>
          <p className="text-xs text-paper-faint">Made for college students.</p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-white/10 text-paper-faint transition-colors hover:border-sky/40 hover:text-sky"
    >
      {children}
    </a>
  )
}
