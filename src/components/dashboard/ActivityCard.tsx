import { ArrowRight, Heart, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/hooks/useToast'
import { useAuth } from '@/features/auth/useAuth'
import { supabase } from '@/lib/supabase'
import { fetchDiscussions, fetchNotifications, type DiscussionRecord, type NotificationRecord } from '@/services/workflowService'

type Tab = 'community' | 'notifications'

/** One card with two tabs Ã¢â‚¬â€ keeps the bento grid tight on desktop. */
export function ActivityCard({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState<Tab>('community')
  const { user } = useAuth()
  const [posts, setPosts] = useState<DiscussionRecord[]>([])
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const { toast } = useToast()
  useEffect(() => {
    if (!supabase) return
    void fetchDiscussions(supabase).then((items) => setPosts(items.slice(0, 4))).catch(() => setPosts([]))
    if (user) void fetchNotifications(supabase, user.id).then((items) => setNotifications(items.slice(0, 4))).catch(() => setNotifications([]))
  }, [user])

  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b border-white/7 px-5 py-3.5">
        <div role="tablist" aria-label="Activity" className="flex gap-1 rounded-lg bg-white/5 p-1">
          {(['community', 'notifications'] as Tab[]).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={[
                'rounded-md px-3 py-1.5 text-[12px] font-medium capitalize transition-colors',
                tab === t ? 'bg-sky text-ink' : 'text-paper-dim hover:text-paper',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>
        <Link
          to={tab === 'community' ? '/app/community' : '/app/notifications'}
          className="flex items-center gap-0.5 text-xs font-medium text-sky hover:underline"
        >
          View all <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      {tab === 'community' ? (
        <ul className="flex flex-col divide-y divide-white/6 px-3">
          {posts.map((post) => (
            <li key={post.id} className="px-2 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sky-wash text-[10px] font-semibold text-sky">
                  {(post.author?.full_name || 'Student').slice(0, 2).toUpperCase()}
                </span>
                <span className="text-[13px] font-medium text-paper">{post.author?.full_name || 'Student'}</span>
                <span className="truncate rounded-full bg-white/7 px-2 py-0.5 text-[10px] text-paper-faint">
                  {post.subject?.name || 'General'}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-paper-dim">{post.body}</p>
              <div className="mt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => toast('Open the Community page to reply.', 'info')}
                  className="inline-flex items-center gap-1.5 text-[11px] text-paper-faint transition-colors hover:text-sky"
                >
                  <Heart className="size-3.5" aria-hidden="true" />
                  Community
                </button>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-paper-faint">
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                  {post.replies.length} replies
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col divide-y divide-white/6 px-3">
          {notifications.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => n.target_url ? window.location.assign(n.target_url) : toast(n.title, 'info')}
                className="flex w-full items-start gap-3 px-2 py-3.5 text-left transition-colors hover:bg-white/4"
              >
                <span
                  className={`mt-1.5 size-1.5 shrink-0 rounded-full ${n.is_read ? 'bg-white/25' : 'bg-sky'}`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[13px] ${n.is_read ? 'text-paper-dim' : 'font-medium text-paper'}`}>
                    {n.title}
                  </span>
                  <span className="block truncate text-[11px] text-paper-faint">{n.body}</span>
                </span>
                <span className="shrink-0 text-[10px] text-paper-faint">{new Date(n.created_at).toLocaleDateString()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
