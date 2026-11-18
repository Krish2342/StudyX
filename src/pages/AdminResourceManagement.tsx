import { useEffect, useState } from 'react'
import { Check, ExternalLink, RotateCcw, X } from 'lucide-react'
import { AdminShell } from '@/features/admin/components/AdminShell'
import { AdminStatusPill } from '@/features/admin/components/AdminBrand'
import { useAdminAuth } from '@/features/admin/auth/adminAuthContext'
import { Card } from '@/components/ui/Card'
import { fetchAdminResources, reviewResource, type ResourceRecord, type ResourceStatus } from '@/services/resourceService'
import { supabase } from '@/lib/supabase'

const tabs: Array<{ value: ResourceStatus; label: string }> = [
  { value: 'pending', label: 'Pending review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'removed', label: 'Removed' },
]

export function AdminResourceManagement() {
  const { user } = useAdminAuth()
  const [status, setStatus] = useState<ResourceStatus>('pending')
  const [resources, setResources] = useState<ResourceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase || !user) return
    let active = true
    fetchAdminResources(supabase, status)
      .then((items) => active && setResources(items))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : 'Unable to load resources.'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [status, user])

  async function review(resourceId: string, nextStatus: Exclude<ResourceStatus, 'pending'>, note: string) {
    if (!supabase) return
    try {
      await reviewResource(supabase, resourceId, nextStatus, note)
      setResources((current) => current.filter((resource) => resource.id !== resourceId))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to review resource.')
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        <div>
          <AdminStatusPill tone="ok">Content review</AdminStatusPill>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">Resource management</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-paper-dim">Review student submissions before they become visible in the approved library.</p>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-white/8 pb-3">
          {tabs.map((tab) => <button key={tab.value} type="button" onClick={() => { setLoading(true); setStatus(tab.value) }} className={`rounded-lg px-3 py-2 text-sm ${status === tab.value ? 'bg-admin-wash text-admin-accent' : 'text-paper-dim hover:text-paper'}`}>{tab.label}</button>)}
        </div>
        {error && <p className="rounded-xl border border-admin-pink/30 bg-admin-pink-wash px-4 py-3 text-sm text-paper" role="alert">{error}</p>}
        {loading ? <p className="py-12 text-center text-sm text-paper-faint">Loading resources...</p> : resources.length ? <div className="grid gap-4">{resources.map((resource) => <ReviewCard key={resource.id} resource={resource} onReview={review} />)}</div> : <Card interactive={false} className="p-10 text-center"><h2 className="font-display text-xl font-semibold text-paper">No {status} resources</h2><p className="mt-2 text-sm text-paper-dim">New submissions will appear here when students share them.</p></Card>}
      </div>
    </AdminShell>
  )
}

function ReviewCard({ resource, onReview }: { resource: ResourceRecord; onReview: (id: string, status: Exclude<ResourceStatus, 'pending'>, note: string) => Promise<void> }) {
  const [note, setNote] = useState('')
  return <Card interactive={false} className="p-5 sm:p-6">
    <div className="flex flex-col justify-between gap-4 lg:flex-row">
      <div>
        <p className="text-xs font-semibold tracking-wide text-admin-accent uppercase">{resource.resource_type}</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-paper">{resource.title}</h2>
        <p className="mt-2 text-sm text-paper-dim">{resource.college?.name} · {resource.branch?.name} · {resource.semester?.label} · {resource.subject?.name}</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-paper-faint">{resource.description || 'No description provided.'}</p>
        <a href={resource.google_drive_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-admin-accent hover:text-paper">Open submitted link <ExternalLink className="size-4" aria-hidden="true" /></a>
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:min-w-64">
        <label className="text-xs font-medium text-paper-dim">Review note <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Optional feedback" className="mt-1 w-full rounded-lg border border-white/10 bg-white/4 p-3 text-sm text-paper placeholder:text-paper-faint focus:border-admin-accent focus:outline-none" /></label>
        {resource.status === 'pending' && <><button type="button" onClick={() => void onReview(resource.id, 'approved', note)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-admin-accent px-4 text-sm font-semibold text-white hover:bg-admin-accent-strong"><Check className="size-4" aria-hidden="true" /> Approve</button><button type="button" onClick={() => void onReview(resource.id, 'rejected', note)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-admin-pink/40 px-4 text-sm font-semibold text-paper hover:bg-admin-pink-wash"><X className="size-4" aria-hidden="true" /> Reject</button></>}
        {resource.status === 'approved' && <button type="button" onClick={() => void onReview(resource.id, 'removed', note)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-admin-pink/40 px-4 text-sm font-semibold text-paper hover:bg-admin-pink-wash"><X className="size-4" aria-hidden="true" /> Remove</button>}
        {(resource.status === 'rejected' || resource.status === 'removed') && <button type="button" onClick={() => void onReview(resource.id, 'approved', note)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-admin-accent px-4 text-sm font-semibold text-white hover:bg-admin-accent-strong"><RotateCcw className="size-4" aria-hidden="true" /> Approve again</button>}
      </div>
    </div>
  </Card>
}
