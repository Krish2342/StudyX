import { useEffect, useState } from 'react'
import { ArrowLeft, Bookmark, ExternalLink, Flag, Share2, Star, X } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/hooks/useToast'
import { useAuth } from '@/features/auth/useAuth'
import { fetchResource, rateResource, reportResource, toggleBookmark, trackResourceEvent, type ResourceRecord, type ResourceReportReason } from '@/services/resourceService'
import { supabase } from '@/lib/supabase'

export function ResourceDetail() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [resource, setResource] = useState<ResourceRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState<ResourceReportReason>('broken_link')
  const [reportDetails, setReportDetails] = useState('')
  const [reporting, setReporting] = useState(false)

  useEffect(() => {
    if (!supabase || !user || !resourceId) return
    fetchResource(supabase, user.id, resourceId)
      .then(setResource)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load resource.'))
      .finally(() => setLoading(false))
    void trackResourceEvent(supabase, resourceId, 'view')
  }, [resourceId, user])

  async function save() {
    if (!supabase || !user || !resource) return
    try {
      await toggleBookmark(supabase, user.id, resource.id, resource.is_bookmarked)
      setResource({ ...resource, is_bookmarked: !resource.is_bookmarked })
    } catch (reason) {
      toast(reason instanceof Error ? reason.message : 'Unable to update saved resources.', 'error')
    }
  }

  async function rate(rating: number) {
    if (!supabase || !user || !resource) return
    try {
      await rateResource(supabase, user.id, resource.id, rating)
      toast('Your rating was saved.', 'success')
      const refreshed = await fetchResource(supabase, user.id, resource.id)
      setResource(refreshed)
    } catch (reason) {
      toast(reason instanceof Error ? reason.message : 'Unable to save rating.', 'error')
    }
  }

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: resource?.title, url })
      else {
        await navigator.clipboard.writeText(url)
        toast('Resource link copied.', 'success')
      }
      if (supabase && resource) void trackResourceEvent(supabase, resource.id, 'share')
    } catch (reason) {
      if (reason instanceof Error && reason.name !== 'AbortError') toast('Unable to share this resource.', 'error')
    }

  }

  async function report() {
    if (!supabase || !user || !resource) return
    setReporting(true)
    try {
      await reportResource(supabase, user.id, resource.id, reportReason, reportDetails)
      setReportOpen(false)
      setReportDetails('')
      toast('Thank you. Your report was sent for review.', 'success')
    } catch (reason) {
      toast(reason instanceof Error ? reason.message : 'Unable to report this resource.', 'error')
    } finally {
      setReporting(false)
    }
  }

  if (loading) return <p className="py-16 text-center text-sm text-paper-faint">Loading resource...</p>
  if (error || !resource) return <Card interactive={false} className="mx-auto max-w-2xl p-8 text-center"><h1 className="font-display text-2xl font-semibold text-paper">Resource unavailable</h1><p className="mt-2 text-sm text-paper-dim">{error ?? 'This resource may have been removed.'}</p><Button className="mt-6" onClick={() => navigate('/app/explore')}>Back to explore</Button></Card>

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link to="/app/explore" className="inline-flex items-center gap-2 text-sm text-paper-dim hover:text-sky"><ArrowLeft className="size-4" aria-hidden="true" /> Back to explore</Link>
      <Card interactive={false} className="overflow-hidden">
        <div className="flex min-h-52 items-end bg-linear-to-br from-sky-wash to-ink-raised-2 p-6 sm:p-8">
          <div>
            <span className="rounded-full border border-sky/30 bg-ink/60 px-3 py-1 text-xs font-semibold text-sky">{resource.resource_type}</span>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">{resource.title}</h1>
          </div>
        </div>
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_240px]">
          <div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-paper-dim">{resource.description || 'No description was provided.'}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-paper-faint">
              <span>{resource.college?.name}</span><span>Ã‚Â·</span><span>{resource.branch?.name}</span><span>Ã‚Â·</span><span>{resource.semester?.label}</span><span>Ã‚Â·</span><span>{resource.subject?.name}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={resource.google_drive_url} target="_blank" rel="noreferrer"><Button icon={<ExternalLink className="size-4" />}>Open resource</Button></a>
              <Button variant="secondary" icon={<Bookmark className={`size-4 ${resource.is_bookmarked ? 'fill-sky text-sky' : ''}`} />} onClick={() => void save()}>{resource.is_bookmarked ? 'Saved' : 'Save'}</Button>
              <Button variant="secondary" icon={<Share2 className="size-4" />} onClick={() => void share()}>Share</Button>
              <Button variant="ghost" icon={<Flag className="size-4" />} onClick={() => setReportOpen(true)}>Report</Button>
            </div>
          </div>
          <aside className="rounded-xl border border-white/8 bg-white/3 p-4">
            <p className="text-xs font-semibold tracking-wide text-paper-faint uppercase">Your rating</p>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`Rate ${value} stars`} onClick={() => void rate(value)} className="text-paper-faint hover:text-sky"><Star className="size-5" /></button>)}
            </div>
            <p className="mt-4 text-sm text-paper-dim">{resource.rating ? `${resource.rating.toFixed(1)} average from ${resource.rating_count} rating${resource.rating_count === 1 ? '' : 's'}` : 'No ratings yet'}</p>
          </aside>
        </div>
      </Card>
      {reportOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4" role="dialog" aria-modal="true" aria-labelledby="report-resource-title">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-raised p-6 shadow-float">
            <div className="flex items-center justify-between gap-4">
              <h2 id="report-resource-title" className="font-display text-xl font-semibold text-paper">Report resource</h2>
              <button type="button" onClick={() => setReportOpen(false)} aria-label="Close report dialog" className="text-paper-faint hover:text-paper"><X className="size-5" aria-hidden="true" /></button>
            </div>
            <p className="mt-2 text-sm leading-6 text-paper-dim">Tell us what needs attention. Reports are reviewed by the Super Admin.</p>
            <label className="mt-5 flex flex-col gap-1.5 text-sm font-medium text-paper">Reason
              <select value={reportReason} onChange={(event) => setReportReason(event.target.value as ResourceReportReason)} className="h-11 rounded-control border border-white/10 bg-white/4 px-3 text-sm text-paper focus:border-sky/70 focus:outline-none">
                <option value="broken_link">Broken or inaccessible link</option>
                <option value="incorrect_content">Incorrect academic content</option>
                <option value="copyright">Copyright concern</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-paper">Details
              <textarea value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} rows={4} maxLength={1000} className="rounded-control border border-white/10 bg-white/4 p-3 text-sm text-paper focus:border-sky/70 focus:outline-none" />
            </label>
            <Button className="mt-5 w-full" onClick={() => void report()} disabled={reporting}>{reporting ? 'Sending...' : 'Send report'}</Button>
          </div>
        </div>
      )}
    </div>
  )
}
