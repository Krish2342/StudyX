import { ArrowRight, Clock, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/features/auth/useAuth'
import { supabase } from '@/lib/supabase'
import { fetchRequests, type RequestRecord } from '@/services/workflowService'

/** "My Requests" Ã¢â‚¬â€ what the student asked the community for. */
export function RequestsCard({ className = '' }: { className?: string }) {
  const { user } = useAuth()
  const [requests, setRequests] = useState<RequestRecord[]>([])
  useEffect(() => {
    if (!supabase || !user) return
    void fetchRequests(supabase, user.id).then(setRequests).catch(() => setRequests([]))
  }, [user])

  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b border-white/7 px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-paper">My requests</h2>
        <Link to="/app/requests" className="flex items-center gap-0.5 text-xs font-medium text-sky hover:underline">
          All <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="flex flex-col gap-1 p-3">
        {requests.slice(0, 3).map((req) => (
          <li key={req.id}>
            <div className="flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/4">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-paper">{req.request_description}</span>
                <span className="mt-1 flex items-center gap-1.5 text-[11px] text-paper-faint">
                  <Clock className="size-3" aria-hidden="true" />
                  {new Date(req.created_at).toLocaleDateString()}
                  <span aria-hidden="true">Ã‚Â·</span>
                  {req.resource_type}
                </span>
              </span>
              <Badge tone={req.status === 'added' ? 'accent' : req.status === 'not_available' ? 'warning' : 'neutral'} dot>
                {req.status.replace('_', ' ')}
              </Badge>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-white/7 p-3">
        <Link
          to="/app/requests"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 text-[13px] font-medium text-paper-dim transition-colors hover:border-sky/45 hover:bg-sky-wash hover:text-paper"
        >
          <Plus className="size-4" aria-hidden="true" />
          Request a resource
        </Link>
      </div>
    </Card>
  )
}
