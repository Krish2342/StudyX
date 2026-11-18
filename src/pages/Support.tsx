import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { useAuth } from '@/features/auth/useAuth'
import { createTicket, fetchTickets, type TicketRecord } from '@/services/workflowService'
import { supabase } from '@/lib/supabase'

export function Support() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<TicketRecord[]>([])
  const [form, setForm] = useState({ category: 'question', subject: '', message: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(() => user && supabase && fetchTickets(supabase, user.id).then(setTickets).catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load tickets.')), [user])
  useEffect(() => { void load() }, [load])
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !user) return
    setBusy(true); setError(null)
    try { await createTicket(supabase, user.id, form); setForm({ category: 'question', subject: '', message: '' }); await load() } catch (e) { setError(e instanceof Error ? e.message : 'Unable to create ticket.') } finally { setBusy(false) }
  }
  return <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
    <Card interactive={false} className="p-6"><p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Support center</p><h1 className="mt-3 font-display text-3xl font-semibold text-paper">How can we help?</h1><form onSubmit={submit} className="mt-6 grid gap-4"><label className="flex flex-col gap-1.5 text-sm font-medium text-paper">Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-11 rounded-control border border-white/10 bg-white/4 px-3 text-sm text-paper"><option value="question">Question</option><option value="bug">Bug</option><option value="broken_resource">Broken resource</option><option value="feedback">Feedback</option></select></label><Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /><Textarea label="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /><Button type="submit" disabled={busy}>{busy ? 'Sending...' : 'Create ticket'}</Button>{error && <p className="text-sm text-sky" role="alert">{error}</p>}</form></Card>
    <Card interactive={false} className="p-6"><h2 className="font-display text-xl font-semibold text-paper">Your tickets</h2>{tickets.length ? <div className="mt-4 divide-y divide-white/8">{tickets.map((ticket) => <div key={ticket.id} className="py-4"><div className="flex justify-between gap-3"><h3 className="font-medium text-paper">{ticket.subject}</h3><span className="text-xs capitalize text-sky">{ticket.status.replace('_', ' ')}</span></div><p className="mt-1 text-xs text-paper-faint">{ticket.ticket_number} Ã‚Â· {ticket.category}</p><p className="mt-2 text-sm text-paper-dim">{ticket.message}</p></div>)}</div> : <p className="mt-5 text-sm text-paper-faint">No tickets yet.</p>}</Card>
  </div>
}
