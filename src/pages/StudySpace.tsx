import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/features/auth/useAuth'
import { fetchMySubmissions, type ResourceRecord } from '@/services/resourceService'
import { supabase } from '@/lib/supabase'

export function StudySpace() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<ResourceRecord[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase || !user) return
    fetchMySubmissions(supabase, user.id)
      .then(setSubmissions)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load submissions.'))
  }, [user])

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Your workspace</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">My study space</h1>
        <p className="mt-2 text-sm leading-6 text-paper-dim">Saved resources and the resources you have submitted for review.</p>
      </header>
      <Card interactive={false} className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-xl font-semibold text-paper">My submissions</h2><p className="mt-1 text-sm text-paper-dim">Approval status is updated by the Super Admin.</p></div><Link to="/app/explore/submit" className="text-sm font-semibold text-sky hover:text-sky-bright">Submit another</Link></div>
        {error && <p className="mt-5 text-sm text-sky" role="alert">{error}</p>}
        {submissions.length ? <div className="mt-6 divide-y divide-white/8">{submissions.map((resource) => <div key={resource.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-medium text-paper">{resource.title}</h3><p className="mt-1 text-xs text-paper-faint">{resource.resource_type} Â· {new Date(resource.created_at).toLocaleDateString()}</p></div><Status status={resource.status} note={resource.admin_note} /></div>)}</div> : <p className="mt-8 rounded-xl border border-white/8 bg-white/3 p-5 text-sm text-paper-dim">You have not submitted a resource yet.</p>}
      </Card>
    </div>
  )
}

function Status({ status, note }: { status: ResourceRecord['status']; note: string | null }) {
  const label = status === 'approved' ? 'Approved' : status === 'rejected' ? 'Needs changes' : status === 'removed' ? 'Removed' : 'Pending review'
  return <div className="text-left sm:text-right"><span className="rounded-full border border-sky/30 bg-sky-wash px-3 py-1 text-xs font-semibold text-sky">{label}</span>{note && <p className="mt-2 max-w-xs text-xs text-paper-faint">{note}</p>}</div>
}
