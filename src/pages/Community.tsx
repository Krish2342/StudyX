import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { MessageCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { useAuth } from '@/features/auth/useAuth'
import { createDiscussion, fetchDiscussions, replyToDiscussion, type DiscussionRecord } from '@/services/workflowService'
import { supabase } from '@/lib/supabase'

export function Community() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<DiscussionRecord[]>([])
  const [form, setForm] = useState({ title: '', body: '' })
  const [reply, setReply] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const load = () => supabase && fetchDiscussions(supabase).then(setPosts).catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load discussions.'))
  useEffect(() => { void load() }, [])
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !user) return
    try { await createDiscussion(supabase, user.id, form); setForm({ title: '', body: '' }); await load() } catch (e) { setError(e instanceof Error ? e.message : 'Unable to create discussion.') }
  }
  async function addReply(postId: string) {
    if (!supabase || !user || !reply[postId]?.trim()) return
    try { await replyToDiscussion(supabase, user.id, postId, reply[postId]); setReply({ ...reply, [postId]: '' }); await load() } catch (e) { setError(e instanceof Error ? e.message : 'Unable to post reply.') }
  }
  return <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
    <Card interactive={false} className="p-6"><p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Community</p><h1 className="mt-3 font-display text-3xl font-semibold text-paper">Learn together</h1><p className="mt-2 text-sm leading-6 text-paper-dim">Ask focused academic questions and help other students with useful replies.</p><form onSubmit={submit} className="mt-6 grid gap-4"><Input label="Discussion title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /><Textarea label="Question or context" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required /><Button type="submit">Start discussion</Button>{error && <p className="text-sm text-sky" role="alert">{error}</p>}</form></Card>
    <div className="grid gap-4">{posts.length ? posts.map((post) => <Card key={post.id} interactive={false} className="p-5"><div className="flex items-start gap-3"><MessageCircle className="mt-1 size-5 text-sky" aria-hidden="true" /><div className="min-w-0 flex-1"><h2 className="font-display text-xl font-semibold text-paper">{post.title}</h2><p className="mt-1 text-xs text-paper-faint">{post.author?.full_name ?? 'Student'} Â· {new Date(post.created_at).toLocaleDateString()}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-paper-dim">{post.body}</p><div className="mt-5 grid gap-3">{post.replies?.map((item) => <div key={item.id} className="rounded-xl bg-white/4 p-3"><p className="text-xs text-paper-faint">{item.author?.full_name ?? 'Student'}</p><p className="mt-1 text-sm text-paper-dim">{item.body}</p></div>)}</div><div className="mt-4 flex gap-2"><input aria-label={`Reply to ${post.title}`} value={reply[post.id] ?? ''} onChange={(e) => setReply({ ...reply, [post.id]: e.target.value })} placeholder="Write a helpful reply" className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/4 px-3 text-sm text-paper placeholder:text-paper-faint focus:border-sky/70 focus:outline-none" /><Button size="sm" onClick={() => void addReply(post.id)}>Reply</Button></div></div></div></Card>) : <Card interactive={false} className="p-8 text-center text-sm text-paper-faint">No discussions yet. Start the first one.</Card>}</div>
  </div>
}
