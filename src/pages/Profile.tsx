import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, Bookmark, BookOpen, Clock3, LogOut, Mail, MapPin, Pencil, Upload } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/features/auth/useAuth'
import { supabase } from '@/lib/supabase'
import { fetchAcademicCatalog, updateProfile } from '@/services/profileService'
import { fetchMySubmissions, fetchSavedResources, type ResourceRecord } from '@/services/resourceService'
import { fetchRequests, fetchTickets, type RequestRecord, type TicketRecord } from '@/services/workflowService'
import { Overview, RequestList, SubmissionList, TicketList } from '@/pages/ProfileSections'

type ProfileTab = 'overview' | 'submissions' | 'requests' | 'support'

export function Profile() {
  const { user, profile, refreshProfile, signOut } = useAuth()
  const [tab, setTab] = useState<ProfileTab>('overview')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<ResourceRecord[]>([])
  const [requests, setRequests] = useState<RequestRecord[]>([])
  const [tickets, setTickets] = useState<TicketRecord[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [aiCount, setAiCount] = useState(0)
  const [catalog, setCatalog] = useState<Awaited<ReturnType<typeof fetchAcademicCatalog>>>({
    colleges: [], branches: [], semesters: [], subjects: [],
  })

  useEffect(() => {
    if (!supabase || !user) return
    void Promise.allSettled([
      fetchMySubmissions(supabase, user.id),
      fetchRequests(supabase, user.id),
      fetchTickets(supabase, user.id),
      fetchSavedResources(supabase, user.id),
      fetchAcademicCatalog(supabase),
      supabase.from('ai_history').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]).then((results) => {
      const failures: string[] = []
      const getValue = <T,>(index: number): T | null => {
        const result = results[index]
        if (result.status === 'fulfilled') return result.value as T
        failures.push(result.reason instanceof Error ? result.reason.message : 'One profile section could not be loaded.')
        return null
      }

      const owned = getValue<ResourceRecord[]>(0)
      const requested = getValue<RequestRecord[]>(1)
      const supported = getValue<TicketRecord[]>(2)
      const saved = getValue<ResourceRecord[]>(3)
      const academic = getValue<Awaited<ReturnType<typeof fetchAcademicCatalog>>>(4)
      const ai = getValue<{ count: number | null }>(5)

      if (owned) setSubmissions(owned)
      if (requested) setRequests(requested)
      if (supported) setTickets(supported)
      if (saved) setSavedCount(saved.length)
      if (academic) setCatalog(academic)
      if (ai) setAiCount(ai.count ?? 0)
      if (failures.length) setError(failures.join(' '))
    })
  }, [user])

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !user || !profile) return
    const form = new FormData(event.currentTarget)
    const input = {
      fullName: String(form.get('fullName') ?? '').trim(),
      collegeId: String(form.get('collegeId') ?? ''),
      branchId: String(form.get('branchId') ?? ''),
      semesterId: String(form.get('semesterId') ?? ''),
      language: String(form.get('language') ?? 'English') as 'English' | 'Hindi' | 'Gujarati',
    }
    if (!input.fullName || !input.collegeId || !input.branchId || !input.semesterId) {
      setError('Complete your name, college, branch, and semester.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await updateProfile(supabase, user.id, {
        full_name: input.fullName,
        college_id: input.collegeId,
        branch_id: input.branchId,
        semester_id: input.semesterId,
        preferred_language: input.language,
      })
      await refreshProfile()
      setEditing(false)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const initials = (profile?.full_name || user?.email || 'Student')
    .split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'S'

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Student account</p><h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">My profile</h1><p className="mt-2 text-sm leading-6 text-paper-dim">Your account, academic details, uploads, and study activity.</p></div>
        <Button variant="secondary" icon={<LogOut className="size-4" />} onClick={() => void signOut().then(() => window.location.assign('/login'))}>Sign out</Button>
      </header>
      {error && <p className="rounded-xl border border-sky/30 bg-sky-wash px-4 py-3 text-sm text-sky" role="alert">{error}</p>}
      <section className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <Card interactive={false} className="p-6">
          <div className="flex items-center gap-4">
            {profile?.avatar_url || user?.user_metadata.avatar_url || user?.user_metadata.picture
              ? <img src={String(profile?.avatar_url || user?.user_metadata.avatar_url || user?.user_metadata.picture)} alt="" className="size-16 rounded-2xl object-cover" />
              : <div className="grid size-16 place-items-center rounded-2xl bg-sky text-xl font-bold text-ink">{initials}</div>}
            <div className="min-w-0"><h2 className="truncate font-display text-xl font-semibold text-paper">{profile?.full_name || 'Student'}</h2><p className="mt-1 flex items-center gap-1.5 truncate text-sm text-paper-dim"><Mail className="size-3.5" />{profile?.email || user?.email}</p></div>
          </div>
          <div className="mt-6 space-y-3 border-t border-white/8 pt-5 text-sm">
            <ProfileLine icon={MapPin} label="College" value={profile?.college?.name || 'Not set'} />
            <ProfileLine icon={BookOpen} label="Branch" value={profile?.branch?.name || 'Not set'} />
            <ProfileLine icon={Clock3} label="Semester" value={profile?.semester?.label || 'Not set'} />
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Submissions" value={submissions.length} icon={Upload} />
          <Stat label="Saved" value={savedCount} icon={Bookmark} />
          <Stat label="Requests" value={requests.length} icon={ArrowRight} />
          <Stat label="AI activity" value={aiCount} icon={Pencil} />
        </div>
      </section>
      <div className="flex gap-2 overflow-x-auto border-b border-white/8 pb-3">
        {(['overview', 'submissions', 'requests', 'support'] as ProfileTab[]).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`shrink-0 rounded-lg px-3 py-2 text-sm capitalize ${tab === item ? 'bg-sky-wash text-sky' : 'text-paper-dim hover:text-paper'}`}>{item}</button>
        ))}
      </div>
      {tab === 'overview' && <Overview editing={editing} setEditing={setEditing} profile={profile} catalog={catalog} saving={saving} onSave={saveProfile} tickets={tickets} />}
      {tab === 'submissions' && <SubmissionList submissions={submissions} />}
      {tab === 'requests' && <RequestList requests={requests} />}
      {tab === 'support' && <TicketList tickets={tickets} />}
    </div>
  )
}

function ProfileLine({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="flex items-start gap-3"><Icon className="mt-0.5 size-4 shrink-0 text-sky" aria-hidden="true" /><div><p className="text-xs text-paper-faint">{label}</p><p className="mt-0.5 text-paper">{value}</p></div></div>
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return <Card interactive={false} className="p-4 sm:p-5"><Icon className="size-4 text-sky" aria-hidden="true" /><p className="mt-3 font-display text-2xl font-semibold text-paper">{value}</p><p className="mt-1 text-xs text-paper-dim">{label}</p></Card>
}
