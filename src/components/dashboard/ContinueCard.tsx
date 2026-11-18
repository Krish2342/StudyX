import { ChevronRight, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/features/auth/useAuth'
import { supabase } from '@/lib/supabase'
import { fetchSavedResources, type ResourceRecord } from '@/services/resourceService'

/** "Continue Studying" â€” progress bars for in-flight topics. */
export function ContinueCard() {
  const { user } = useAuth()
  const [items, setItems] = useState<ResourceRecord[]>([])
  useEffect(() => {
    if (!supabase || !user) return
    void fetchSavedResources(supabase, user.id).then(setItems).catch(() => setItems([]))
  }, [user])

  return (
    <Card className="md:col-span-2 lg:col-span-2">
      <div className="flex items-center justify-between border-b border-white/7 px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-paper">Continue studying</h2>
        <Link
          to="/app/study-space"
          className="flex items-center gap-0.5 text-xs font-medium text-sky hover:underline"
        >
          My space <ChevronRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="flex flex-col gap-1 p-2.5">
        {items.length ? items.slice(0, 3).map((item) => (
          <li key={item.id}>
            <Link
              to={`/app/explore/${item.id}`}
              className="group flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-white/5"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-paper">{item.title}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-paper-faint">
                  {item.subject?.name || item.resource_type}
                  <span aria-hidden="true">·</span>
                  <Clock className="size-3" aria-hidden="true" />
                  Saved resource
                </span>
              </span>

              <ChevronRight
                className="size-4 shrink-0 text-paper-faint transition-colors group-hover:text-sky"
                aria-hidden="true"
              />
            </Link>
          </li>
        )) : (
          <li className="px-3 py-8 text-center text-sm text-paper-faint">
            Save resources from Explore to keep them here.
          </li>
        )}
      </ul>
    </Card>
  )
}
