import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export interface PlaceholderProps {
  title: string
  description: string
}

/**
 * Honest holding page for a StudyX section that is not available yet.
 * Wording must stay product-facing â€” no build/milestone jargon on screen.
 */
export function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-20 text-center sm:py-28">
      <span className="mb-6 grid size-14 place-items-center rounded-2xl border border-sky/30 bg-sky-wash text-sky">
        <Compass className="size-6" aria-hidden="true" />
      </span>

      <Badge tone="accent" dot>
        Not yet available
      </Badge>

      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-paper-dim">{description}</p>

      <p className="mt-6 max-w-lg rounded-xl border border-white/9 bg-ink-raised px-4 py-3 text-sm leading-6 text-paper-faint">
        This section is still being prepared. Your dashboard, search and saved items are ready to
        use in the meantime.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/app">
          <Button icon={<ArrowLeft className="size-4" />}>Back to dashboard</Button>
        </Link>
        <Link to="/">
          <Button variant="secondary">View landing page</Button>
        </Link>
      </div>
    </div>
  )
}
