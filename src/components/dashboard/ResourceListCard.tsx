import { ArrowRight, Download, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Resource } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge, RatingBadge } from '@/components/ui/Badge'
import { useToast } from '@/hooks/useToast'

export interface ResourceListCardProps {
  title: string
  resources: Resource[]
  actionLabel: string
  actionTo: string
  className?: string
}

/** Reused for both "Recently added" and "Popular this week". */
export function ResourceListCard({ title, resources, actionLabel, actionTo, className = '' }: ResourceListCardProps) {
  const { toast } = useToast()

  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-paper">{title}</h2>
        <Link to={actionTo} className="flex items-center gap-0.5 text-xs font-medium text-sky hover:underline">
          {actionLabel} <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="flex flex-col divide-y divide-white/[0.06] px-2.5">
        {resources.map((r) => (
          <li key={r.id} className="group relative">
            <Link to="/app/explore" className="flex items-start gap-3.5 px-3 py-3.5">
              {/* Monogram cover instead of an external image */}
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/[0.09] bg-white/[0.04] font-display text-[13px] font-semibold text-sky"
              >
                {r.subject
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-paper">{r.title}</span>
                <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-paper-faint">
                  <RatingBadge value={r.rating} />
                  <span aria-hidden="true">·</span>
                  <span>{r.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Download className="size-3" aria-hidden="true" />
                    {r.downloads.toLocaleString()}
                  </span>
                </span>
              </span>
            </Link>

            <span className="absolute top-3.5 right-3 flex gap-1.5">
              <button
                type="button"
                aria-label={`Share ${r.title}`}
                onClick={() => toast('Sharing is not available yet.', 'info')}
                className="grid size-7 place-items-center rounded-md border border-white/10 text-paper-faint opacity-0 transition-opacity group-hover:opacity-100 hover:border-sky/40 hover:text-sky focus-visible:opacity-100"
              >
                <Share2 className="size-3.5" />
              </button>
            </span>

            <span className="pointer-events-none absolute bottom-3.5 right-3 hidden sm:block">
              <Badge>{r.category}</Badge>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
