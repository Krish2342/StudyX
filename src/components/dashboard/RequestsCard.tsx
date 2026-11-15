import { ArrowRight, Clock, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { demoRequests } from '@/data/dashboard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/hooks/useToast'
import type { ResourceRequest } from '@/types'

const toneFor: Record<ResourceRequest['status'], 'accent' | 'neutral' | 'warning'> = {
  Added: 'accent',
  Pending: 'neutral',
  'Not Available': 'warning',
}

/** "My Requests" — what the student asked the community for. */
export function RequestsCard({ className = '' }: { className?: string }) {
  const { toast } = useToast()

  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-paper">My requests</h2>
        <Link to="/app/requests" className="flex items-center gap-0.5 text-xs font-medium text-sky hover:underline">
          All <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="flex flex-col gap-1 p-3">
        {demoRequests.map((req) => (
          <li key={req.id}>
            <div className="flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/[0.04]">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-paper">{req.title}</span>
                <span className="mt-1 flex items-center gap-1.5 text-[11px] text-paper-faint">
                  <Clock className="size-3" aria-hidden="true" />
                  {req.createdAt}
                  <span aria-hidden="true">·</span>
                  {req.category}
                </span>
              </span>
              <Badge tone={toneFor[req.status]} dot>
                {req.status}
              </Badge>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-white/[0.07] p-3">
        <button
          type="button"
          onClick={() => toast('The request form is not available yet.', 'info')}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 text-[13px] font-medium text-paper-dim transition-colors hover:border-sky/45 hover:bg-sky-wash hover:text-paper"
        >
          <Plus className="size-4" aria-hidden="true" />
          Request a resource
        </button>
      </div>
    </Card>
  )
}
