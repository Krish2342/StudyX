import { motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const links = [
  { label: 'AI Tools', href: '#ai-tools' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
]

/** Public landing page navigation bar. Becomes a drawer on mobile. */
export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled ? 'border-b border-white/[0.08] bg-ink/85 backdrop-blur-md' : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="StudyX home">
          <span className="grid size-8 place-items-center rounded-lg bg-sky font-display text-sm font-bold text-ink">S</span>
          <span className="font-display text-lg font-semibold tracking-tight text-paper">StudyX</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3.5 py-2 text-sm text-paper-dim transition-colors hover:bg-white/[0.06] hover:text-paper"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link to="/app">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link to="/app">
            <Button size="sm">Get started</Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid size-10 place-items-center rounded-lg text-paper-dim transition-colors hover:bg-white/[0.07] hover:text-paper md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden border-t border-white/[0.08] bg-ink-raised md:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-paper-dim transition-colors hover:bg-white/[0.06] hover:text-paper"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2.5 border-t border-white/[0.08] pt-4">
              <Link to="/app" onClick={() => setOpen(false)}>
                <Button variant="secondary" fullWidth>
                  Log in
                </Button>
              </Link>
              <Link to="/app" onClick={() => setOpen(false)}>
                <Button fullWidth>Get started</Button>
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}
