import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { useAuth } from '@/features/auth/useAuth'
import { createRequest, fetchRequests, type RequestRecord } from '@/services/workflowService'
import { supabase } from '@/lib/supabase'

export function Requests() {
  const { user } = useAuth()
  const [items, setItems] = useState<RequestRecord[]>([])
  const [form, setForm] = useState({ resourceType: '', description: '', message: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(() => user && supabase && fetchRequests(supabase, user.id).then(setItems).catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load requests.')), [user])
  useEffect(() => { void load() }, [load])
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !user) return
    setBusy(true); setError(null)
    try { await createRequest(supabase, user.id, form); setForm({ resourceType: '', description: '', message: '' }); await load() } catch (e) { setError(e instanceof Error ? e.message : 'Unable to submit request.') } finally { setBusy(false) }
  }
  return <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
    <Card interactive={false} className="p-6"><p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Resource requests</p><h1 className="mt-3 font-display text-3xl font-semibold text-paper">Need something?</h1><p className="mt-2 text-sm leading-6 text-paper-dim">Tell us what would help your studies. The request goes to the Super Admin queue.</p><form onSubmit={submit} className="mt-6 grid gap-4"><Input label="Resource type" value={form.resourceType} onChange={(e) => setForm({ ...form, resourceType: e.target.value })} placeholder="Notes, book, previous paper..." required /><Textarea label="What do you need?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /><Textarea label="Additional details" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /><Button type="submit" disabled={busy}>{busy ? 'Sending...' : 'Submit request'}</Button>{error && <p className="text-sm text-sky" role="alert">{error}</p>}</form></Card>
    <Card interactive={false} className="p-6"><h2 className="font-display text-xl font-semibold text-paper">Your requests</h2>{items.length ? <div className="mt-4 divide-y divide-white/8">{items.map((item) => <div key={item.id} className="py-4"><div className="flex justify-between gap-3"><h3 className="font-medium text-paper">{item.request_description}</h3><span className="text-xs capitalize text-sky">{item.status.replace('_', ' ')}</span></div><p className="mt-1 text-xs text-paper-faint">{item.resource_type} Â· {new Date(item.created_at).toLocaleDateString()}</p>{item.admin_note && <p className="mt-2 text-sm text-paper-dim">{item.admin_note}</p>}</div>)}</div> : <p className="mt-5 text-sm text-paper-faint">No requests yet.</p>}</Card>
  </div>
}
