import { useEffect, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/useAuth'
import { fetchNotifications, markAllNotificationsRead, markNotificationRead, type NotificationRecord } from '@/services/workflowService'
import { supabase } from '@/lib/supabase'

export function Notifications() {
  const { user } = useAuth()
  const [items, setItems] = useState<NotificationRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { if (supabase && user) fetchNotifications(supabase, user.id).then(setItems).catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load notifications.')) }, [user])
  async function markOne(item: NotificationRecord) {
    if (!supabase || !user || item.is_read) return
    await markNotificationRead(supabase, user.id, item.id)
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, is_read: true } : entry))
  }
  async function markAll() {
    if (!supabase || !user) return
    await markAllNotificationsRead(supabase, user.id)
    setItems((current) => current.map((item) => ({ ...item, is_read: true })))
  }
  return <div className="mx-auto max-w-3xl"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Updates</p><h1 className="mt-3 font-display text-3xl font-semibold text-paper sm:text-4xl">Notifications</h1></div><Button variant="secondary" size="sm" icon={<CheckCheck className="size-4" />} onClick={() => void markAll()}>Mark all read</Button></div>{error && <p className="mt-5 text-sm text-sky" role="alert">{error}</p>}<Card interactive={false} className="mt-6 divide-y divide-white/8 p-2">{items.length ? items.map((item) => <div key={item.id} className={`flex gap-3 rounded-xl p-4 ${item.is_read ? '' : 'bg-sky-wash'}`}><Bell className="mt-1 size-4 shrink-0 text-sky" aria-hidden="true" /><div className="min-w-0 flex-1"><p className="font-medium text-paper">{item.title}</p><p className="mt-1 text-sm leading-6 text-paper-dim">{item.body}</p><p className="mt-2 text-xs text-paper-faint">{new Date(item.created_at).toLocaleString()}</p>{item.target_url && <Link to={item.target_url} onClick={() => void markOne(item)} className="mt-2 inline-flex text-xs font-semibold text-sky">Open</Link>}</div>{!item.is_read && <button type="button" onClick={() => void markOne(item)} className="text-xs text-paper-faint hover:text-sky">Read</button>}</div>) : <div className="p-10 text-center"><Bell className="mx-auto size-7 text-sky" aria-hidden="true" /><p className="mt-3 text-sm text-paper-faint">You are all caught up.</p></div>}</Card></div>
}
