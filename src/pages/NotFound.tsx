import { Compass, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="glow-sky flex min-h-[70dvh] flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-7xl font-semibold text-sky">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-paper">This page does not exist</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-paper-dim">
        The link may be outdated, or the page may have moved. Everything you need is one click away.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/app">
          <Button icon={<Compass className="size-4" />}>Go to dashboard</Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" icon={<Home className="size-4" />}>
            Landing page
          </Button>
        </Link>
      </div>
    </div>
  )
}
